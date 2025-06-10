import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Box,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../api/api.ts';
import VGUFullLogo from '../assets/LOGO/loginlogo.png';
import LoginFormGlobalStyle from '../globalstyle.tsx';
import './login_signupform.css';


interface LostPasswordFormProps {
  switchToLogin: () => void;
}

export default function LostPasswordForm({ switchToLogin }: LostPasswordFormProps) {
  const [username, setUsername] = useState<string>('');
  const [errors, setErrors] = useState<{ username?: string }>({});

  const navigate = useNavigate()

  const validate = () => {
    const newErrors: { username?: string } = {};
    if (!username.trim()) newErrors.username = 'You must input this field';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (errors.username) {
      setErrors((prev) => ({ ...prev, username: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await forgotPassword(username);
      alert('A password reset link has been sent to your email!');
      navigate('/reset-password');
    } catch (error: any) {
      console.error('Reset request failed:', error.message);
      alert('Error: ' + error.message);
    }
  };

  
  return (
    <>
      <LoginFormGlobalStyle />
      <div className='container'>
        <form onSubmit={handleSubmit}>
          <div className='header'>
            <Box component="img" src={VGUFullLogo} alt="VGU Logo" className="logoVGU-reset" />
            <div className='text-reset'>Reset password</div>
          </div>

          <a
          href='#'
          onClick={(e) => {
            e.preventDefault();
            switchToLogin();
          }}
          className='back'
        >
          <ArrowBackIcon className='icon-button' sx={{ width: '18px' }} />
          Turn back
        </a>

          <div className='input'>
            <TextField
              className="input_field"
              label="Enter username or email"
              variant="outlined"
              value={username}
              onChange={handleUsernameChange}
              error={!!errors.username}
              helperText={errors.username}
              fullWidth
            />
          </div>

          <div className='submit-container'>
            <button type='submit' className='submit'>Set password</button>
          </div>
        </form>

        
      </div>
    </>
  );
}
