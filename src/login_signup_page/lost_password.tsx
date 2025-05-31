import React, { useState } from 'react';
import {
  Box,
  TextField,
} from '@mui/material';
import './login_signupform.css'
import VGUFullLogo from '../assets/LOGO/loginlogo.png'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LoginFormGlobalStyle from '../globalstyle.tsx';

interface LostPasswordFormProps {
  switchToLogin: () => void;
}


export default function LostPasswordForm({ switchToLogin }: LostPasswordFormProps) {
  const [username, setUsername] = useState<string>("")
  const [errors, setErrors] = useState<{username?: string; password?: string}>({})

  const validate = () => {
    const newErrors: {username?: string; password?: string} = {};
    if (!username.trim()) newErrors.username = 'You must input this field';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (errors.username) {
      setErrors((prev) => ({...prev, username: undefined}));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      alert("Please check your email")
      console.log({username});
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
                    <div className='input'>
                      <TextField className="input_field" label="Enter username or email" variant="outlined" 
                        value={username} 
                        onChange={handleUsernameChange}
                        error={!!errors.username}
                        helperText={errors.username}
                        fullWidth />
                    </div>
                    <a href='#' onClick={(e) => { e.preventDefault(); switchToLogin() }} className='back'>
                        <ArrowBackIcon className='icon-button' sx={{width: '18px'}} />
                        Turn back
                    </a>
                    <div className='submit-container'>
                        <button type='submit' className='submit'>Set password</button>
                    </div>
                  </form>
                </div>
    </>
);
}
