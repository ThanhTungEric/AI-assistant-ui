import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Box,
  TextField,
  CircularProgress,
  Typography,
  Paper,
  Button,
  Link,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import VGUFullLogo from '../assets/VGU-Logo.png';
import { usePasswordReset } from '@hooks/user/usePasswordReset';
import AlertDialog from '@components/AlertDialog.tsx';
import { COLORS } from '@util/colors.ts';

export default function LostPasswordForm() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: '', message: '' });

  const navigate = useNavigate();
  const { forgot, isLoading, error, isSuccess } = usePasswordReset();

  const validate = () => {
    const newErrors: { email?: string } = {};
    if (!email.trim()) newErrors.email = 'You must input this field';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    if (isSuccess) {
      navigate('/login');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await forgot(email);

    if (success) {
      setDialogContent({
        title: 'Success!',
        message: 'A password reset link has been sent to your email. Please check your inbox.',
      });
      setOpenDialog(true);
    } else {
      setDialogContent({
        title: 'Error!',
        message: error || 'Failed to send request. Please try again.',
      });
      setOpenDialog(true);
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: COLORS.bgSoft,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Paper
          elevation={3}
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            p: 4,
            maxWidth: 400,
            width: '100%',
            borderRadius: 3,
            backgroundColor: 'white',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              component="img"
              src={VGUFullLogo}
              alt="VGU Logo"
              sx={{ height: 60, objectFit: 'contain', mb: 1 }}
            />
            <Typography variant="h6" sx={{ mt: 1, color: COLORS.navy }}>
              Reset password
            </Typography>
          </Box>
          <Link
            component={RouterLink}
            to="/login"
            underline="hover"
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
              textDecoration: 'none',
              color: COLORS.navy,
              '&:hover': {
                color: COLORS.navyHover,
                textDecoration: 'underline',
              },
            }}
          >
            <ArrowBackIcon sx={{ mr: 1, width: 18 }} />
            <Typography variant="body2">Turn back</Typography>
          </Link>

          <TextField
            label="Enter email"
            variant="outlined"
            onChange={handleEmailChange}
            value={email}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            margin="normal"
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{
              height: 48,
              fontWeight: 600,
              backgroundColor: COLORS.navy,
              '&:hover': { backgroundColor: COLORS.navyHover },
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Set password'}
          </Button>
        </Paper>
      </Box>
      <AlertDialog
        open={openDialog}
        title={dialogContent.title}
        message={dialogContent.message}
        onClose={handleCloseDialog}
      />
    </>
  );
}
