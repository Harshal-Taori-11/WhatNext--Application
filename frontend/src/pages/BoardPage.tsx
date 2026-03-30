import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { DragDropContext, Draggable, DropResult } from "@hello-pangea/dnd";
import { AppDispatch, RootState } from "../store/store";
import {
  fetchBoardTasks,
  createTask,
  updateTask,
} from "../store/slices/taskSlice";
import Header from "../components/layout/Header";
import { TaskCard } from "../components/board/TaskCard";
import { BoardColumn } from "../components/board/BoardColumn";
import { TaskDetailModal } from "../components/board/TaskDetailModal";
import { CreateTaskModal } from "../components/board/CreateTaskModal";
import { Task, CreateTaskRequest } from "../types";

const BoardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { boardTasks, loading } = useSelector(
    (state: RootState) => state.tasks,
  );

  const [openCreate, setOpenCreate] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    dispatch(fetchBoardTasks());
  }, [dispatch]);

  const handleCreateTask = async (data: CreateTaskRequest) => {
    try {
      await dispatch(createTask(data)).unwrap();
      dispatch(fetchBoardTasks());
      showSnackbar("Task created successfully!", "success");
    } catch (err) {
      showSnackbar("Failed to create task", "error");
      throw err;
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the task
    const taskId = parseInt(draggableId);
    const sourceStatus = source.droppableId as "new" | "in_progress" | "done";
    const destStatus = destination.droppableId as
      | "new"
      | "in_progress"
      | "done";
    const task = boardTasks[sourceStatus].find((t) => t.id === taskId);

    if (!task) return;

    // Update task status
    if (sourceStatus !== destStatus) {
      try {
        await dispatch(
          updateTask({
            id: taskId,
            data: { status: destStatus },
          }),
        ).unwrap();
        dispatch(fetchBoardTasks());
        showSnackbar(
          `Task moved to ${destStatus.replace("_", " ")}`,
          "success",
        );
      } catch (err) {
        showSnackbar("Failed to move task", "error");
      }
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setOpenDetail(true);
  };

  const moveTaskForward = async (task: Task) => {
    const statusProgression = { new: "in_progress", in_progress: "done" };
    const newStatus = statusProgression[
      task.status as keyof typeof statusProgression
    ] as "in_progress" | "done" | undefined;

    if (!newStatus) return;

    try {
      await dispatch(
        updateTask({
          id: task.id,
          data: { status: newStatus },
        }),
      ).unwrap();
      dispatch(fetchBoardTasks());
      showSnackbar(`Task moved to ${newStatus.replace("_", " ")}`, "success");
    } catch (err) {
      showSnackbar("Failed to move task forward", "error");
    }
  };

  const moveTaskBackward = async (task: Task) => {
    const statusRegression = { in_progress: "new", done: "in_progress" };
    const newStatus = statusRegression[
      task.status as keyof typeof statusRegression
    ] as "new" | "in_progress" | undefined;

    if (!newStatus) return;

    try {
      await dispatch(
        updateTask({
          id: task.id,
          data: { status: newStatus },
        }),
      ).unwrap();
      dispatch(fetchBoardTasks());
      showSnackbar(`Task moved to ${newStatus.replace("_", " ")}`, "success");
    } catch (err) {
      showSnackbar("Failed to move task backward", "error");
    }
  };

  const handleArchiveTask = async () => {
    if (!selectedTask) return;

    try {
      // Assuming you have an archiveTask action in your slice
      await dispatch(
        updateTask({
          id: selectedTask.id,
          data: { isArchived: true },
        }),
      ).unwrap();
      dispatch(fetchBoardTasks());
      setOpenDetail(false);
      showSnackbar("Task archived", "success");
    } catch (err) {
      showSnackbar("Failed to archive task", "error");
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && boardTasks.new.length === 0) {
    return (
      <>
        <Header />
        <Container sx={{ mt: 4, textAlign: "center" }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Task Board
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Drag and drop tasks to organize your workflow
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreate(true)}
            size="large"
            sx={{ px: 3 }}
          >
            New Task
          </Button>
        </Box>

        {/* Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Grid container spacing={2}>
            {/* New Column */}
            <Grid item xs={12} md={4}>
              <BoardColumn status="new" title="📋 New" tasks={boardTasks.new}>
                {boardTasks.new.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskCard
                          task={task}
                          onClick={() => handleTaskClick(task)}
                          isDragging={snapshot.isDragging}
                          onMoveForward={() => moveTaskForward(task)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              </BoardColumn>
            </Grid>

            {/* In Progress Column */}
            <Grid item xs={12} md={4}>
              <BoardColumn
                status="in_progress"
                title="🚀 In Progress"
                tasks={boardTasks.in_progress}
              >
                {boardTasks.in_progress.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskCard
                          task={task}
                          onClick={() => handleTaskClick(task)}
                          isDragging={snapshot.isDragging}
                          onMoveForward={() => moveTaskForward(task)}
                          onMoveBackward={() => moveTaskBackward(task)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              </BoardColumn>
            </Grid>

            {/* Done Column */}
            <Grid item xs={12} md={4}>
              <BoardColumn
                status="done"
                title="✅ Done"
                tasks={boardTasks.done}
              >
                {boardTasks.done.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskCard
                          task={task}
                          onClick={() => handleTaskClick(task)}
                          isDragging={snapshot.isDragging}
                          onMoveBackward={() => moveTaskBackward(task)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              </BoardColumn>
            </Grid>
          </Grid>
        </DragDropContext>

        {/* Modals */}
        <CreateTaskModal
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          onSubmit={handleCreateTask}
        />

        <TaskDetailModal
          task={selectedTask}
          open={openDetail}
          onClose={() => setOpenDetail(false)}
          onArchive={handleArchiveTask}
        />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default BoardPage;
