import React from "react";
import { Box, Typography, Paper, Badge } from "@mui/material";
import { Droppable } from "@hello-pangea/dnd";
import { Task } from "../../types";

interface BoardColumnProps {
  status: "new" | "in_progress" | "done";
  title: string;
  tasks: Task[];
  children: React.ReactNode;
}

const columnStyles: Record<string, any> = {
  new: {
    headerBg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    bodyBg: "#f8f9ff",
    borderColor: "#667eea",
  },
  in_progress: {
    headerBg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    bodyBg: "#fff8f9",
    borderColor: "#f5576c",
  },
  done: {
    headerBg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    bodyBg: "#f0fbff",
    borderColor: "#4facfe",
  },
};

export const BoardColumn: React.FC<BoardColumnProps> = ({
  status,
  title,
  tasks,
  children,
}) => {
  const styles = columnStyles[status];

  return (
    <Paper
      elevation={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: 2,
        overflow: "hidden",
        border: `2px solid ${styles.borderColor}`,
      }}
    >
      {/* Column Header */}
      <Box
        sx={{
          background: styles.headerBg,
          color: "white",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
        <Badge
          badgeContent={tasks.length}
          color="default"
          sx={{
            "& .MuiBadge-badge": {
              bgcolor: "rgba(255,255,255,0.9)",
              color: styles.borderColor,
              fontWeight: 700,
            },
          }}
        />
      </Box>

      {/* Droppable Area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              flexGrow: 1,
              p: 2,
              bgcolor: snapshot.isDraggingOver
                ? styles.borderColor + "22"
                : styles.bodyBg,
              transition: "background-color 0.2s",
              minHeight: 200,
              overflowY: "auto",
              overflowX: "hidden",
              "&::-webkit-scrollbar": {
                width: 8,
              },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: styles.borderColor,
                borderRadius: 4,
              },
            }}
          >
            {children}
            {provided.placeholder}

            {/* Empty state */}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  color: "text.secondary",
                }}
              >
                <Typography variant="body2">No tasks here</Typography>
                <Typography variant="caption">
                  Drag tasks here or create a new one
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Droppable>
    </Paper>
  );
};
