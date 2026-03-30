export interface User {
  id: number;
  email: string;
  username: string;
  fullName?: string;
  phoneNumber?: string;
  countryCode?: string;
  profilePictureUrl?: string;
  emailVerified?: boolean;
  taskCode?: string;
}

export interface Task {
  id: number;
  taskCode?: string;
  taskNumber?: number;
  fullTaskId?: string; // e.g., "JHDOE-1"
  title: string;
  description?: string;
  status: 'new' | 'in_progress' | 'done' | 'archived' | 'removed';
  priority: 'none' | 'low' | 'medium' | 'high';
  category: 'work' | 'home' | 'family' | 'routine' | 'health' | 'finance' | 'personal' | 'other';
  dueDate?: string;
  position: number;
  isArchived: boolean;
  completedAt?: string;
  archivedAt?: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  autoArchiveDays: number;
  autoArchiveEnabled: boolean;
  defaultPriority: string;
  defaultCategory: string;
  defaultDueDate: string;
  theme: 'light' | 'dark' | 'auto';
  themeColor: 'blue' | 'pink' | 'green' | 'yellow' | 'black' | 'red';
  notificationsEnabled: boolean;
  dailySummaryTime: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  fullName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  countryCode?: string;
  profilePictureUrl?: string;
}

export interface OTPRequest {
  email: string;
}

export interface OTPVerifyRequest {
  email: string;
  otp: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: string;
  category?: string;
  dueDate?: string;
  tags?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  category?: string;
  dueDate?: string;
  position?: number;
  isArchived?: boolean;
  tags?: string[];
}

export interface TaskFilterRequest {
  statuses?: string[];
  categories?: string[];
  priorities?: string[];
  dateFrom?: string;
  dateTo?: string;
  dueDateFilter?: string;
  tags?: string[];
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  size?: number;
}

export interface TaskListResponse {
  tasks: Task[];
  totalTasks: number;
  filteredCount: number;
  statusCounts: Record<string, number>;
  categoryCounts: Record<string, number>;
  currentPage: number;
  totalPages: number;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  tags?: string[];
}

// Country list for phone number input
export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export const countries: Country[] = [
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
];
