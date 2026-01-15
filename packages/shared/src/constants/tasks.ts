import type { TaskCategory, TaskPriority, RecurrenceFrequency } from '../types';

export const TASK_CATEGORIES: Record<TaskCategory, { label: string; icon: string; color: string }> =
  {
    credit_score: {
      label: 'Credit Score',
      icon: 'credit-card',
      color: '#6366F1',
    },
    retirement: {
      label: 'Retirement',
      icon: 'trending-up',
      color: '#8B5CF6',
    },
    insurance: {
      label: 'Insurance',
      icon: 'shield',
      color: '#EC4899',
    },
    taxes: {
      label: 'Taxes',
      icon: 'file-text',
      color: '#F59E0B',
    },
    estate_planning: {
      label: 'Estate Planning',
      icon: 'home',
      color: '#10B981',
    },
    bills_subscriptions: {
      label: 'Bills & Subscriptions',
      icon: 'repeat',
      color: '#3B82F6',
    },
    banking: {
      label: 'Banking',
      icon: 'building',
      color: '#14B8A6',
    },
    investments: {
      label: 'Investments',
      icon: 'bar-chart-2',
      color: '#F97316',
    },
    debt: {
      label: 'Debt',
      icon: 'alert-circle',
      color: '#EF4444',
    },
    emergency_fund: {
      label: 'Emergency Fund',
      icon: 'umbrella',
      color: '#06B6D4',
    },
    beneficiaries: {
      label: 'Beneficiaries',
      icon: 'users',
      color: '#A855F7',
    },
    documents: {
      label: 'Documents',
      icon: 'folder',
      color: '#64748B',
    },
  };

export const TASK_PRIORITIES: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: 'Low', color: '#94A3B8' },
  medium: { label: 'Medium', color: '#3B82F6' },
  high: { label: 'High', color: '#F59E0B' },
  urgent: { label: 'Urgent', color: '#EF4444' },
};

export const RECURRENCE_FREQUENCIES: Record<RecurrenceFrequency, { label: string }> = {
  daily: { label: 'Daily' },
  weekly: { label: 'Weekly' },
  monthly: { label: 'Monthly' },
  quarterly: { label: 'Quarterly' },
  yearly: { label: 'Yearly' },
};

export const DEFAULT_TASK_TEMPLATES = [
  {
    id: 'check-credit-score',
    title: 'Check your credit score',
    description:
      'Review your credit score and report for any changes or errors. This helps you catch identity theft early and track your financial health.',
    category: 'credit_score' as TaskCategory,
    defaultPriority: 'medium' as TaskPriority,
    defaultRecurrence: { frequency: 'quarterly' as RecurrenceFrequency, interval: 1 },
    estimatedMinutes: 15,
    whyItMatters:
      "Your credit score affects everything from loan rates to apartment applications. Checking quarterly helps you catch problems early when they're easier to fix.",
  },
  {
    id: 'review-subscriptions',
    title: 'Review active subscriptions',
    description:
      'Go through your bank and credit card statements to identify all recurring charges. Cancel anything you no longer use.',
    category: 'bills_subscriptions' as TaskCategory,
    defaultPriority: 'medium' as TaskPriority,
    defaultRecurrence: { frequency: 'quarterly' as RecurrenceFrequency, interval: 1 },
    estimatedMinutes: 30,
    whyItMatters:
      'The average person wastes $200+/month on forgotten subscriptions. A quick quarterly review can save you thousands per year.',
  },
  {
    id: 'update-beneficiaries',
    title: 'Review and update beneficiaries',
    description:
      'Check beneficiary designations on all retirement accounts, life insurance policies, and bank accounts. Update after any major life change.',
    category: 'beneficiaries' as TaskCategory,
    defaultPriority: 'high' as TaskPriority,
    defaultRecurrence: { frequency: 'yearly' as RecurrenceFrequency, interval: 1 },
    estimatedMinutes: 45,
    whyItMatters:
      'Beneficiary designations override your will. Outdated beneficiaries mean your assets might go to an ex-spouse instead of your current family.',
  },
  {
    id: 'check-insurance-coverage',
    title: 'Review insurance coverage',
    description:
      'Review your health, auto, home/renters, and life insurance policies. Ensure coverage still matches your needs and compare rates.',
    category: 'insurance' as TaskCategory,
    defaultPriority: 'medium' as TaskPriority,
    defaultRecurrence: { frequency: 'yearly' as RecurrenceFrequency, interval: 1 },
    estimatedMinutes: 60,
    whyItMatters:
      "Life changes fast. The coverage that made sense 2 years ago might leave you underinsured now—or you might be overpaying for coverage you don't need.",
  },
  {
    id: 'emergency-fund-check',
    title: 'Check emergency fund status',
    description:
      "Calculate your current monthly expenses and verify you have 3-6 months saved. If not, create a plan to get there.",
    category: 'emergency_fund' as TaskCategory,
    defaultPriority: 'high' as TaskPriority,
    defaultRecurrence: { frequency: 'quarterly' as RecurrenceFrequency, interval: 1 },
    estimatedMinutes: 20,
    whyItMatters:
      'An emergency fund is the foundation of financial security. It keeps a job loss or medical emergency from becoming a financial catastrophe.',
  },
];
