import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { z } from 'zod';
import { authenticateRequest } from '../../middleware/auth';
import prisma from '../../utils/db';
import { success, badRequest, notFound, forbidden, serverError } from '../../utils/response';

const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
  category: z
    .enum([
      'credit_score',
      'retirement',
      'insurance',
      'taxes',
      'estate_planning',
      'bills_subscriptions',
      'banking',
      'investments',
      'debt',
      'emergency_fund',
      'beneficiaries',
      'documents',
    ])
    .optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'skipped', 'snoozed']).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

async function updateTask(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const auth = await authenticateRequest(request, context);
  if ('error' in auth) {
    return auth.error;
  }

  const taskId = request.params.id;
  if (!taskId) {
    return badRequest('Task ID is required');
  }

  try {
    // Verify task belongs to user
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return notFound('Task not found');
    }

    if (existingTask.userId !== auth.user.id) {
      return forbidden('You do not have permission to update this task');
    }

    const body = await request.json();
    const validation = updateTaskSchema.safeParse(body);

    if (!validation.success) {
      return badRequest('Validation failed', {
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const updateData: Record<string, unknown> = { ...validation.data };

    // Handle status changes
    if (validation.data.status === 'completed' && existingTask.status !== 'completed') {
      updateData.completedAt = new Date();
    }

    // Handle dueDate conversion
    if (validation.data.dueDate !== undefined) {
      updateData.dueDate = validation.data.dueDate ? new Date(validation.data.dueDate) : null;
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    return success(task);
  } catch (err) {
    context.error('Update task error:', err);
    return serverError('Failed to update task');
  }
}

app.http('updateTask', {
  methods: ['PATCH'],
  authLevel: 'anonymous',
  route: 'tasks/{id}',
  handler: updateTask,
});
