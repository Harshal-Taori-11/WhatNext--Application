import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
} from "@mui/material";
import {
  MoreVert,
  CalendarToday,
  Flag,
  Label,
  ArrowForward,
  ArrowBack,
} from "@mui/icons-material";
import { Task } from "../../types";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  isDragging?: boolean;
  onMoveForward?: () => void;
  onMoveBackward?: () => void;
}

const priorityColors: Record<string, string> = {
  high: "#F44336",
  medium: "#FF9800",
  low: "#4CAF50",
  none: "#9E9E9E",
};

const categoryColors: Record<string, string> = {
  work: "#2196F3",
  home: "#9C27B0",
  family: "#E91E63",
  routine: "#00BCD4",
  health: "#4CAF50",
  finance: "#FF9800",
  personal: "#673AB7",
  other: "#607D8B",
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onClick,
  isDragging = false,
  onMoveForward,
  onMoveBackward,
}) => {
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

  return (
    <Card
      onClick={onClick}
      sx={{
        mb: 2,
        cursor: "pointer",
        opacity: isDragging ? 0.5 : 1,
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)",
        },
        borderLeft: `4px solid ${priorityColors[task.priority]}`,
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {/* Task ID */}
        {task.fullTaskId && (
          <Typography
            variant="caption"
            sx={{
              color: "primary.main",
              fontWeight: 600,
              fontFamily: "monospace",
              mb: 0.5,
              display: "block",
            }}
          >
            {task.fullTaskId}
          </Typography>
        )}

        {/* Title */}
        <Typography
          variant="body1"
          fontWeight={600}
          sx={{
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {task.title}
        </Typography>

        {/* Description */}
        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {task.description}
          </Typography>
        )}

        {/* Metadata */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
          {/* Category */}
          <Chip
            label={task.category}
            size="small"
            sx={{
              bgcolor: categoryColors[task.category],
              color: "white",
              fontWeight: 500,
              height: 24,
              fontSize: "0.75rem",
            }}
          />

          {/* Priority */}
          {task.priority !== "none" && (
            <Chip
              icon={<Flag sx={{ fontSize: 14, color: "white !important" }} />}
              label={task.priority}
              size="small"
              sx={{
                bgcolor: priorityColors[task.priority],
                color: "white",
                fontWeight: 500,
                height: 24,
                fontSize: "0.75rem",
              }}
            />
          )}

          {/* Due Date */}
          {task.dueDate && (
            <Chip
              icon={<CalendarToday sx={{ fontSize: 14 }} />}
              label={format(new Date(task.dueDate), "MMM dd")}
              size="small"
              color={isOverdue ? "error" : "default"}
              variant={isOverdue ? "filled" : "outlined"}
              sx={{ height: 24, fontSize: "0.75rem" }}
            />
          )}
        </Box>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1.5 }}>
            {task.tags.map((tag) => (
              <Chip
                key={tag.id}
                icon={<Label sx={{ fontSize: 12 }} />}
                label={tag.name}
                size="small"
                variant="outlined"
                sx={{
                  height: 20,
                  fontSize: "0.7rem",
                  borderColor: tag.color,
                  color: tag.color,
                  "& .MuiChip-icon": {
                    color: tag.color,
                  },
                }}
              />
            ))}
          </Box>
        )}

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          {task.status !== "new" && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onMoveBackward?.();
              }}
              title="Move backward"
              sx={{
                color: "primary.main",
                "&:hover": {
                  bgcolor: "primary.lighter",
                },
              }}
            >
              <ArrowBack sx={{ fontSize: 18 }} />
            </IconButton>
          )}
          {task.status !== "done" && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onMoveForward?.();
              }}
              title="Move forward"
              sx={{
                color: "success.main",
                "&:hover": {
                  bgcolor: "success.lighter",
                },
              }}
            >
              <ArrowForward sx={{ fontSize: 18 }} />
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
