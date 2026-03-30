import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Restore as RestoreIcon,
  Archive as ArchiveIcon,
  Refresh as RefreshIcon,
  RemoveCircle as RemoveIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../store/store';
import { fetchTasks, updateTask, archiveTask, restoreTask, setFilters } from '../store/slices/taskSlice';
import { taskService } from '../services/taskService';
import Header from '../components/layout/Header';
import { TaskEditModal } from '../components/tasks/TaskEditModal';
import { Task, UpdateTaskRequest } from '../types';

const AllTasksPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, statusCounts, loading } = useSelector((state: RootState) => state.tasks);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['new', 'in_progress', 'done']);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    handleSearch();
  }, [selectedStatuses]);

  const handleSearch = () => {
    dispatch(setFilters({
      statuses: selectedStatuses,
      search: searchQuery,
    }));
    dispatch(fetchTasks({
      statuses: selectedStatuses,
      search: searchQuery,
    }));
  };

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setOpenEdit(true);
  };

  const handleUpdateTask = async (id: number, data: UpdateTaskRequest) => {
    await dispatch(updateTask({ id, data }));
    handleSearch();
  };

  const handleRemove = async (id: number) => {
    if (window.confirm('Remove this task? It will be hidden from main views but can be recovered.')) {
      await taskService.removeTask(id);
      handleSearch();
    }
  };

  const handleArchive = async (id: number) => {
    await dispatch(archiveTask(id));
    handleSearch();
  };

  const handleRestore = async (id: number) => {
    await dispatch(restoreTask(id));
    handleSearch();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'info';
      case 'in_progress':
        return 'warning';
      case 'done':
        return 'success';
      case 'archived':
        return 'default';
      case 'removed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          All Tasks
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Filter by Status
                </Typography>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedStatuses.includes('new')}
                        onChange={() => handleStatusToggle('new')}
                      />
                    }
                    label={`New (${statusCounts.new || 0})`}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedStatuses.includes('in_progress')}
                        onChange={() => handleStatusToggle('in_progress')}
                      />
                    }
                    label={`In Progress (${statusCounts.in_progress || 0})`}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedStatuses.includes('done')}
                        onChange={() => handleStatusToggle('done')}
                      />
                    }
                    label={`Done (${statusCounts.done || 0})`}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedStatuses.includes('archived')}
                        onChange={() => handleStatusToggle('archived')}
                      />
                    }
                    label={`Archived (${statusCounts.archived || 0})`}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedStatuses.includes('removed')}
                        onChange={() => handleStatusToggle('removed')}
                      />
                    }
                    label={`Removed (${statusCounts.removed || 0})`}
                  />
                </FormGroup>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Search
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <IconButton onClick={handleSearch} color="primary">
                    <RefreshIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Task ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tags</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography color="text.secondary" sx={{ py: 4 }}>
                        No tasks found. Try adjusting your filters.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task) => (
                    <TableRow
                      key={task.id}
                      hover
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                      onClick={() => handleEdit(task)}
                    >
                      <TableCell>
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'primary.main',
                            fontSize: '0.85rem',
                          }}
                        >
                          {task.fullTaskId || `#${task.id}`}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {task.title}
                        </Typography>
                        {task.description && (
                          <Typography variant="caption" color="text.secondary">
                            {task.description.substring(0, 60)}
                            {task.description.length > 60 && '...'}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={task.status.replace('_', ' ')}
                          size="small"
                          color={getStatusColor(task.status) as any}
                        />
                      </TableCell>
                      <TableCell>
                        {task.priority !== 'none' && (
                          <Chip
                            label={task.priority}
                            size="small"
                            color={getPriorityColor(task.priority) as any}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip label={task.category} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {task.tags.map((tag) => (
                            <Chip
                              key={tag.id}
                              label={tag.name}
                              size="small"
                              sx={{ bgcolor: tag.color + '20' }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                        {task.status === 'removed' ? (
                          <Tooltip title="Restore from removed">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleRestore(task.id)}
                            >
                              <RestoreIcon />
                            </IconButton>
                          </Tooltip>
                        ) : task.isArchived ? (
                          <Tooltip title="Restore from archive">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleRestore(task.id)}
                            >
                              <RestoreIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <>
                            <Tooltip title="Edit task">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEdit(task)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Archive task">
                              <IconButton
                                size="small"
                                color="warning"
                                onClick={() => handleArchive(task.id)}
                              >
                                <ArchiveIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Remove task (recoverable)">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemove(task.id)}
                              >
                                <RemoveIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Showing {tasks.length} tasks
          </Typography>
        </Box>
      </Container>

      {/* Edit Modal */}
      <TaskEditModal
        task={editingTask}
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSubmit={handleUpdateTask}
      />
    </>
  );
};

export default AllTasksPage;
