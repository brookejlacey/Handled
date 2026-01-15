import { HttpRequest, InvocationContext } from '@azure/functions';
import jwt from 'jsonwebtoken';
import { unauthorized } from '../utils/response';
import prisma from '../utils/db';

export interface AuthenticatedUser {
  id: string;
  email: string;
  subscriptionTier: string;
}

export interface AuthenticatedRequest extends HttpRequest {
  user?: AuthenticatedUser;
}

export async function authenticateRequest(
  request: HttpRequest,
  context: InvocationContext
): Promise<{ user: AuthenticatedUser } | { error: ReturnType<typeof unauthorized> }> {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: unauthorized('Missing or invalid authorization header') };
  }

  const token = authHeader.substring(7);

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      context.error('JWT_SECRET not configured');
      return { error: unauthorized('Authentication not configured') };
    }

    const decoded = jwt.verify(token, jwtSecret) as { sub: string; email: string };

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: {
        id: true,
        email: true,
        subscriptionTier: true,
      },
    });

    if (!user) {
      return { error: unauthorized('User not found') };
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        subscriptionTier: user.subscriptionTier,
      },
    };
  } catch (err) {
    context.warn('Token verification failed:', err);
    return { error: unauthorized('Invalid or expired token') };
  }
}

export function requireSubscription(user: AuthenticatedUser): boolean {
  return user.subscriptionTier === 'monthly' || user.subscriptionTier === 'annual';
}
