import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import {
  getAuthenticatedUser,
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
  serverErrorResponse,
} from '@/lib/api-utils';
import { TaskPriority, TaskStatus } from '@prisma/client';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/tasks/[id] - Get single task
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { dbUser, error } = await getAuthenticatedUser();
    if (error || !dbUser) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    const task = await prisma.task.findFirst({
      where: {
        id,
        userId: dbUser.id,
      },
      include: {
        template: true,
      },
    });

    if (!task) {
      return notFoundResponse('Task not found');
    }

    return successResponse(task);
  } catch (err) {
    console.error('Error fetching task:', err);
    return serverErrorResponse();
  }
}

// PATCH /api/tasks/[id] - Update task
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { dbUser, error } = await getAuthenticatedUser();
    if (error || !dbUser) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const body = await request.json();

    // Verify task belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { id, userId: dbUser.id },
    });

    if (!existingTask) {
      return notFoundResponse('Task not found');
    }

    // Validate priority enum if provided
    if (body.priority && !Object.values(TaskPriority).includes(body.priority)) {
      return errorResponse(`Invalid priority: ${body.priority}`);
    }

    // Validate status enum if provided
    if (body.status && !Object.values(TaskStatus).includes(body.status)) {
      return errorResponse(`Invalid status: ${body.status}`);
    }

    // Build update data
    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.status !== undefined) {
      updateData.status = body.status;
      // Set completedAt when marking as completed
      if (body.status === TaskStatus.COMPLETED) {
        updateData.completedAt = new Date();
        updateData.lastCompletedAt = new Date();
      }
    }
    if (body.dueDate !== undefined) {
      updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    }
    if (body.reminderDate !== undefined) {
      updateData.reminderDate = body.reminderDate ? new Date(body.reminderDate) : null;
    }
    if (body.steps !== undefined) updateData.steps = body.steps;
    if (body.notes !== undefined) updateData.notes = body.notes;

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        template: true,
      },
    });

    return successResponse(task);
  } catch (err) {
    console.error('Error updating task:', err);
    return serverErrorResponse();
  }
}

// DELETE /api/tasks/[id] - Delete task
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { dbUser, error } = await getAuthenticatedUser();
    if (error || !dbUser) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    // Verify task belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { id, userId: dbUser.id },
    });

    if (!existingTask) {
      return notFoundResponse('Task not found');
    }

    await prisma.task.delete({
      where: { id },
    });

    return successResponse({ deleted: true });
  } catch (err) {
    console.error('Error deleting task:', err);
    return serverErrorResponse();
  }
}
