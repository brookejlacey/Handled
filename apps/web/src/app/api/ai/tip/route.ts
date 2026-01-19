import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import Anthropic from '@anthropic-ai/sdk';
import {
  getAuthenticatedUser,
  successResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from '@/lib/api-utils';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const TIP_SYSTEM_PROMPT = `You are a helpful financial wellness assistant for Handled, an app that helps women aged 30-50 complete financial maintenance tasks they keep putting off.

Generate a single, concise, personalized financial tip based on the user's profile and pending tasks. The tip should:
- Be 1-2 sentences max
- Be actionable and specific
- Feel warm and encouraging, not preachy
- Reference their actual situation when possible
- Focus on one thing they can do this week

Do not use bullet points. Just provide the tip as plain text.`;

export async function GET(_request: NextRequest) {
  try {
    const { dbUser, error } = await getAuthenticatedUser();
    if (error || !dbUser) {
      return unauthorizedResponse();
    }

    // Fetch user's pending tasks and onboarding data
    const [pendingTasks, onboardingData] = await Promise.all([
      prisma.task.findMany({
        where: {
          userId: dbUser.id,
          status: { in: ['NOT_STARTED', 'IN_PROGRESS'] },
        },
        orderBy: { dueDate: 'asc' },
        take: 10,
        select: {
          title: true,
          category: true,
          priority: true,
          dueDate: true,
        },
      }),
      prisma.onboardingData.findUnique({
        where: { userId: dbUser.id },
      }),
    ]);

    // Build context for the AI
    const contextParts = [`User: ${dbUser.displayName || dbUser.email}`];

    if (onboardingData) {
      if (onboardingData.ageRange) contextParts.push(`Age range: ${onboardingData.ageRange}`);
      if (onboardingData.employmentStatus) contextParts.push(`Employment: ${onboardingData.employmentStatus}`);
      if (onboardingData.relationshipStatus) contextParts.push(`Relationship: ${onboardingData.relationshipStatus}`);
      if (onboardingData.hasChildren !== null) contextParts.push(`Has children: ${onboardingData.hasChildren ? 'yes' : 'no'}`);
      if (onboardingData.hasRetirementAccounts !== null) contextParts.push(`Has retirement accounts: ${onboardingData.hasRetirementAccounts ? 'yes' : 'no'}`);
      if (onboardingData.hasOld401k !== null) contextParts.push(`Has old 401k to roll over: ${onboardingData.hasOld401k ? 'yes' : 'no'}`);
      if (onboardingData.hasLifeInsurance !== null) contextParts.push(`Has life insurance: ${onboardingData.hasLifeInsurance ? 'yes' : 'no'}`);
      if (onboardingData.hasWill !== null) contextParts.push(`Has will/estate plan: ${onboardingData.hasWill ? 'yes' : 'no'}`);
      if (onboardingData.hasEmergencyFund !== null) contextParts.push(`Has emergency fund: ${onboardingData.hasEmergencyFund ? 'yes' : 'no'}`);
      if (onboardingData.recentLifeEvents?.length) contextParts.push(`Recent life events: ${onboardingData.recentLifeEvents.join(', ')}`);
      if (onboardingData.financialGoals?.length) contextParts.push(`Financial goals: ${onboardingData.financialGoals.join(', ')}`);
    }

    if (pendingTasks.length > 0) {
      const taskSummary = pendingTasks.map(t => {
        const duePart = t.dueDate ? ` (due: ${new Date(t.dueDate).toLocaleDateString()})` : '';
        return `- ${t.title} [${t.category}]${duePart}`;
      }).join('\n');
      contextParts.push(`\nPending tasks:\n${taskSummary}`);
    } else {
      contextParts.push('\nNo pending tasks - user is all caught up!');
    }

    const userContext = contextParts.join('\n');

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 150,
      system: TIP_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Based on this user profile, generate a personalized financial tip:\n\n${userContext}`,
        },
      ],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    const tip = textContent?.type === 'text' ? textContent.text : 'Stay on top of your finances by checking in regularly. Small consistent actions add up to big results!';

    return successResponse({ tip });
  } catch (err) {
    console.error('Error generating AI tip:', err);
    // Return a fallback tip instead of error
    return successResponse({
      tip: 'Taking small steps toward your financial goals each week can make a big difference. Keep up the great work!',
    });
  }
}
