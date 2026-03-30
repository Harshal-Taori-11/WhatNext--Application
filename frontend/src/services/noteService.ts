import api from './api';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../types';

export const noteService = {
  async createNote(data: CreateNoteRequest): Promise<Note> {
    const response = await api.post<Note>('/notes', data);
    return response.data;
  },

  async getNotes(): Promise<Note[]> {
    const response = await api.get<Note[]>('/notes');
    return response.data;
  },

  async getNote(id: number): Promise<Note> {
    const response = await api.get<Note>(`/notes/${id}`);
    return response.data;
  },

  async updateNote(id: number, data: UpdateNoteRequest): Promise<Note> {
    const response = await api.put<Note>(`/notes/${id}`, data);
    return response.data;
  },

  async deleteNote(id: number): Promise<void> {
    await api.delete(`/notes/${id}`);
  },

  async searchNotes(query: string): Promise<Note[]> {
    const response = await api.get<Note[]>('/notes/search', { params: { q: query } });
    return response.data;
  },
};
