import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { taskService } from '../../services/taskService';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilterRequest, TaskListResponse } from '../../types';

interface TaskState {
  tasks: Task[];
  boardTasks: {
    new: Task[];
    in_progress: Task[];
    done: Task[];
  };
  currentTask: Task | null;
  totalTasks: number;
  statusCounts: Record<string, number>;
  categoryCounts: Record<string, number>;
  loading: boolean;
  error: string | null;
  filters: TaskFilterRequest;
}

const initialState: TaskState = {
  tasks: [],
  boardTasks: {
    new: [],
    in_progress: [],
    done: [],
  },
  currentTask: null,
  totalTasks: 0,
  statusCounts: {},
  categoryCounts: {},
  loading: false,
  error: null,
  filters: {},
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (filters: TaskFilterRequest = {}) => {
    const response = await taskService.getTasks(filters);
    return response;
  }
);

export const fetchBoardTasks = createAsyncThunk(
  'tasks/fetchBoardTasks',
  async () => {
    const [newTasks, inProgressTasks, doneTasks] = await Promise.all([
      taskService.getTasksByStatus('new'),
      taskService.getTasksByStatus('in_progress'),
      taskService.getTasksByStatus('done'),
    ]);
    return { new: newTasks, in_progress: inProgressTasks, done: doneTasks };
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (data: CreateTaskRequest) => {
    const response = await taskService.createTask(data);
    return response;
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, data }: { id: number; data: UpdateTaskRequest }) => {
    const response = await taskService.updateTask(id, data);
    return response;
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: number) => {
    await taskService.deleteTask(id);
    return id;
  }
);

export const archiveTask = createAsyncThunk(
  'tasks/archiveTask',
  async (id: number) => {
    const response = await taskService.archiveTask(id);
    return response;
  }
);

export const restoreTask = createAsyncThunk(
  'tasks/restoreTask',
  async (id: number) => {
    const response = await taskService.restoreTask(id);
    return response;
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<TaskFilterRequest>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<TaskListResponse>) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.totalTasks = action.payload.totalTasks;
        state.statusCounts = action.payload.statusCounts;
        state.categoryCounts = action.payload.categoryCounts;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      // Fetch board tasks
      .addCase(fetchBoardTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoardTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.boardTasks = action.payload;
      })
      .addCase(fetchBoardTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch board tasks';
      })
      // Create task
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.unshift(action.payload);
        if (action.payload.status === 'new') {
          state.boardTasks.new.unshift(action.payload);
        }
      })
      // Update task
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        // Update in board tasks
        ['new', 'in_progress', 'done'].forEach((status) => {
          const statusKey = status as keyof typeof state.boardTasks;
          const idx = state.boardTasks[statusKey].findIndex((t) => t.id === action.payload.id);
          if (idx !== -1) {
            if (action.payload.status === status) {
              state.boardTasks[statusKey][idx] = action.payload;
            } else {
              state.boardTasks[statusKey].splice(idx, 1);
            }
          }
        });
        if (action.payload.status in state.boardTasks) {
          const statusKey = action.payload.status as keyof typeof state.boardTasks;
          const exists = state.boardTasks[statusKey].some((t) => t.id === action.payload.id);
          if (!exists) {
            state.boardTasks[statusKey].push(action.payload);
          }
        }
      })
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
        ['new', 'in_progress', 'done'].forEach((status) => {
          const statusKey = status as keyof typeof state.boardTasks;
          state.boardTasks[statusKey] = state.boardTasks[statusKey].filter(
            (t) => t.id !== action.payload
          );
        });
      })
      // Archive task
      .addCase(archiveTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload.id);
        ['new', 'in_progress', 'done'].forEach((status) => {
          const statusKey = status as keyof typeof state.boardTasks;
          state.boardTasks[statusKey] = state.boardTasks[statusKey].filter(
            (t) => t.id !== action.payload.id
          );
        });
      });
  },
});

export const { setFilters, clearFilters, clearError } = taskSlice.actions;
export default taskSlice.reducer;
