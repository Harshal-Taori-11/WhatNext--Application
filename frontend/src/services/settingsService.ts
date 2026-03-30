import api from './api';
import { UserSettings } from '../types';

export const settingsService = {
  async getSettings(): Promise<UserSettings> {
    const response = await api.get<UserSettings>('/settings');
    return response.data;
  },

  async updateSettings(data: Partial<UserSettings>): Promise<UserSettings> {
    const response = await api.put<UserSettings>('/settings', data);
    return response.data;
  },
};
