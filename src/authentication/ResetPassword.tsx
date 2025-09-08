import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    Box,
    TextField,
    CircularProgress,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VGUFullLogo from '../assets/LOGO/loginlogo.png';
import LoginFormGlobalStyle from '../globalstyle.tsx';
import './login_signupform.css';

import { usePasswordReset } from '@hooks/user/usePasswordReset';
import AlertDialog from '@components/AlertDialog.tsx';

export default function ResetPasswordForm() {
    const [email, setEmail] = useState('');
    const [tempPassword, setTempPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{
        email?: string;
        tempPassword?: string;
        password?: string;
        confirmPassword?: string;
    }>({});
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState({ title: '', message: '' });

    const navigate = useNavigate();
    const { reset, isLoading, error, isSuccess } = usePasswordReset();

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!tempPassword) {
            newErrors.tempPassword = 'Password is required';
        } else if (tempPassword.length < 6) {
            newErrors.tempPassword = 'Password must be at least 6 characters';
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
        if (isSuccess) {
            navigate('/login');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const success = await reset(email, tempPassword, password);

        if (success) {
            setDialogContent({
                title: 'Success!',
                message: 'Password has been reset successfully. Please log in with your new password.',
            });
            setOpenDialog(true);
        } else {
            setDialogContent({
                title: 'Error!',
                message: error || 'Failed to reset password. Please try again.',
            });
            setOpenDialog(true);
        }
    };

    return (
        <>
            <LoginFormGlobalStyle />
            <div className='container'>
                <form onSubmit={handleSubmit}>
                    <div className='header'>
                        <Box component="img" src={VGUFullLogo} alt="VGU Logo" className="logoVGU" />
                        <div className='text'>Reset Password</div>
                    </div>

                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/login')
                        }}
                        className='back'
                    >
                        <ArrowBackIcon className='icon-button' sx={{ width: '18px' }} />
                        Turn back
                    </a>

                    <div className='input'>
                        <TextField
                            className='input_field'
                            label='Email'
                            type='email'
                            variant='outlined'
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                            }}
                            error={!!errors.email}
                            helperText={errors.email}
                            fullWidth
                        />
                    </div>

                    <div className='input'>
                        <TextField
                            className='input_field'
                            label='Temporary Password'
                            type='password'
                            variant='outlined'
                            value={tempPassword}
                            onChange={(e) => {
                                setTempPassword(e.target.value);
                                if (errors.tempPassword) setErrors(prev => ({ ...prev, tempPassword: undefined }));
                            }}
                            error={!!errors.tempPassword}
                            helperText={errors.tempPassword}
                            fullWidth
                        />
                    </div>

                    <div className='input'>
                        <TextField
                            className='input_field'
                            label='New Password'
                            type='password'
                            variant='outlined'
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                            }}
                            error={!!errors.password}
                            helperText={errors.password}
                            fullWidth
                        />
                    </div>

                    <div className='input'>
                        <TextField
                            className='input_field'
                            label='Re-enter Password'
                            type='password'
                            variant='outlined'
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                            }}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            fullWidth
                        />
                    </div>

                    <div className='submit-container'>
                        <button type='submit' className='submit' disabled={isLoading}>
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm'}
                        </button>
                    </div>
                </form>
            </div>

            <AlertDialog
                open={openDialog}
                title={dialogContent.title}
                message={dialogContent.message}
                onClose={handleCloseDialog}
            />
        </>
    );
}
