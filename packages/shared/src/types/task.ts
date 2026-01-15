export interface Task {
  id: string;
  userId: string;
  templateId: string | null;
  title: string;
  description: string | null;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: Date | null;
  completedAt: Date | null;
  recurrence: TaskRecurrence | null;
  estimatedMinutes: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskCategory =
  | 'credit_score'
  | 'retirement'
  | 'insurance'
  | 'taxes'
  | 'estate_planning'
  | 'bills_subscriptions'
  | 'banking'
  | 'investments'
  | 'debt'
  | 'emergency_fund'
  | 'beneficiaries'
  | 'documents';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'skipped' | 'snoozed';

export interface TaskRecurrence {
  frequency: RecurrenceFrequency;
  interval: number; // e.g., every 2 weeks
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  monthOfYear?: number; // 1-12 for yearly
}

export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface TaskTemplate {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  defaultPriority: TaskPriority;
  defaultRecurrence: TaskRecurrence | null;
  estimatedMinutes: number;
  helpContent: string | null;
  whyItMatters: string | null;
  lifeStageTags: string[];
  isActive: boolean;
}

export interface TaskCompletionLog {
  id: string;
  taskId: string;
  userId: string;
  completedAt: Date;
  timeSpentMinutes: number | null;
  notes: string | null;
  outcome: TaskOutcome;
}

export type TaskOutcome =
  | 'completed_successfully'
  | 'completed_with_issues'
  | 'needs_followup'
  | 'deferred';
