'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import { formatRelativeDate } from '@/lib/utils';

// Using local Task type from API response
interface Task {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  priority: string;
  status: string;
  dueDate?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  FileText,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [tipLoading, setTipLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.getTasks({ pageSize: 5, status: 'pending' });
        setTasks(response.tasks || []);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTip = async () => {
      try {
        const response = await api.getPersonalizedTip();
        setAiTip(response.data?.tip || null);
      } catch (error) {
        console.error('Failed to fetch AI tip:', error);
      } finally {
        setTipLoading(false);
      }
    };

    fetchTasks();
    fetchTip();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.displayName?.split(' ')[0] || 'there';

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
            {greeting()}, {firstName}
          </h1>
          <p className="text-text-secondary mt-1">
            Here&apos;s what&apos;s on your financial to-do list
          </p>
        </div>
        <Link href="/chat">
          <Button>
            <MessageSquare className="w-4 h-4" />
            Ask AI Mentor
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          label="Tasks Completed"
          value="12"
          subtext="This month"
          color="green"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Pending Tasks"
          value={tasks.length.toString()}
          subtext="To complete"
          color="amber"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Streak"
          value="7 days"
          subtext="Keep it up!"
          color="blue"
        />
        <StatCard
          icon={<FileText className="w-5 h-5" />}
          label="Documents"
          value="3"
          subtext="Analyzed"
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">This Week&apos;s Tasks</h2>
            <Link href="/tasks" className="text-brand-green text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} padding="md">
                  <div className="animate-pulse flex items-center gap-4">
                    <div className="w-10 h-10 bg-surface-muted rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-surface-muted rounded w-3/4" />
                      <div className="h-3 bg-surface-muted rounded w-1/2" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <Card padding="lg" className="text-center">
              <div className="w-12 h-12 bg-brand-green-lighter rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6 text-brand-green" />
              </div>
              <h3 className="font-semibold text-text-primary mb-1">All caught up!</h3>
              <p className="text-text-secondary text-sm">
                You have no pending tasks. Great job staying on top of your finances!
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card padding="md">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/documents" className="block">
                <Button variant="secondary" className="w-full justify-start">
                  <FileText className="w-4 h-4" />
                  Upload a Document
                </Button>
              </Link>
              <Link href="/chat" className="block">
                <Button variant="secondary" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4" />
                  Ask a Question
                </Button>
              </Link>
              <Link href="/settings?tab=life-events" className="block">
                <Button variant="secondary" className="w-full justify-start">
                  <Sparkles className="w-4 h-4" />
                  Update Life Events
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* AI Tip Card */}
          <Card padding="md" className="bg-gradient-to-br from-brand-green-lighter to-surface-cream border-brand-green/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary mb-1">AI Tip</h3>
                {tipLoading ? (
                  <div className="space-y-2">
                    <div className="h-3 bg-brand-green/10 rounded animate-pulse w-full" />
                    <div className="h-3 bg-brand-green/10 rounded animate-pulse w-3/4" />
                  </div>
                ) : (
                  <p className="text-sm text-text-secondary">
                    {aiTip || "Stay on top of your finances by checking in regularly. Small consistent actions add up to big results!"}
                  </p>
                )}
                <Link href="/chat" className="text-brand-green text-sm font-medium mt-2 inline-block hover:underline">
                  Ask AI Mentor →
                </Link>
              </div>
            </div>
          </Card>

          {/* Subscription Status */}
          {user?.subscriptionTier === 'free' && (
            <Card padding="md" className="border-amber-200 bg-amber-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">Free Plan Limits</h3>
                  <p className="text-sm text-text-secondary mb-3">
                    You&apos;ve used 3 of 5 active tasks. Upgrade for unlimited tasks and features.
                  </p>
                  <Link href="/settings?tab=subscription">
                    <Button size="sm">Upgrade Now</Button>
                  </Link>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: 'green' | 'amber' | 'blue' | 'purple';
}) {
  const colorClasses = {
    green: 'bg-brand-green-lighter text-brand-green',
    amber: 'bg-amber-100 text-amber-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <Card padding="md">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-text-primary">{value}</p>
          <p className="text-xs text-text-secondary">{label}</p>
        </div>
      </div>
    </Card>
  );
}

function TaskCard({ task }: { task: Task }) {
  const priorityColors: Record<string, 'default' | 'warning' | 'error' | 'success'> = {
    low: 'default',
    medium: 'warning',
    high: 'error',
    urgent: 'error',
  };

  return (
    <Link href={`/tasks/${task.id}`}>
      <Card hover padding="md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-brand-green-lighter rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-brand-green" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-text-primary truncate">{task.title}</h3>
              {task.priority !== 'low' && (
                <Badge variant={priorityColors[task.priority] || 'default'}>{task.priority}</Badge>
              )}
            </div>
            <p className="text-sm text-text-secondary truncate">{task.description}</p>
          </div>
          {task.dueDate && (
            <span className="text-sm text-text-muted flex-shrink-0">
              {formatRelativeDate(task.dueDate)}
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}
