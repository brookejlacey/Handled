'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { TaskStatus, TaskCategory } from '@handled/shared';

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
}

// Local update request type
interface UpdateTaskRequest {
  title?: string;
  description?: string;
  category?: string;
  priority?: string;
  status?: string;
  dueDate?: string;
  notes?: string;
}

interface UseTasksOptions {
  status?: TaskStatus;
  category?: TaskCategory;
  pageSize?: number;
}

export function useTasks(options: UseTasksOptions = {}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.getTasks({
        status: options.status,
        category: options.category,
        pageSize: options.pageSize || 100,
      });
      setTasks(response.tasks || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [options.status, options.category, options.pageSize]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const updateTask = async (id: string, updates: UpdateTaskRequest) => {
    try {
      const response = await api.updateTask(id, updates);
      const updated = response as Task;
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const completeTask = async (id: string, notes?: string) => {
    return updateTask(id, { status: 'completed', notes });
  };

  const snoozeTask = async (id: string) => {
    return updateTask(id, { status: 'snoozed' });
  };

  return {
    tasks,
    isLoading,
    error,
    refetch: fetchTasks,
    updateTask,
    completeTask,
    snoozeTask,
  };
}
