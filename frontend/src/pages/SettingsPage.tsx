import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  Alert,
  CircularProgress,
  Divider,
  FormControlLabel,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { AppDispatch, RootState } from '../store/store';
import { fetchSettings, updateSettings } from '../store/slices/settingsSlice';
import Header from '../components/layout/Header';
import { ThemeSelector } from '../components/settings/ThemeSelector';
import { useTheme } from '../contexts/ThemeContext';

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { settings, loading } = useSelector((state: RootState) => state.settings);
  const { themeColor } = useTheme();
  const [autoArchiveDays, setAutoArchiveDays] = useState(2);
  const [autoArchiveEnabled, setAutoArchiveEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!settings) {
      dispatch(fetchSettings());
    }
  }, [settings, dispatch]);

  useEffect(() => {
    if (settings) {
      setAutoArchiveDays(settings.autoArchiveDays);
      setAutoArchiveEnabled(settings.autoArchiveEnabled);
    }
  }, [settings]);

  const handleSave = async () => {
    await dispatch(
      updateSettings({
        autoArchiveDays,
        autoArchiveEnabled,
        themeColor, // Save current theme color
      })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading && !settings) {
    return (
      <>
        <Header />
        <Container sx={{ mt: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Customize your WhatNext! experience
        </Typography>

        {saved && (
          <Alert severity="success" sx={{ mb: 3 }}>
            ✅ Settings saved successfully!
          </Alert>
        )}

        {/* Theme Settings */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <ThemeSelector />
          </CardContent>
        </Card>

        {/* Auto-Archive Settings */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Auto-Archive
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Automatically archive completed tasks after a specified number of days
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={autoArchiveEnabled}
                  onChange={(e) => setAutoArchiveEnabled(e.target.checked)}
                />
              }
              label="Enable auto-archive"
              sx={{ mb: 2, display: 'block' }}
            />

            {autoArchiveEnabled && (
              <TextField
                type="number"
                label="Days until archive"
                value={autoArchiveDays}
                onChange={(e) => setAutoArchiveDays(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1, max: 30 }}
                fullWidth
                helperText="Tasks in 'Done' status will be archived after this many days"
              />
            )}
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              About
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" paragraph>
              <strong>WhatNext!</strong> - Simple Life Task Manager
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Version 2.0.0
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Features:
            </Typography>
            <Box component="ul" sx={{ mt: 1, pl: 2 }}>
              <Typography variant="caption" color="text.secondary" component="li">
                ✨ Drag-and-drop task board
              </Typography>
              <Typography variant="caption" color="text.secondary" component="li">
                🆔 Unique task IDs
              </Typography>
              <Typography variant="caption" color="text.secondary" component="li">
                🎨 6 color themes
              </Typography>
              <Typography variant="caption" color="text.secondary" component="li">
                🔐 Email verification with OTP
              </Typography>
              <Typography variant="caption" color="text.secondary" component="li">
                📝 Expandable notes
              </Typography>
              <Typography variant="caption" color="text.secondary" component="li">
                🗑️ Soft delete (remove)
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{ px: 4 }}
          >
            Save Settings
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default SettingsPage;
