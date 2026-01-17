'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, Button, Badge, Input } from '@/components/ui';
import api from '@/lib/api';
import { formatRelativeDate, cn } from '@/lib/utils';
import type { Task, TaskCategory, TaskStatus, TaskPriority } from '@handled/shared';
import { TASK_CATEGORIES } from '@handled/shared/constants';
import {
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  ChevronRight,
  Plus,
  X,
} from 'lucide-react';

type FilterStatus = TaskStatus | 'all';
type FilterCategory = TaskCategory | 'all';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const params: Record<string, string | number> = { pageSize: 100 };
        if (statusFilter !== 'all') params.status = statusFilter;
        if (categoryFilter !== 'all') params.category = categoryFilter;

        const response = await api.getTasks(params);
        setTasks(response.data?.tasks || []);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [statusFilter, categoryFilter]);

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tasksByStatus = {
    pending: filteredTasks.filter((t) => t.status === 'pending'),
    in_progress: filteredTasks.filter((t) => t.status === 'in_progress'),
    completed: filteredTasks.filter((t) => t.status === 'completed'),
    snoozed: filteredTasks.filter((t) => t.status === 'snoozed'),
  };

  const activeFiltersCount = (statusFilter !== 'all' ? 1 : 0) + (categoryFilter !== 'all' ? 1 : 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Tasks</h1>
          <p className="text-text-secondary">Manage your financial to-do list</p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="secondary"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(activeFiltersCount > 0 && 'border-brand-green text-brand-green')}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-1 w-5 h-5 bg-brand-green text-white rounded-full text-xs flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card padding="md" className="animate-slide-up">
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-sm font-medium text-text-primary mb-2">Status</p>
              <div className="flex flex-wrap gap-2">
                {(['all', 'pending', 'in_progress', 'completed', 'snoozed'] as FilterStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm transition-colors',
                      statusFilter === status
                        ? 'bg-brand-green text-white'
                        : 'bg-surface-muted text-text-secondary hover:bg-surface-cream'
                    )}
                  >
                    {status === 'all' ? 'All' : status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-text-primary mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm transition-colors',
                    categoryFilter === 'all'
                      ? 'bg-brand-green text-white'
                      : 'bg-surface-muted text-text-secondary hover:bg-surface-cream'
                  )}
                >
                  All
                </button>
                {Object.entries(TASK_CATEGORIES).slice(0, 6).map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => setCategoryFilter(key as TaskCategory)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm transition-colors',
                      categoryFilter === key
                        ? 'bg-brand-green text-white'
                        : 'bg-surface-muted text-text-secondary hover:bg-surface-cream'
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}
                className="text-sm text-text-secondary hover:text-status-error flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear filters
              </button>
            )}
          </div>
        </Card>
      )}

      {/* Task Lists */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
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
      ) : filteredTasks.length === 0 ? (
        <Card padding="lg" className="text-center">
          <div className="w-12 h-12 bg-surface-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-text-muted" />
          </div>
          <h3 className="font-semibold text-text-primary mb-1">No tasks found</h3>
          <p className="text-text-secondary text-sm">
            {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'You have no tasks yet. Add one to get started!'}
          </p>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Pending & In Progress */}
          {(tasksByStatus.pending.length > 0 || tasksByStatus.in_progress.length > 0) && (
            <TaskSection
              title="To Do"
              tasks={[...tasksByStatus.in_progress, ...tasksByStatus.pending]}
              icon={<Circle className="w-5 h-5" />}
              iconColor="text-amber-500"
            />
          )}

          {/* Snoozed */}
          {tasksByStatus.snoozed.length > 0 && (
            <TaskSection
              title="Snoozed"
              tasks={tasksByStatus.snoozed}
              icon={<Clock className="w-5 h-5" />}
              iconColor="text-blue-500"
            />
          )}

          {/* Completed */}
          {tasksByStatus.completed.length > 0 && (
            <TaskSection
              title="Completed"
              tasks={tasksByStatus.completed}
              icon={<CheckCircle2 className="w-5 h-5" />}
              iconColor="text-brand-green"
              collapsed
            />
          )}
        </div>
      )}
    </div>
  );
}

function TaskSection({
  title,
  tasks,
  icon,
  iconColor,
  collapsed = false,
}: {
  title: string;
  tasks: Task[];
  icon: React.ReactNode;
  iconColor: string;
  collapsed?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(!collapsed);

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 mb-3 group"
      >
        <span className={iconColor}>{icon}</span>
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        <span className="text-text-muted text-sm">({tasks.length})</span>
        <ChevronRight
          className={cn(
            'w-4 h-4 text-text-muted transition-transform',
            isExpanded && 'rotate-90'
          )}
        />
      </button>

      {isExpanded && (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}

function TaskRow({ task }: { task: Task }) {
  const statusIcons = {
    pending: <Circle className="w-5 h-5 text-text-muted" />,
    in_progress: <AlertCircle className="w-5 h-5 text-amber-500" />,
    completed: <CheckCircle2 className="w-5 h-5 text-brand-green" />,
    snoozed: <Clock className="w-5 h-5 text-blue-500" />,
    skipped: <X className="w-5 h-5 text-text-muted" />,
  };

  const priorityVariants: Record<TaskPriority, 'default' | 'success' | 'warning' | 'error'> = {
    low: 'default',
    medium: 'default',
    high: 'warning',
    urgent: 'error',
  };

  const categoryInfo = TASK_CATEGORIES[task.category];

  return (
    <Link href={`/tasks/${task.id}`}>
      <Card hover padding="md">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {statusIcons[task.status]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={cn(
                'font-medium truncate',
                task.status === 'completed' ? 'text-text-muted line-through' : 'text-text-primary'
              )}>
                {task.title}
              </h3>
              {task.priority !== 'low' && task.status !== 'completed' && (
                <Badge variant={priorityVariants[task.priority]} className="capitalize">
                  {task.priority}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              {categoryInfo && (
                <span className="text-xs text-text-muted">{categoryInfo.label}</span>
              )}
              {task.dueDate && task.status !== 'completed' && (
                <span className={cn(
                  'text-xs',
                  new Date(task.dueDate) < new Date() ? 'text-status-error' : 'text-text-muted'
                )}>
                  Due {formatRelativeDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-text-muted flex-shrink-0" />
        </div>
      </Card>
    </Link>
  );
}
