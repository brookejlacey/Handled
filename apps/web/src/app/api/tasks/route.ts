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
import { TaskCategory, TaskPriority, TaskStatus } from '@prisma/client';

// GET /api/tasks - List tasks
export async function GET(request: NextRequest) {
  try {
    const { dbUser, error } = await getAuthenticatedUser();
    if (error || !dbUser) {
      return unauthorizedResponse();
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as TaskStatus | null;
    const category = searchParams.get('category') as TaskCategory | null;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = { userId: dbUser.id };
    if (status) where.status = status;
    if (category) where.category = category;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: [
          { dueDate: 'asc' },
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
        include: {
          template: {
            select: {
              id: true,
              title: true,
              steps: true,
              tips: true,
              estimatedMinutes: true,
            },
          },
        },
        take: limit,
        skip: offset,
      }),
      prisma.task.count({ where }),
    ]);

    return successResponse({ tasks, total, limit, offset });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    return serverErrorResponse();
  }
}

// POST /api/tasks - Create task
export async function POST(request: NextRequest) {
  try {
    const { dbUser, error } = await getAuthenticatedUser();
    if (error || !dbUser) {
      return unauthorizedResponse();
    }

    const body = await request.json();

    const validationError = validateRequiredFields(body, ['title', 'category']);
    if (validationError) {
      return errorResponse(validationError);
    }

    // Validate category enum
    if (!Object.values(TaskCategory).includes(body.category)) {
      return errorResponse(`Invalid category: ${body.category}`);
    }

    // Validate priority enum if provided
    if (body.priority && !Object.values(TaskPriority).includes(body.priority)) {
      return errorResponse(`Invalid priority: ${body.priority}`);
    }

    const task = await prisma.task.create({
      data: {
        userId: dbUser.id,
        title: body.title,
        description: body.description || null,
        category: body.category,
        priority: body.priority || TaskPriority.MEDIUM,
        status: TaskStatus.NOT_STARTED,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        reminderDate: body.reminderDate ? new Date(body.reminderDate) : null,
        isRecurring: body.isRecurring || false,
        recurrenceRule: body.recurrenceRule || null,
        steps: body.steps || null,
        notes: body.notes || null,
        templateId: body.templateId || null,
      },
      include: {
        template: true,
      },
    });

    return successResponse(task, 201);
  } catch (err) {
    console.error('Error creating task:', err);
    return serverErrorResponse();
  }
}
