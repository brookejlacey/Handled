import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import {
  getAuthenticatedUser,
  successResponse,
  errorResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from '@/lib/api-utils';
import { TaskCategory, TaskPriority } from '@prisma/client';

// GET /api/onboarding - Get onboarding status
export async function GET() {
  try {
    const { dbUser, error } = await getAuthenticatedUser();
    if (error || !dbUser) {
      return unauthorizedResponse();
    }

    return successResponse({
      completed: !!dbUser.onboardingData?.completedAt,
      data: dbUser.onboardingData,
    });
  } catch (err) {
    console.error('Error fetching onboarding:', err);
    return serverErrorResponse();
  }
}

// POST /api/onboarding - Save onboarding data and generate tasks
export async function POST(request: NextRequest) {
  try {
    const { dbUser, error } = await getAuthenticatedUser();
    if (error || !dbUser) {
      return unauthorizedResponse();
    }

    const body = await request.json();

    // Upsert onboarding data
    const onboardingData = await prisma.onboardingData.upsert({
      where: { userId: dbUser.id },
      update: {
        ageRange: body.ageRange,
        employmentStatus: body.employmentStatus,
        relationshipStatus: body.relationshipStatus,
        hasChildren: body.hasChildren,
        hasRetirementAccounts: body.hasRetirementAccounts,
        hasOld401k: body.hasOld401k,
        hasLifeInsurance: body.hasLifeInsurance,
        hasWill: body.hasWill,
        hasEmergencyFund: body.hasEmergencyFund,
        recentLifeEvents: body.recentLifeEvents || [],
        financialGoals: body.financialGoals || [],
        completedAt: new Date(),
      },
      create: {
        userId: dbUser.id,
        ageRange: body.ageRange,
        employmentStatus: body.employmentStatus,
        relationshipStatus: body.relationshipStatus,
        hasChildren: body.hasChildren,
        hasRetirementAccounts: body.hasRetirementAccounts,
        hasOld401k: body.hasOld401k,
        hasLifeInsurance: body.hasLifeInsurance,
        hasWill: body.hasWill,
        hasEmergencyFund: body.hasEmergencyFund,
        recentLifeEvents: body.recentLifeEvents || [],
        financialGoals: body.financialGoals || [],
        completedAt: new Date(),
      },
    });

    // Generate personalized tasks based on onboarding data
    const tasksToCreate = generatePersonalizedTasks(onboardingData);

    // Create tasks in bulk
    if (tasksToCreate.length > 0) {
      await prisma.task.createMany({
        data: tasksToCreate.map((task) => ({
          userId: dbUser.id,
          ...task,
        })),
      });
    }

    // Get created tasks
    const tasks = await prisma.task.findMany({
      where: { userId: dbUser.id },
      orderBy: { priority: 'desc' },
    });

    return successResponse({
      onboardingData,
      tasksCreated: tasks.length,
      tasks,
    });
  } catch (err) {
    console.error('Error saving onboarding:', err);
    return serverErrorResponse();
  }
}

// Generate tasks based on onboarding responses
interface TaskToCreate {
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
}

function generatePersonalizedTasks(data: {
  hasOld401k: boolean | null;
  hasLifeInsurance: boolean | null;
  hasWill: boolean | null;
  hasEmergencyFund: boolean | null;
  hasRetirementAccounts: boolean | null;
  hasChildren: boolean | null;
  relationshipStatus: string | null;
  recentLifeEvents: string[];
  financialGoals: string[];
}): TaskToCreate[] {
  const tasks: TaskToCreate[] = [];

  // Everyone gets credit score check
  tasks.push({
    title: 'Check your credit score',
    description: 'Review your credit score and report for any errors or areas to improve.',
    category: TaskCategory.CREDIT_SCORE,
    priority: TaskPriority.HIGH,
  });

  // 401k rollover if they have old accounts
  if (data.hasOld401k) {
    tasks.push({
      title: 'Roll over old 401(k) accounts',
      description: 'Consolidate your old retirement accounts to simplify management and potentially reduce fees.',
      category: TaskCategory.RETIREMENT,
      priority: TaskPriority.HIGH,
    });
  }

  // Life insurance review
  if (data.hasLifeInsurance === false && (data.hasChildren || data.relationshipStatus === 'married')) {
    tasks.push({
      title: 'Research life insurance options',
      description: 'Look into term life insurance to protect your family.',
      category: TaskCategory.INSURANCE,
      priority: TaskPriority.HIGH,
    });
  } else if (data.hasLifeInsurance) {
    tasks.push({
      title: 'Review life insurance coverage',
      description: 'Make sure your coverage amount and beneficiaries are up to date.',
      category: TaskCategory.INSURANCE,
      priority: TaskPriority.MEDIUM,
    });
  }

  // Will and estate planning
  if (data.hasWill === false) {
    tasks.push({
      title: 'Create or update your will',
      description: 'Having a will ensures your wishes are carried out. Consider using an online service to get started.',
      category: TaskCategory.ESTATE_PLANNING,
      priority: data.hasChildren ? TaskPriority.HIGH : TaskPriority.MEDIUM,
    });
  }

  // Emergency fund
  if (data.hasEmergencyFund === false) {
    tasks.push({
      title: 'Start building an emergency fund',
      description: 'Set up automatic transfers to save 3-6 months of expenses.',
      category: TaskCategory.EMERGENCY_FUND,
      priority: TaskPriority.HIGH,
    });
  }

  // Retirement account beneficiaries
  if (data.hasRetirementAccounts) {
    tasks.push({
      title: 'Review retirement account beneficiaries',
      description: 'Make sure your beneficiary designations are current, especially after major life changes.',
      category: TaskCategory.BENEFICIARIES,
      priority: TaskPriority.MEDIUM,
    });
  }

  // Life events based tasks
  if (data.recentLifeEvents.includes('new_job')) {
    tasks.push({
      title: 'Review new employer benefits',
      description: 'Understand your health insurance, retirement matching, and other benefits.',
      category: TaskCategory.INSURANCE,
      priority: TaskPriority.HIGH,
    });
  }

  if (data.recentLifeEvents.includes('marriage') || data.recentLifeEvents.includes('divorce')) {
    tasks.push({
      title: 'Update beneficiaries on all accounts',
      description: 'Review and update beneficiaries on retirement accounts, life insurance, and bank accounts.',
      category: TaskCategory.BENEFICIARIES,
      priority: TaskPriority.HIGH,
    });
  }

  if (data.recentLifeEvents.includes('new_baby')) {
    tasks.push({
      title: 'Add child to health insurance',
      description: 'Update your health insurance to include your new family member.',
      category: TaskCategory.INSURANCE,
      priority: TaskPriority.HIGH,
    });
    tasks.push({
      title: 'Start a 529 college savings plan',
      description: 'Consider opening a tax-advantaged education savings account.',
      category: TaskCategory.INVESTMENTS,
      priority: TaskPriority.MEDIUM,
    });
  }

  // Add some universal good-to-have tasks
  tasks.push({
    title: 'Review monthly subscriptions',
    description: 'Audit your recurring charges and cancel services you no longer use.',
    category: TaskCategory.BILLS_SUBSCRIPTIONS,
    priority: TaskPriority.LOW,
  });

  return tasks;
}
