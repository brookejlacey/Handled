import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { authenticateRequest } from '../../middleware/auth';
import prisma from '../../utils/db';
import { success, serverError } from '../../utils/response';

async function getMe(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const auth = await authenticateRequest(request, context);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.user.id },
      include: {
        preferences: true,
      },
    });

    if (!user) {
      return serverError('User not found');
    }

    return success({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      subscriptionTier: user.subscriptionTier,
      subscriptionStatus: user.subscriptionStatus,
      onboardingCompleted: user.onboardingCompleted,
      preferences: user.preferences,
      createdAt: user.createdAt,
    });
  } catch (err) {
    context.error('Get user error:', err);
    return serverError('Failed to fetch user');
  }
}

app.http('getMe', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'auth/me',
  handler: getMe,
});
