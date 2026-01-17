'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, Button, Badge, Input } from '@/components/ui';
import api from '@/lib/api';
import { formatDate, cn } from '@/lib/utils';
import type { TaskStatus } from '@handled/shared';
import { TASK_CATEGORIES } from '@handled/shared/constants';

// Local Task type matching API response
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
  instructions?: string | null;
  whyItMatters?: string | null;
  recurrence?: string | null;
  notes?: string | null;
}
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Calendar,
  Tag,
  AlertTriangle,
  MessageSquare,
  Lightbulb,
  MoreHorizontal,
  X,
} from 'lucide-react';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completionNotes, setCompletionNotes] = useState('');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.getTask(params.id as string);
        setTask(response as Task);
      } catch (error) {
        console.error('Failed to fetch task:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchTask();
    }
  }, [params.id]);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!task) return;

    setIsUpdating(true);
    try {
      const response = await api.updateTask(task.id, {
        status: newStatus,
        ...(newStatus === 'completed' && completionNotes ? { notes: completionNotes } : {}),
      });
      setTask(response as Task);
      setShowCompleteModal(false);
      setCompletionNotes('');
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-muted rounded w-1/4" />
          <div className="h-12 bg-surface-muted rounded w-3/4" />
          <div className="h-64 bg-surface-muted rounded" />
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Task not found</h1>
        <p className="text-text-secondary mb-4">This task may have been deleted or doesn&apos;t exist.</p>
        <Link href="/tasks">
          <Button variant="secondary">Back to Tasks</Button>
        </Link>
      </div>
    );
  }

  const categoryInfo = TASK_CATEGORIES[task.category as keyof typeof TASK_CATEGORIES];
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Back Button */}
      <Link href="/tasks" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Tasks
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {categoryInfo && (
              <Badge variant="success">{categoryInfo.label}</Badge>
            )}
            {task.priority !== 'low' && (
              <Badge variant={task.priority === 'urgent' ? 'error' : 'warning'} className="capitalize">
                {task.priority} Priority
              </Badge>
            )}
            {isOverdue && (
              <Badge variant="error">Overdue</Badge>
            )}
          </div>
          <h1 className={cn(
            'text-2xl md:text-3xl font-bold',
            task.status === 'completed' ? 'text-text-muted line-through' : 'text-text-primary'
          )}>
            {task.title}
          </h1>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* Status & Actions */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <StatusIcon status={task.status} />
            <div>
              <p className="font-medium text-text-primary capitalize">{task.status.replace('_', ' ')}</p>
              {task.dueDate && (
                <p className={cn('text-sm', isOverdue ? 'text-status-error' : 'text-text-secondary')}>
                  Due {formatDate(task.dueDate)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {task.status !== 'completed' && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleStatusChange('snoozed')}
                  disabled={isUpdating}
                >
                  <Clock className="w-4 h-4" />
                  Snooze
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowCompleteModal(true)}
                  disabled={isUpdating}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark Complete
                </Button>
              </>
            )}
            {task.status === 'completed' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleStatusChange('pending')}
                disabled={isUpdating}
              >
                Reopen Task
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Description */}
      {task.description && (
        <Card padding="lg">
          <h2 className="font-semibold text-text-primary mb-3">Description</h2>
          <p className="text-text-secondary whitespace-pre-wrap">{task.description}</p>
        </Card>
      )}

      {/* Instructions */}
      {task.instructions && (
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h2 className="font-semibold text-text-primary">How to Complete</h2>
          </div>
          <div className="prose prose-sm max-w-none text-text-secondary">
            <p className="whitespace-pre-wrap">{task.instructions}</p>
          </div>
        </Card>
      )}

      {/* Why It Matters */}
      {task.whyItMatters && (
        <Card padding="lg" className="bg-brand-green-lighter/50 border-brand-green/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-text-primary mb-2">Why This Matters</h2>
              <p className="text-text-secondary">{task.whyItMatters}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Task Details */}
      <Card padding="lg">
        <h2 className="font-semibold text-text-primary mb-4">Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <DetailItem
            icon={<Tag className="w-4 h-4" />}
            label="Category"
            value={categoryInfo?.label || task.category}
          />
          <DetailItem
            icon={<Calendar className="w-4 h-4" />}
            label="Created"
            value={formatDate(task.createdAt)}
          />
          {task.recurrence && (
            <DetailItem
              icon={<Clock className="w-4 h-4" />}
              label="Recurrence"
              value={task.recurrence}
            />
          )}
        </div>
      </Card>

      {/* Ask AI About This */}
      <Card padding="lg" className="bg-gradient-to-br from-brand-green-lighter to-surface-cream border-brand-green/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Need help with this task?</h3>
              <p className="text-sm text-text-secondary">Ask our AI mentor for guidance</p>
            </div>
          </div>
          <Link href={`/chat?task=${task.id}`}>
            <Button size="sm">Ask AI</Button>
          </Link>
        </div>
      </Card>

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card padding="lg" className="max-w-md w-full animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">Complete Task</h2>
              <button
                onClick={() => setShowCompleteModal(false)}
                className="text-text-muted hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-text-secondary mb-4">
              Add any notes about how you completed this task (optional).
            </p>
            <textarea
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              placeholder="E.g., Called insurance company, updated policy..."
              className="w-full px-4 py-3 bg-surface-white border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="secondary"
                onClick={() => setShowCompleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleStatusChange('completed')}
                isLoading={isUpdating}
              >
                <CheckCircle2 className="w-4 h-4" />
                Complete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  const icons: Record<string, React.ReactNode> = {
    pending: <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center"><Clock className="w-5 h-5 text-amber-600" /></div>,
    in_progress: <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><Clock className="w-5 h-5 text-blue-600" /></div>,
    completed: <div className="w-10 h-10 bg-brand-green-lighter rounded-full flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-brand-green" /></div>,
    snoozed: <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center"><Clock className="w-5 h-5 text-purple-600" /></div>,
    skipped: <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"><X className="w-5 h-5 text-gray-600" /></div>,
  };

  return icons[status] || icons.pending;
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-text-muted">{icon}</span>
      <div>
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-sm text-text-primary">{value}</p>
      </div>
    </div>
  );
}
