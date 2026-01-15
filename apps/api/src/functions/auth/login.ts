import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import prisma from '../../utils/db';
import { success, badRequest, unauthorized, serverError } from '../../utils/response';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

async function login(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return badRequest('Validation failed', {
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { email } = validation.data;

    // Find user
    // Note: In production, use Azure AD B2C for auth
    // This is a simplified version for demonstration
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return unauthorized('Invalid email or password');
    }

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      context.error('JWT_SECRET not configured');
      return serverError('Authentication not configured');
    }

    const accessToken = jwt.sign(
      { sub: user.id, email: user.email },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return success({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        subscriptionTier: user.subscriptionTier,
        subscriptionStatus: user.subscriptionStatus,
        onboardingCompleted: user.onboardingCompleted,
      },
      accessToken,
    });
  } catch (err) {
    context.error('Login error:', err);
    return serverError('Failed to authenticate');
  }
}

app.http('login', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'auth/login',
  handler: login,
});
