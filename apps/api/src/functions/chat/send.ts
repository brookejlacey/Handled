import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';
import { authenticateRequest, requireSubscription } from '../../middleware/auth';
import prisma from '../../utils/db';
import { success, badRequest, subscriptionRequired, serverError } from '../../utils/response';

const sendMessageSchema = z.object({
  conversationId: z.string().uuid().optional(),
  content: z.string().min(1, 'Message cannot be empty').max(4000),
  context: z
    .enum(['general', 'task_help', 'document_review', 'financial_question', 'emotional_support'])
    .optional()
    .default('general'),
});

const SYSTEM_PROMPT = `You are a helpful financial assistant for the Handled app - a judgment-free financial life maintenance tool for women aged 30-50. Your role is to help users understand and manage their personal finances.

Key principles:
1. Be warm, supportive, and non-judgmental. Money can be an emotional topic.
2. Explain financial concepts in plain language, avoiding jargon.
3. Never shame users for what they don't know - there's no such thing as a dumb question.
4. Focus on actionable advice and practical steps.
5. When discussing specific financial products or strategies, remind users you can't provide personalized financial advice and they should consult a professional for their specific situation.
6. Keep responses concise but helpful - aim for clarity over length.
7. If a user seems stressed or overwhelmed, acknowledge their feelings before diving into advice.

You can help with:
- Understanding financial concepts (credit scores, retirement accounts, insurance, etc.)
- Explaining documents they upload
- Prioritizing financial tasks
- Providing emotional support around money stress
- Answering questions about financial maintenance tasks

You cannot:
- Provide specific investment recommendations
- Give tax advice for their specific situation
- Access real-time financial data or rates
- Execute financial transactions`;

async function sendMessage(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const auth = await authenticateRequest(request, context);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const body = await request.json();
    const validation = sendMessageSchema.safeParse(body);

    if (!validation.success) {
      return badRequest('Validation failed', {
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { conversationId, content, context: messageContext } = validation.data;

    // Check message limit for free users
    if (!requireSubscription(auth.user)) {
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const messageCount = await prisma.chatMessage.count({
        where: {
          conversation: {
            userId: auth.user.id,
          },
          role: 'user',
          createdAt: { gte: thisMonth },
        },
      });

      if (messageCount >= 10) {
        return subscriptionRequired(
          'Free users are limited to 10 messages per month. Upgrade for unlimited chat.'
        );
      }
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          userId: auth.user.id,
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 20, // Last 20 messages for context
          },
        },
      });

      if (!conversation) {
        return badRequest('Conversation not found');
      }
    } else {
      conversation = await prisma.conversation.create({
        data: {
          userId: auth.user.id,
          context: messageContext,
        },
        include: {
          messages: true,
        },
      });
    }

    // Save user message
    const userMessage = await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content,
      },
    });

    // Build message history for Claude
    const messages = [
      ...conversation.messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content },
    ];

    // Call Claude API
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    const assistantContent =
      response.content[0].type === 'text' ? response.content[0].text : '';

    // Save assistant message
    const assistantMessage = await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: assistantContent,
      },
    });

    // Update conversation title if it's new
    if (!conversation.title && conversation.messages.length === 0) {
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          title: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
        },
      });
    }

    return success({
      conversationId: conversation.id,
      message: {
        id: assistantMessage.id,
        role: 'assistant',
        content: assistantContent,
        createdAt: assistantMessage.createdAt,
      },
    });
  } catch (err) {
    context.error('Send message error:', err);
    return serverError('Failed to send message');
  }
}

app.http('sendMessage', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'chat/messages',
  handler: sendMessage,
});
