'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, Button, Input, Badge } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import {
  User,
  Bell,
  CreditCard,
  Heart,
  Shield,
  Check,
  Crown,
  ChevronRight,
  Mail,
  Smartphone,
  Calendar,
  Baby,
  Home,
  Briefcase,
} from 'lucide-react';

type Tab = 'profile' | 'notifications' | 'subscription' | 'life-events';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
  { id: 'life-events', label: 'Life Events', icon: Heart },
];

const LIFE_EVENTS = [
  { id: 'getting_married', label: 'Getting Married', icon: Heart, description: 'Planning a wedding or recently married' },
  { id: 'having_baby', label: 'Having a Baby', icon: Baby, description: 'Expecting or recently had a child' },
  { id: 'buying_home', label: 'Buying a Home', icon: Home, description: 'House hunting or recently purchased' },
  { id: 'job_change', label: 'Job Change', icon: Briefcase, description: 'Starting a new job or career transition' },
  { id: 'retirement', label: 'Approaching Retirement', icon: Calendar, description: 'Planning to retire in the next 5 years' },
];

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [selectedLifeEvents, setSelectedLifeEvents] = useState<string[]>([]);

  useEffect(() => {
    const tab = searchParams.get('tab') as Tab;
    if (tab && TABS.find((t) => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const toggleLifeEvent = (eventId: string) => {
    setSelectedLifeEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs Navigation */}
        <Card padding="sm" className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all',
                  activeTab === tab.id
                    ? 'bg-brand-green-lighter text-brand-green font-medium'
                    : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
                )}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            ))}
          </nav>
        </Card>

        {/* Tab Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-text-primary mb-6">Profile Information</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-brand-green-lighter rounded-full flex items-center justify-center">
                    <span className="text-brand-green font-bold text-2xl">
                      {name.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <Button variant="secondary" size="sm">Change Photo</Button>
                    <p className="text-xs text-text-muted mt-1">JPG, PNG up to 2MB</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <Input
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="font-medium text-text-primary mb-3">Security</h3>
                  <Button variant="secondary">
                    <Shield className="w-4 h-4" />
                    Change Password
                  </Button>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} isLoading={isSaving}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-text-primary mb-6">Notification Preferences</h2>
              <div className="space-y-6">
                <NotificationToggle
                  icon={Mail}
                  title="Email Notifications"
                  description="Receive task reminders and updates via email"
                  checked={emailNotifications}
                  onChange={setEmailNotifications}
                />
                <NotificationToggle
                  icon={Smartphone}
                  title="Push Notifications"
                  description="Get real-time alerts on your device"
                  checked={pushNotifications}
                  onChange={setPushNotifications}
                />
                <NotificationToggle
                  icon={Calendar}
                  title="Weekly Digest"
                  description="Summary of your financial progress every Sunday"
                  checked={weeklyDigest}
                  onChange={setWeeklyDigest}
                />

                <div className="flex justify-end pt-4 border-t border-border">
                  <Button onClick={handleSave} isLoading={isSaving}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              {/* Current Plan */}
              <Card padding="lg">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-semibold text-text-primary">Current Plan</h2>
                      <Badge variant={user?.subscriptionTier === 'free' ? 'default' : 'success'}>
                        {user?.subscriptionTier === 'free' ? 'Free' : 'Premium'}
                      </Badge>
                    </div>
                    <p className="text-text-secondary">
                      {user?.subscriptionTier === 'free'
                        ? 'You are on the free plan with limited features.'
                        : 'You have access to all premium features.'}
                    </p>
                  </div>
                  {user?.subscriptionTier !== 'free' && (
                    <Button variant="ghost" size="sm" className="text-status-error">
                      Cancel Plan
                    </Button>
                  )}
                </div>
              </Card>

              {/* Plans */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Free Plan */}
                <Card
                  padding="lg"
                  className={cn(user?.subscriptionTier === 'free' && 'ring-2 ring-brand-green')}
                >
                  {user?.subscriptionTier === 'free' && (
                    <Badge variant="success" className="mb-4">Current Plan</Badge>
                  )}
                  <h3 className="text-xl font-semibold text-text-primary">Free</h3>
                  <p className="text-3xl font-bold text-text-primary mt-2">
                    $0<span className="text-base font-normal text-text-secondary">/month</span>
                  </p>
                  <ul className="mt-6 space-y-3">
                    <PlanFeature>5 active tasks</PlanFeature>
                    <PlanFeature>10 AI messages/month</PlanFeature>
                    <PlanFeature>3 document uploads/month</PlanFeature>
                  </ul>
                </Card>

                {/* Premium Plan */}
                <Card
                  padding="lg"
                  className={cn(
                    'border-brand-green',
                    user?.subscriptionTier !== 'free' && 'ring-2 ring-brand-green'
                  )}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Crown className="w-5 h-5 text-brand-green" />
                    {user?.subscriptionTier !== 'free' ? (
                      <Badge variant="success">Current Plan</Badge>
                    ) : (
                      <Badge variant="success">Recommended</Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary">Premium</h3>
                  <p className="text-3xl font-bold text-text-primary mt-2">
                    $9.99<span className="text-base font-normal text-text-secondary">/month</span>
                  </p>
                  <ul className="mt-6 space-y-3">
                    <PlanFeature>Unlimited tasks</PlanFeature>
                    <PlanFeature>Unlimited AI chat</PlanFeature>
                    <PlanFeature>Unlimited document uploads</PlanFeature>
                    <PlanFeature>Advanced document analysis</PlanFeature>
                    <PlanFeature>Priority support</PlanFeature>
                  </ul>
                  {user?.subscriptionTier === 'free' && (
                    <Button className="w-full mt-6">
                      <Crown className="w-4 h-4" />
                      Upgrade to Premium
                    </Button>
                  )}
                </Card>
              </div>
            </div>
          )}

          {/* Life Events Tab */}
          {activeTab === 'life-events' && (
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-text-primary mb-2">Life Events</h2>
              <p className="text-text-secondary mb-6">
                Tell us about major life changes so we can personalize your tasks and recommendations.
              </p>
              <div className="space-y-3">
                {LIFE_EVENTS.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => toggleLifeEvent(event.id)}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all',
                      selectedLifeEvents.includes(event.id)
                        ? 'border-brand-green bg-brand-green-lighter/30'
                        : 'border-border hover:border-brand-green hover:bg-surface-muted'
                    )}
                  >
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center',
                        selectedLifeEvents.includes(event.id)
                          ? 'bg-brand-green text-white'
                          : 'bg-surface-muted text-text-secondary'
                      )}
                    >
                      <event.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-text-primary">{event.label}</h3>
                      <p className="text-sm text-text-secondary">{event.description}</p>
                    </div>
                    {selectedLifeEvents.includes(event.id) && (
                      <div className="w-6 h-6 bg-brand-green rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6 pt-6 border-t border-border">
                <Button onClick={handleSave} isLoading={isSaving}>
                  Update Life Events
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationToggle({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-surface-muted rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-text-secondary" />
        </div>
        <div>
          <h3 className="font-medium text-text-primary">{title}</h3>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          checked ? 'bg-brand-green' : 'bg-border-dark'
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    </div>
  );
}

function PlanFeature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-text-secondary">
      <Check className="w-4 h-4 text-brand-green flex-shrink-0" />
      {children}
    </li>
  );
}
