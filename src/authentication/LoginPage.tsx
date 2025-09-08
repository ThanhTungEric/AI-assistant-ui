import React, { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Paper,
  Link,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VGUFullLogo from '../assets/VGU-Logo.png';
import { getProfile } from '../services/api/user.ts';
import { useAuth } from '@hooks/index.ts';
import { COLORS } from '@util/colors.ts';
import AlertDialog from '@components/AlertDialog.tsx';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [checkingSession, setCheckingSession] = useState(true);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);

  const navigate = useNavigate();
  const { loginUser, isLoading, error } = useAuth();

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await getProfile();
        if (res.session?.user) {
          navigate(`/chat/${res.session.user.username}`);
        }
      } catch {
        // not logged in
      } finally {
        setCheckingSession(false);
      }
    };
    checkLoggedIn();
  }, [navigate]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = await loginUser(username, password);
    if (data) {
      navigate('/');
    }
  };

  const handleOpenAlertDialog = (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn chặn chuyển hướng
    setOpenAlertDialog(true);
  };

  const handleCloseAlertDialog = () => {
    setOpenAlertDialog(false);
  };

  if (checkingSession) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
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
          <Typography variant="h6" sx={{ mt: 1 }}>
            Login to AI assistant
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
            }}
            error={!!errors.username}
            helperText={errors.username}
          />

          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <VisibilityIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                width: 200,
                height: 40,
                fontWeight: 600,
                backgroundColor: COLORS.navy,
                '&:hover': { backgroundColor: COLORS.navyHover },
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
          </Box>

          <Box textAlign="center" mt={2}>
            <Link
              component={RouterLink}
              to="/lost-password"
              onClick={handleOpenAlertDialog}
              underline="hover"
              sx={{ color: COLORS.navy, '&:hover': { color: COLORS.navyHover } }}
            >
              Lost password?
            </Link>
          </Box>

          <Box textAlign="center" mt={2}>
            <Typography variant="body2">
              Don’t have an account?{' '}
              <Link
                component={RouterLink}
                to="/register"
                underline="hover"
                sx={{ color: COLORS.navy, '&:hover': { color: COLORS.navyHover } }}
              >
                Register
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
      <AlertDialog
        open={openAlertDialog}
        title="Password Recovery"
        message="Your password reset request has been submitted. Please check your email at example@vgu.edu.vn."
        onClose={handleCloseAlertDialog}
      />

    </Box>
  );
}
