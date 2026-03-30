import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Close,
  CalendarToday,
  Flag,
  Label,
  Category,
  AccessTime,
} from '@mui/icons-material';
import { Task } from '../../types';
import { format } from 'date-fns';

interface TaskDetailModalProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
}

const priorityColors: Record<string, string> = {
  high: '#F44336',
  medium: '#FF9800',
  low: '#4CAF50',
  none: '#9E9E9E',
};

const categoryColors: Record<string, string> = {
  work: '#2196F3',
  home: '#9C27B0',
  family: '#E91E63',
  routine: '#00BCD4',
  health: '#4CAF50',
  finance: '#FF9800',
  personal: '#673AB7',
  other: '#607D8B',
};

const statusLabels: Record<string, string> = {
  new: 'New',
  in_progress: 'In Progress',
  done: 'Completed',
  archived: 'Archived',
  removed: 'Removed',
};

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  open,
  onClose,
  onEdit,
  onDelete,
  onArchive,
}) => {
  if (!task) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          borderLeft: `6px solid ${priorityColors[task.priority]}`,
        },
      }}
    >
      <DialogTitle sx={{ pr: 6 }}>
        <Box>
          {/* Task ID */}
          {task.fullTaskId && (
            <Typography
              variant="caption"
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                mb: 0.5,
                display: 'block',
              }}
            >
              {task.fullTaskId}
            </Typography>
          )}

          {/* Title */}
          <Typography variant="h5" fontWeight={600}>
            {task.title}
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Status */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label={statusLabels[task.status]}
            color={task.status === 'done' ? 'success' : 'default'}
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Description */}
        {task.description && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" color="text.secondary">
              {task.description}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Metadata */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Category */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Category sx={{ color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
              Category:
            </Typography>
            <Chip
              label={task.category}
              size="small"
              sx={{
                bgcolor: categoryColors[task.category],
                color: 'white',
                fontWeight: 500,
              }}
            />
          </Box>

          {/* Priority */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Flag sx={{ color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
              Priority:
            </Typography>
            <Chip
              label={task.priority}
              size="small"
              sx={{
                bgcolor: priorityColors[task.priority],
                color: 'white',
                fontWeight: 500,
              }}
            />
          </Box>

          {/* Due Date */}
          {task.dueDate && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday sx={{ color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                Due Date:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {format(new Date(task.dueDate), 'MMMM dd, yyyy')}
              </Typography>
            </Box>
          )}

          {/* Created At */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime sx={{ color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
              Created:
            </Typography>
            <Typography variant="body2">
              {format(new Date(task.createdAt), 'MMM dd, yyyy HH:mm')}
            </Typography>
          </Box>

          {/* Completed At */}
          {task.completedAt && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTime sx={{ color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                Completed:
              </Typography>
              <Typography variant="body2">
                {format(new Date(task.completedAt), 'MMM dd, yyyy HH:mm')}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Label sx={{ color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Tags:
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {task.tags.map((tag) => (
                  <Chip
                    key={tag.id}
                    label={tag.name}
                    size="small"
                    sx={{
                      borderColor: tag.color,
                      color: tag.color,
                      bgcolor: tag.color + '20',
                    }}
                  />
                ))}
              </Box>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        {onEdit && (
          <Button variant="outlined" onClick={onEdit}>
            Edit
          </Button>
        )}
        {onArchive && task.status !== 'archived' && (
          <Button variant="outlined" color="warning" onClick={onArchive}>
            Archive
          </Button>
        )}
        {onDelete && (
          <Button variant="outlined" color="error" onClick={onDelete}>
            Delete
          </Button>
        )}
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
