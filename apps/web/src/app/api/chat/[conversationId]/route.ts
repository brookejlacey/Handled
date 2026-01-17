import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import {
  getAuthenticatedUser,
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
  serverErrorResponse,
} from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{ conversationId: string }>;
}

// GET /api/chat/[conversationId] - Get conversation with messages
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { dbUser, error } = await getAuthenticatedUser();
    if (error || !dbUser) {
      return unauthorizedResponse();
    }

    const { conversationId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: dbUser.id,
      },
    });

    if (!conversation) {
      return notFoundResponse('Conversation not found');
    }

    const [messages, total] = await Promise.all([
      prisma.chatMessage.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        take: limit,
        skip: offset,
      }),
      prisma.chatMessage.count({ where: { conversationId } }),
    ]);

    return successResponse({
      conversation,
      messages,
      total,
      limit,
      offset,
    });
  } catch (err) {
    console.error('Error fetching conversation:', err);
    return serverErrorResponse();
  }
}

// DELETE /api/chat/[conversationId] - Delete conversation
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { dbUser, error } = await getAuthenticatedUser();
    if (error || !dbUser) {
      return unauthorizedResponse();
    }

    const { conversationId } = await params;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: dbUser.id,
      },
    });

    if (!conversation) {
      return notFoundResponse('Conversation not found');
    }

    await prisma.conversation.delete({
      where: { id: conversationId },
    });

    return successResponse({ deleted: true });
  } catch (err) {
    console.error('Error deleting conversation:', err);
    return serverErrorResponse();
  }
}
