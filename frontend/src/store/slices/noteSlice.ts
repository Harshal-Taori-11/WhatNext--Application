import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { noteService } from '../../services/noteService';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../../types';

interface NoteState {
  notes: Note[];
  currentNote: Note | null;
  loading: boolean;
  error: string | null;
}

const initialState: NoteState = {
  notes: [],
  currentNote: null,
  loading: false,
  error: null,
};

export const fetchNotes = createAsyncThunk('notes/fetchNotes', async () => {
  const response = await noteService.getNotes();
  return response;
});

export const createNote = createAsyncThunk(
  'notes/createNote',
  async (data: CreateNoteRequest) => {
    const response = await noteService.createNote(data);
    return response;
  }
);

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async ({ id, data }: { id: number; data: UpdateNoteRequest }) => {
    const response = await noteService.updateNote(id, data);
    return response;
  }
);

export const deleteNote = createAsyncThunk('notes/deleteNote', async (id: number) => {
  await noteService.deleteNote(id);
  return id;
});

export const searchNotes = createAsyncThunk(
  'notes/searchNotes',
  async (query: string) => {
    const response = await noteService.searchNotes(query);
    return response;
  }
);

const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setCurrentNote: (state, action: PayloadAction<Note | null>) => {
      state.currentNote = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notes
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action: PayloadAction<Note[]>) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notes';
      })
      // Create note
      .addCase(createNote.fulfilled, (state, action: PayloadAction<Note>) => {
        state.notes.unshift(action.payload);
      })
      // Update note
      .addCase(updateNote.fulfilled, (state, action: PayloadAction<Note>) => {
        const index = state.notes.findIndex((n) => n.id === action.payload.id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })
      // Delete note
      .addCase(deleteNote.fulfilled, (state, action: PayloadAction<number>) => {
        state.notes = state.notes.filter((n) => n.id !== action.payload);
      })
      // Search notes
      .addCase(searchNotes.fulfilled, (state, action: PayloadAction<Note[]>) => {
        state.notes = action.payload;
      });
  },
});

export const { setCurrentNote, clearError } = noteSlice.actions;
export default noteSlice.reducer;
