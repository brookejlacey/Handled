import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get user data from database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      preferences: true,
      onboardingData: true,
    },
  });

  if (!dbUser) {
    // User exists in Supabase but not in our database - create them
    const newUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
        displayName: user.user_metadata?.display_name || user.user_metadata?.full_name || null,
      },
      include: {
        preferences: true,
        onboardingData: true,
      },
    });

    return NextResponse.json({
      id: newUser.id,
      email: newUser.email,
      displayName: newUser.displayName,
      subscriptionTier: newUser.subscriptionTier,
      subscriptionStatus: newUser.subscriptionStatus,
      hasCompletedOnboarding: !!newUser.onboardingData?.completedAt,
      preferences: newUser.preferences,
    });
  }

  return NextResponse.json({
    id: dbUser.id,
    email: dbUser.email,
    displayName: dbUser.displayName,
    subscriptionTier: dbUser.subscriptionTier,
    subscriptionStatus: dbUser.subscriptionStatus,
    hasCompletedOnboarding: !!dbUser.onboardingData?.completedAt,
    preferences: dbUser.preferences,
  });
}
