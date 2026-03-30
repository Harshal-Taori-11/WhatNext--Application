import api from './api';
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskFilterRequest,
  TaskListResponse,
} from '../types';

export const taskService = {
  async createTask(data: CreateTaskRequest): Promise<Task> {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },

  async getTasks(filters?: TaskFilterRequest): Promise<TaskListResponse> {
    const response = await api.get<TaskListResponse>('/tasks', { params: filters });
    return response.data;
  },

  async getTask(id: number): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  async updateTask(id: number, data: UpdateTaskRequest): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async getTasksByStatus(status: string): Promise<Task[]> {
    const response = await api.get<Task[]>(`/tasks/status/${status}`);
    return response.data;
  },

  async archiveTask(id: number): Promise<Task> {
    const response = await api.patch<Task>(`/tasks/${id}/archive`);
    return response.data;
  },

  async restoreTask(id: number): Promise<Task> {
    const response = await api.patch<Task>(`/tasks/${id}/restore`);
    return response.data;
  },

  /**
   * Remove task (soft delete - sets status to 'removed')
   */
  async removeTask(id: number): Promise<Task> {
    const response = await api.patch<Task>(`/tasks/${id}/remove`);
    return response.data;
  },
};
