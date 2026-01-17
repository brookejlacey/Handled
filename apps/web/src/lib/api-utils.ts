import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

// Standard API response helpers
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json({ success: false, error: message }, { status: 401 });
}

export function notFoundResponse(message = 'Not found') {
  return NextResponse.json({ success: false, error: message }, { status: 404 });
}

export function serverErrorResponse(message = 'Internal server error') {
  return NextResponse.json({ success: false, error: message }, { status: 500 });
}

// Get authenticated user from request
export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, dbUser: null, error: 'Not authenticated' };
  }

  // Get or create user in database
  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      preferences: true,
      onboardingData: true,
    },
  });

  // Create user if doesn't exist
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
        displayName: user.user_metadata?.display_name || null,
        avatarUrl: user.user_metadata?.avatar_url || null,
        preferences: {
          create: {},
        },
      },
      include: {
        preferences: true,
        onboardingData: true,
      },
    });
  }

  return { user, dbUser, error: null };
}

// Validate required fields
export function validateRequiredFields<T extends Record<string, unknown>>(
  body: T,
  requiredFields: (keyof T)[]
): string | null {
  for (const field of requiredFields) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      return `Missing required field: ${String(field)}`;
    }
  }
  return null;
}
