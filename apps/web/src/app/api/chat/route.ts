import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { chat, chatStream, type ChatMessage } from '@/lib/claude';
import {
  getAuthenticatedUser,
  successResponse,
  errorResponse,
  unauthorizedResponse,
  serverErrorResponse,
  validateRequiredFields,
} from '@/lib/api-utils';

// GET /api/chat - List conversations
export async function GET(request: NextRequest) {
  try {
    const { dbUser, error } = await getAuthenticatedUser();
    if (error || !dbUser) {
      return unauthorizedResponse();
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where: { userId: dbUser.id },
        orderBy: { updatedAt: 'desc' },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        take: limit,
        skip: offset,
      }),
      prisma.conversation.count({ where: { userId: dbUser.id } }),
    ]);

    return successResponse({ conversations, total, limit, offset });
  } catch (err) {
    console.error('Error fetching conversations:', err);
    return serverErrorResponse();
  }
}

// POST /api/chat - Send message (creates conversation if needed)
export async function POST(request: NextRequest) {
  try {
    const { dbUser, error } = await getAuthenticatedUser();
    if (error || !dbUser) {
      return unauthorizedResponse();
    }

    const body = await request.json();

    const validationError = validateRequiredFields(body, ['message']);
    if (validationError) {
      return errorResponse(validationError);
    }

    const { message, conversationId, stream = false } = body;

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, userId: dbUser.id },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 50, // Last 50 messages for context
          },
        },
      });

      if (!conversation) {
        return errorResponse('Conversation not found');
      }
    } else {
      // Create new conversation
      conversation = await prisma.conversation.create({
        data: {
          userId: dbUser.id,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        },
        include: {
          messages: true,
        },
      });
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'USER',
        content: message,
      },
    });

    // Build message history for Claude
    const messageHistory: ChatMessage[] = conversation.messages.map((m) => ({
      role: m.role === 'USER' ? 'user' : 'assistant',
      content: m.content,
    }));
    messageHistory.push({ role: 'user', content: message });

    // Build user context for personalization
    const userContext = `User: ${dbUser.email}. Subscription: ${dbUser.subscriptionTier}.`;

    if (stream) {
      // Return streaming response
      const encoder = new TextEncoder();
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            let fullResponse = '';
            const generator = chatStream(messageHistory, userContext);

            let result = await generator.next();
            while (!result.done) {
              const chunk = result.value as string;
              fullResponse += chunk;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
              result = await generator.next();
            }

            // Save assistant response
            const usage = result.value as { promptTokens: number; completionTokens: number };
            await prisma.chatMessage.create({
              data: {
                conversationId: conversation.id,
                role: 'ASSISTANT',
                content: fullResponse,
                promptTokens: usage.promptTokens,
                completionTokens: usage.completionTokens,
              },
            });

            // Update conversation timestamp
            await prisma.conversation.update({
              where: { id: conversation.id },
              data: { updatedAt: new Date() },
            });

            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, conversationId: conversation.id })}\n\n`));
            controller.close();
          } catch (err) {
            console.error('Streaming error:', err);
            controller.error(err);
          }
        },
      });

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Non-streaming response
      const response = await chat(messageHistory, userContext);

      // Save assistant response
      const assistantMessage = await prisma.chatMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'ASSISTANT',
          content: response.message,
          promptTokens: response.promptTokens,
          completionTokens: response.completionTokens,
        },
      });

      // Update conversation timestamp
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
      });

      return successResponse({
        conversationId: conversation.id,
        message: assistantMessage,
      });
    }
  } catch (err) {
    console.error('Error in chat:', err);
    return serverErrorResponse();
  }
}
