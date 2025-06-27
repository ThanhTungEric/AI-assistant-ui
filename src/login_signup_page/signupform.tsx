import { Box, TextField } from '@mui/material';
import React, { useState } from 'react';
import { register } from '../api/api.ts';
import VGUFullLogo from '../assets/LOGO/loginlogo.png';
import { LoginFormGlobalStyle } from '../globalstyle.tsx';
import { handleErrors } from '../utils/handleErrors.tsx';
import './login_signupform.css';

export default function SignupForm() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<{
    email?: string
    username?: string
    password?: string
    confirmPassword?: string
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!username.trim()) {
      newErrors.username = 'Username is required'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please re-enter your password'
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (validate()) {
    try {
      const response = await register(email, username, password);
      alert('Registered successfully!');
      console.log(response);
    } catch (error) {
        handleErrors(error, 'register')
    }
  }
};

  return (
    <>
        <LoginFormGlobalStyle />
        <div className='container'>
          <form onSubmit={handleSubmit}>
            <div className='header'>
              <Box component="img" src={VGUFullLogo} alt="VGU Logo" className="logoVGU" />
              <div className='text'>Register an Account</div>
            </div>

        <div className='input'>
          <TextField
            className='input_field'
            label='Email'
            variant='outlined'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors(prev => ({ ...prev, email: undefined }))
            }}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
          />
        </div>

        <div className='input'>
          <TextField
            className='input_field'
            label='Username'
            variant='outlined'
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username) setErrors(prev => ({ ...prev, username: undefined }))
            }}
            error={!!errors.username}
            helperText={errors.username}
            fullWidth
          />
        </div>

        <div className='input'>
          <TextField
            className='input_field'
            label='Password'
            type='password'
            variant='outlined'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors(prev => ({ ...prev, password: undefined }))
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
              if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }))
            }}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            fullWidth
          />
        </div>

        <div className='submit-container'>
          <button type='submit' className='submit'>Register</button>
        </div>

        <div className='register'>
          <p>
            Already have an account?{' '}
            <a href='#'>
              Login
            </a>
          </p>
        </div>
      </form>
    </div>
    </>
  )
}
