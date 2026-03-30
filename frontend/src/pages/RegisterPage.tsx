import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { RootState } from '../store/store';
import { authService } from '../services/authService';
import { OTPVerification } from '../components/auth/OTPVerification';
import { ProfileSetup } from '../components/auth/ProfileSetup';

const steps = ['Enter Email', 'Verify OTP', 'Create Profile'];

const RegisterPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/board');
    }
  }, [isAuthenticated, navigate]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.sendOTP(email);
      setActiveStep(1);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerified = () => {
    setActiveStep(2);
  };

  const handleRegistrationSuccess = () => {
    // Redirect to board - auth slice will be updated via login
    navigate('/board');
    window.location.reload(); // Reload to update auth state
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h3"
                align="center"
                gutterBottom
                sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}
              >
                WhatNext!
              </Typography>
              <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
                Create your account
              </Typography>

              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>

          {activeStep === 0 && (
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom align="center">
                  Let's get started
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                  Enter your email to receive a verification code
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleEmailSubmit}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    required
                    autoFocus
                    sx={{ mb: 3 }}
                  />
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading || !email}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Send Verification Code'}
                  </Button>
                </form>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="body2">
                    Already have an account?{' '}
                    <Link to="/login" style={{ textDecoration: 'none', color: '#3B82F6' }}>
                      Login
                    </Link>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}

          {activeStep === 1 && (
            <OTPVerification
              email={email}
              onVerified={handleOTPVerified}
              onBack={handleBack}
            />
          )}

          {activeStep === 2 && (
            <ProfileSetup
              email={email}
              onSuccess={handleRegistrationSuccess}
              onBack={handleBack}
            />
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
