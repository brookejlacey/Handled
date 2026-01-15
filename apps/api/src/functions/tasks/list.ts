import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { authenticateRequest } from '../../middleware/auth';
import prisma from '../../utils/db';
import { success, serverError } from '../../utils/response';

async function listTasks(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const auth = await authenticateRequest(request, context);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20', 10);

    const where: Record<string, unknown> = {
      userId: auth.user.id,
    };

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: [
          { dueDate: 'asc' },
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.task.count({ where }),
    ]);

    return success({
      tasks,
      pagination: {
        page,
        pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
        hasPrevious: page > 1,
      },
    });
  } catch (err) {
    context.error('List tasks error:', err);
    return serverError('Failed to fetch tasks');
  }
}

app.http('listTasks', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'tasks',
  handler: listTasks,
});
