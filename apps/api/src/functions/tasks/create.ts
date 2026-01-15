import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { z } from 'zod';
import { authenticateRequest, requireSubscription } from '../../middleware/auth';
import prisma from '../../utils/db';
import { success, badRequest, subscriptionRequired, serverError } from '../../utils/response';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  category: z.enum([
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
  ]),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().default('medium'),
  dueDate: z.string().datetime().optional(),
  estimatedMinutes: z.number().int().positive().optional(),
  recurrence: z
    .object({
      frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
      interval: z.number().int().positive().default(1),
      dayOfWeek: z.number().int().min(0).max(6).optional(),
      dayOfMonth: z.number().int().min(1).max(31).optional(),
      monthOfYear: z.number().int().min(1).max(12).optional(),
    })
    .optional(),
});

async function createTask(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const auth = await authenticateRequest(request, context);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    // Check task limit for free users
    if (!requireSubscription(auth.user)) {
      const taskCount = await prisma.task.count({
        where: {
          userId: auth.user.id,
          status: { not: 'completed' },
        },
      });

      if (taskCount >= 5) {
        return subscriptionRequired(
          'Free users are limited to 5 active tasks. Upgrade to create more tasks.'
        );
      }
    }

    const body = await request.json();
    const validation = createTaskSchema.safeParse(body);

    if (!validation.success) {
      return badRequest('Validation failed', {
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { title, description, category, priority, dueDate, estimatedMinutes, recurrence } =
      validation.data;

    const task = await prisma.task.create({
      data: {
        userId: auth.user.id,
        title,
        description,
        category,
        priority,
        status: 'pending',
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedMinutes,
        recurrence: recurrence ? JSON.stringify(recurrence) : null,
      },
    });

    return success(task, 201);
  } catch (err) {
    context.error('Create task error:', err);
    return serverError('Failed to create task');
  }
}

app.http('createTask', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'tasks',
  handler: createTask,
});
