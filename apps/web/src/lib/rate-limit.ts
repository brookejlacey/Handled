import prisma from '@/lib/prisma';

// Free tier limits
export const FREE_TIER_LIMITS = {
  messagesPerMonth: 10,
  documentsPerMonth: 3,
};

// Premium tiers have unlimited access
export const UNLIMITED_TIERS = ['MONTHLY', 'ANNUAL'];

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetDate: Date;
}

/**
 * Get the start of the current month in UTC
 */
function getMonthStart(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

/**
 * Get the start of the next month in UTC
 */
function getNextMonthStart(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
}

/**
 * Check if user has remaining AI chat messages for the month
 */
export async function checkChatRateLimit(
  userId: string,
  subscriptionTier: string
): Promise<RateLimitResult> {
  // Premium users have unlimited access
  if (UNLIMITED_TIERS.includes(subscriptionTier)) {
    return {
      allowed: true,
      remaining: -1, // -1 indicates unlimited
      limit: -1,
      resetDate: getNextMonthStart(),
    };
  }

  const monthStart = getMonthStart();
  const limit = FREE_TIER_LIMITS.messagesPerMonth;

  // Count user messages sent this month
  const messageCount = await prisma.chatMessage.count({
    where: {
      conversation: {
        userId: userId,
      },
      role: 'USER',
      createdAt: {
        gte: monthStart,
      },
    },
  });

  const remaining = Math.max(0, limit - messageCount);

  return {
    allowed: remaining > 0,
    remaining,
    limit,
    resetDate: getNextMonthStart(),
  };
}

/**
 * Check if user has remaining document uploads for the month
 */
export async function checkDocumentRateLimit(
  userId: string,
  subscriptionTier: string
): Promise<RateLimitResult> {
  // Premium users have unlimited access
  if (UNLIMITED_TIERS.includes(subscriptionTier)) {
    return {
      allowed: true,
      remaining: -1,
      limit: -1,
      resetDate: getNextMonthStart(),
    };
  }

  const monthStart = getMonthStart();
  const limit = FREE_TIER_LIMITS.documentsPerMonth;

  // Count documents uploaded this month
  const documentCount = await prisma.document.count({
    where: {
      userId: userId,
      createdAt: {
        gte: monthStart,
      },
    },
  });

  const remaining = Math.max(0, limit - documentCount);

  return {
    allowed: remaining > 0,
    remaining,
    limit,
    resetDate: getNextMonthStart(),
  };
}

/**
 * Get usage statistics for a user
 */
export async function getUserUsageStats(
  userId: string,
  subscriptionTier: string
): Promise<{
  chat: RateLimitResult;
  documents: RateLimitResult;
}> {
  const [chat, documents] = await Promise.all([
    checkChatRateLimit(userId, subscriptionTier),
    checkDocumentRateLimit(userId, subscriptionTier),
  ]);

  return { chat, documents };
}
