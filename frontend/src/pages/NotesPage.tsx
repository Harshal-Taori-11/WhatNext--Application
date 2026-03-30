import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Close,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../store/store';
import { fetchNotes, createNote, updateNote, deleteNote } from '../store/slices/noteSlice';
import Header from '../components/layout/Header';
import { NoteCard } from '../components/notes/NoteCard';
import { Note } from '../types';

const NotesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notes, loading } = useSelector((state: RootState) => state.notes);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const handleOpenCreate = () => {
    setEditingNote(null);
    setTitle('');
    setContent('');
    setOpenDialog(true);
  };

  const handleOpenEdit = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (title.trim() && content.trim()) {
      if (editingNote) {
        await dispatch(updateNote({ id: editingNote.id, data: { title, content } }));
      } else {
        await dispatch(createNote({ title, content }));
      }
      setOpenDialog(false);
      setTitle('');
      setContent('');
      dispatch(fetchNotes());
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await dispatch(deleteNote(id));
      dispatch(fetchNotes());
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setTitle('');
    setContent('');
    setEditingNote(null);
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Notes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Capture your ideas and thoughts
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            size="large"
            sx={{ px: 3 }}
          >
            New Note
          </Button>
        </Box>

        {/* Loading State */}
        {loading && notes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : notes.length === 0 ? (
          /* Empty State */
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 3,
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: '2px dashed',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No notes yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first note to capture ideas, thoughts, and reminders
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate} size="large">
              Create Your First Note
            </Button>
          </Box>
        ) : (
          /* Notes Grid */
          <Grid container spacing={3}>
            {notes.map((note) => (
              <Grid item xs={12} sm={6} md={4} key={note.id}>
                <NoteCard
                  note={note}
                  onEdit={() => handleOpenEdit(note)}
                  onDelete={() => handleDelete(note.id)}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Total Count */}
        {notes.length > 0 && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </Typography>
          </Box>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingNote ? 'Edit Note' : 'Create Note'}
            <IconButton
              onClick={handleClose}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              required
              autoFocus
              placeholder="Enter a title for your note"
            />
            <TextField
              fullWidth
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              margin="normal"
              multiline
              rows={12}
              required
              inputProps={{ maxLength: 5000 }}
              helperText={`${content.length}/5000 characters`}
              placeholder="Write your note here..."
            />
            <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
              💡 Tip: You can use line breaks to organize your content
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={!title.trim() || !content.trim()}
            >
              {editingNote ? 'Update Note' : 'Create Note'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default NotesPage;
