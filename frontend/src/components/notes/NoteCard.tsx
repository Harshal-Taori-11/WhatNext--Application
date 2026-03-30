import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Collapse,
  Button,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Edit,
  Delete,
  Label,
} from '@mui/icons-material';
import { Note } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { getNoteCardColor, getNoteTitleColor } from '../../themes/colorPalettes';
import { format } from 'date-fns';

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
}) => {
  const [expanded, setExpanded] = useState(false);
  const { themeColor } = useTheme();

  const cardColor = getNoteCardColor(themeColor);
  const titleColor = getNoteTitleColor(themeColor);

  // Show preview (first 150 characters)
  const preview = note.content.substring(0, 150);
  const hasMore = note.content.length > 150;

  return (
    <Card
      sx={{
        bgcolor: cardColor,
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-4px)',
        },
        border: `2px solid ${titleColor}20`,
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: titleColor,
              flexGrow: 1,
            }}
          >
            {note.title}
          </Typography>
          <Box>
            <IconButton
              size="small"
              onClick={onEdit}
              sx={{ color: titleColor }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={onDelete}
              sx={{ color: titleColor }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Content Preview */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            mb: 2,
            whiteSpace: 'pre-wrap',
          }}
        >
          {expanded ? note.content : preview}
          {hasMore && !expanded && '...'}
        </Typography>

        {/* Expand/Collapse Button */}
        {hasMore && (
          <Button
            size="small"
            onClick={() => setExpanded(!expanded)}
            endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
            sx={{
              color: titleColor,
              fontWeight: 600,
              mb: 1,
            }}
          >
            {expanded ? 'Show Less' : 'Read More'}
          </Button>
        )}

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
            {note.tags.map((tag) => (
              <Chip
                key={tag.id}
                icon={<Label sx={{ fontSize: 12 }} />}
                label={tag.name}
                size="small"
                sx={{
                  bgcolor: tag.color + '30',
                  color: tag.color,
                  fontWeight: 500,
                  '& .MuiChip-icon': {
                    color: tag.color,
                  },
                }}
              />
            ))}
          </Box>
        )}

        {/* Footer */}
        <Box sx={{ mt: 2, pt: 1, borderTop: `1px solid ${titleColor}30` }}>
          <Typography variant="caption" color="text.secondary">
            Updated: {format(new Date(note.updatedAt), 'MMM dd, yyyy HH:mm')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
