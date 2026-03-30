import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import { useTheme } from '../../contexts/ThemeContext';
import { colorPalettes } from '../../themes/colorPalettes';

const themeOptions = [
  { value: 'blue', label: 'Blue Ocean', color: '#2196F3' },
  { value: 'pink', label: 'Pink Blossom', color: '#E91E63' },
  { value: 'green', label: 'Green Forest', color: '#4CAF50' },
  { value: 'yellow', label: 'Yellow Sunshine', color: '#FFEB3B' },
  { value: 'black', label: 'Classic Black', color: '#424242' },
  { value: 'red', label: 'Ruby Red', color: '#F44336' },
];

export const ThemeSelector: React.FC = () => {
  const { themeColor, setThemeColor } = useTheme();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Theme Color
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Choose your preferred color theme for the app
      </Typography>

      <RadioGroup
        value={themeColor}
        onChange={(e) => setThemeColor(e.target.value as any)}
      >
        <Grid container spacing={2}>
          {themeOptions.map((option) => (
            <Grid item xs={12} sm={6} key={option.value}>
              <Paper
                elevation={themeColor === option.value ? 4 : 1}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  border: themeColor === option.value ? 2 : 0,
                  borderColor: 'primary.main',
                  transition: 'all 0.2s',
                  '&:hover': {
                    elevation: 3,
                    transform: 'translateY(-2px)',
                  },
                }}
                onClick={() => setThemeColor(option.value as any)}
              >
                <FormControlLabel
                  value={option.value}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          bgcolor: option.color,
                          border: '2px solid #fff',
                          boxShadow: 1,
                        }}
                      />
                      <Typography variant="body1" fontWeight={500}>
                        {option.label}
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%' }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </RadioGroup>
    </Box>
  );
};
