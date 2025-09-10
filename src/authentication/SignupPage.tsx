import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Link,
    Paper,
    CircularProgress,
    InputAdornment,
    IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VGUFullLogo from '../assets/VGU-Logo.png';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/index.ts';
import AlertDialog from '@components/AlertDialog';
import { COLORS } from '@util/colors.ts';

export default function SignupForm() {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState({ title: '', message: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const { registerUser, isLoading, error } = useAuth();

    const [errors, setErrors] = useState<{
        email?: string;
        fullName?: string;
        password?: string;
        confirmPassword?: string;
    }>({});

    const validate = () => {
        const newErrors: typeof errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please re-enter your password';
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        if (dialogContent.title === 'Success!') {
            navigate('/login');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const data = await registerUser(email, fullName, password);

        if (data) {
            setDialogContent({
                title: 'Success!',
                message: 'Your account has been created successfully.',
            });
            setOpenDialog(true);
        } else {
            setDialogContent({
                title: 'Error!',
                message: error || 'An unexpected error occurred during registration.',
            });
            setOpenDialog(true);
        }
    };

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
                    <Typography variant="h6" sx={{ mt: 1, color: COLORS.navy }}>
                        Register an Account
                    </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        error={!!errors.email}
                        helperText={errors.email}
                    />

                    <TextField
                        label="Full Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={fullName}
                        onChange={(e) => {
                            setFullName(e.target.value);
                            if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                        }}
                        error={!!errors.fullName}
                        helperText={errors.fullName}
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

                    <TextField
                        label="Re-enter Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (errors.confirmPassword)
                                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                        }}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

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
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                        </Button>
                    </Box>

                    <Box textAlign="center" mt={2}>
                        <Typography variant="body2">
                            Already have an account?{' '}
                            <Link
                                component={RouterLink}
                                to="/login"
                                underline="hover"
                                sx={{ color: COLORS.navy, '&:hover': { color: COLORS.navyHover } }}
                            >
                                Login
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            <AlertDialog
                open={openDialog}
                title={dialogContent.title}
                message={dialogContent.message}
                onClose={handleCloseDialog}
            />
        </Box>
    );
}
