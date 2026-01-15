export const APP_CONFIG = {
  name: 'Handled',
  tagline: 'Your financial adulting copilot',
  description:
    'A judgment-free system to help you complete the recurring financial maintenance tasks you know you should do but never have a system for.',
  supportEmail: 'support@gethandled.app',
  websiteUrl: 'https://gethandled.app',
  privacyPolicyUrl: 'https://gethandled.app/privacy',
  termsOfServiceUrl: 'https://gethandled.app/terms',
} as const;

export const API_CONFIG = {
  baseUrl: process.env.API_BASE_URL || 'https://api.gethandled.app',
  timeout: 30000,
  retryAttempts: 3,
} as const;

export const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Handled',
    subtitle: "Let's get your financial life organized—no judgment, just progress.",
  },
  {
    id: 'life_stage',
    title: "Where are you in life?",
    subtitle: "This helps us suggest the most relevant tasks for your situation.",
  },
  {
    id: 'goals',
    title: 'What matters most to you?',
    subtitle: 'Select the areas you want to focus on.',
  },
  {
    id: 'pain_points',
    title: "What's been holding you back?",
    subtitle: "Understanding your challenges helps us support you better.",
  },
  {
    id: 'ready',
    title: "You're all set!",
    subtitle: "Let's start tackling your financial to-dos, one task at a time.",
  },
] as const;

export const LIFE_STAGE_OPTIONS = [
  {
    id: 'single_building',
    label: 'Single & Building',
    description: 'Focused on career and building your financial foundation',
  },
  {
    id: 'partnered_no_kids',
    label: 'Partnered, No Kids',
    description: 'Combining finances and planning together',
  },
  {
    id: 'new_parent',
    label: 'New Parent',
    description: 'Adjusting finances for your growing family',
  },
  {
    id: 'established_family',
    label: 'Established Family',
    description: 'Balancing current needs with future planning',
  },
  {
    id: 'empty_nester',
    label: 'Empty Nester',
    description: 'Kids are independent, refocusing on your goals',
  },
  {
    id: 'approaching_retirement',
    label: 'Approaching Retirement',
    description: 'Preparing for the next chapter',
  },
] as const;
