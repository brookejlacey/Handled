import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import prisma from '../../utils/db';
import { success, badRequest, serverError } from '../../utils/response';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().optional(),
});

async function register(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return badRequest('Validation failed', {
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { email, displayName } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return badRequest('An account with this email already exists');
    }

    // Create user
    // Note: In production, use Azure AD B2C for auth
    // This is a simplified version for demonstration
    const user = await prisma.user.create({
      data: {
        email,
        displayName: displayName || null,
        subscriptionTier: 'free',
        subscriptionStatus: 'active',
        onboardingCompleted: false,
      },
    });

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
        onboardingCompleted: user.onboardingCompleted,
      },
      accessToken,
    }, 201);
  } catch (err) {
    context.error('Registration error:', err);
    return serverError('Failed to create account');
  }
}

app.http('register', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'auth/register',
  handler: register,
});
