import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import {
  getAuthenticatedUser,
  successResponse,
  errorResponse,
  unauthorizedResponse,
  serverErrorResponse,
  validateRequiredFields,
} from '@/lib/api-utils';

// POST /api/chat/feedback - Submit feedback for a message
export async function POST(request: NextRequest) {
  try {
    const { dbUser, error } = await getAuthenticatedUser();
    if (error || !dbUser) {
      return unauthorizedResponse();
    }

    const body = await request.json();

    const validationError = validateRequiredFields(body, ['messageId', 'rating']);
    if (validationError) {
      return errorResponse(validationError);
    }

    const { messageId, rating, comment } = body;

    // Validate rating
    if (!['HELPFUL', 'NOT_HELPFUL'].includes(rating)) {
      return errorResponse('Invalid rating. Must be HELPFUL or NOT_HELPFUL');
    }

    // Verify the message exists and belongs to user's conversation
    const message = await prisma.chatMessage.findFirst({
      where: {
        id: messageId,
        role: 'ASSISTANT',
        conversation: {
          userId: dbUser.id,
        },
      },
    });

    if (!message) {
      return errorResponse('Message not found or not accessible');
    }

    // Check if feedback already exists
    const existingFeedback = await prisma.chatFeedback.findUnique({
      where: { messageId },
    });

    let feedback;
    if (existingFeedback) {
      // Update existing feedback
      feedback = await prisma.chatFeedback.update({
        where: { messageId },
        data: {
          rating,
          comment: comment || null,
        },
      });
    } else {
      // Create new feedback
      feedback = await prisma.chatFeedback.create({
        data: {
          messageId,
          userId: dbUser.id,
          rating,
          comment: comment || null,
        },
      });
    }

    return successResponse({
      feedback: {
        id: feedback.id,
        messageId: feedback.messageId,
        rating: feedback.rating,
        comment: feedback.comment,
      },
    });
  } catch (err) {
    console.error('Error submitting feedback:', err);
    return serverErrorResponse();
  }
}

// GET /api/chat/feedback?messageId=xxx - Get feedback for a specific message
export async function GET(request: NextRequest) {
  try {
    const { dbUser, error } = await getAuthenticatedUser();
    if (error || !dbUser) {
      return unauthorizedResponse();
    }

    const searchParams = request.nextUrl.searchParams;
    const messageId = searchParams.get('messageId');

    if (!messageId) {
      return errorResponse('messageId is required');
    }

    // Verify the message belongs to user's conversation
    const message = await prisma.chatMessage.findFirst({
      where: {
        id: messageId,
        conversation: {
          userId: dbUser.id,
        },
      },
      include: {
        feedback: true,
      },
    });

    if (!message) {
      return errorResponse('Message not found or not accessible');
    }

    return successResponse({
      feedback: message.feedback,
    });
  } catch (err) {
    console.error('Error fetching feedback:', err);
    return serverErrorResponse();
  }
}
