import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  IconButton,
  TextField,
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import React, { useState } from 'react';
import VGUFullLogo from '../assets/LOGO/loginlogo.png';
import { LoginFormGlobalStyle } from '../globalstyle.tsx';
import './login_signupform.css';
// API
import { login } from '../api/api.ts';

import { handleErrors } from '../utils/handleErrors.tsx';
import { useNavigate } from 'react-router-dom';


export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [errors, setErrors] = useState<{username?: string; password?: string}>({})

  const navigate = useNavigate()
  
  const validate = () => {
    const newErrors: {username?: string; password?: string} = {}
    if (!username.trim()) newErrors.username = 'Username is required'
    if (!password) newErrors.password = 'Password is required'
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (errors.username) {
      setErrors((prev) => ({...prev, username: undefined}))
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({...prev, password: undefined}))
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const data = await login(username, password);
      console.log('Logged in:', data);
      navigate(`/chat/${data.session.user.username}`)
    } catch (error) {
        handleErrors(error, 'login')
    }
  };

  const handleLostPassword = () => {
    navigate('/lost-password')
  }
  const handleRegister = () => {
    navigate('/register')
  }

  return (
    <>
        <LoginFormGlobalStyle />
        <div className='container'>
          <form onSubmit={handleSubmit}>
            <div className='header'>
              <Box component="img" src={VGUFullLogo} alt="VGU Logo" className="logoVGU" />
              <div className='text'>Login to VGU</div>
            </div>
            <div className='input'>
              <TextField className="input_field" label="Username" variant="outlined"
                value={username}
                onChange={handleUsernameChange}
                error={!!errors.username}
                helperText={errors.username}
                fullWidth />
            </div>
            <div className='input'>
              <TextField className="input_field" label="Password" type={showPassword ? 'text' : 'password'}
              variant='outlined'
              value={password}
              onChange={handlePasswordChange}
              error={!!errors.password}
              helperText={errors.password}
              fullWidth
              InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </InputAdornment>
              )
              }}
              />
            </div>
            <div className='remember-forgot'>
              <label>
                <input type='checkbox' className="checkbox" />Remember me
              </label>
              <a className='lostpassword' onClick={handleLostPassword}>Lost password?</a>
            </div>
            <div className='submit-container'>
              <button type='submit' className='submit' onClick={(e) => { e.preventDefault(); handleSubmit(e);}}>Login</button>
            </div>
            <div className='register'>
              <p>Don't have an account? <a onClick={handleRegister}>Register</a></p>
            </div>
          </form>
        </div>
    </>
  );
}

