export interface User {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionTier = 'free' | 'monthly' | 'annual';

export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'trial';

export interface UserPreferences {
  userId: string;
  notificationsEnabled: boolean;
  reminderTime: string; // HH:MM format
  reminderDays: number[]; // 0-6, Sunday = 0
  theme: 'light' | 'dark' | 'system';
}

export interface OnboardingData {
  lifeStage: LifeStage;
  financialGoals: FinancialGoal[];
  painPoints: PainPoint[];
  hasPartner: boolean;
  hasDependents: boolean;
}

export type LifeStage =
  | 'single_building'
  | 'partnered_no_kids'
  | 'new_parent'
  | 'established_family'
  | 'empty_nester'
  | 'approaching_retirement';

export type FinancialGoal =
  | 'get_organized'
  | 'save_more'
  | 'reduce_debt'
  | 'protect_family'
  | 'plan_retirement'
  | 'build_wealth';

export type PainPoint =
  | 'dont_know_where_to_start'
  | 'overwhelmed'
  | 'no_time'
  | 'partner_disagreements'
  | 'shame_embarrassment'
  | 'lack_of_knowledge';
