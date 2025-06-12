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
import { handleErrors } from '../utils/handleErrors.tsx';
import './login_signupform.css';


export default function LostPasswordForm() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});

  const navigate = useNavigate()

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await forgotPassword(email);
      alert('A password reset link has been sent to your email!');
      navigate('/reset-password');
    } catch (error: any) {
        handleErrors(error, 'forgot')
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
              className="input_field"
              label="Enter email"
              variant="outlined"
              onChange={handleEmailChange}
              value={email}
              error={!!errors.email}
              helperText={errors.email}
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
