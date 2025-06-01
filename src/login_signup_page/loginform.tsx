import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
} from '@mui/material';
import './login_signupform.css'
import VGUFullLogo from '../assets/LOGO/loginlogo.png'
import VisibilityIcon from '@mui/icons-material/Visibility';
import InputAdornment from '@mui/material/InputAdornment';
import LoginFormGlobalStyle from '../globalstyle.tsx';



interface LoginFormProps {
  switchToSignup: () => void
  switchToLost: () => void
  switchToChatPage: () => void
  }


export default function LoginForm({ switchToSignup, switchToLost, switchToChatPage }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [errors, setErrors] = useState<{username?: string; password?: string}>({})
  
  


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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      alert("Login successfully!!!")
      console.log({username, password});
      switchToChatPage()
    }
  };
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
                      <a href='#' className='lostpassword' onClick={(e) => { e.preventDefault(); switchToLost(); }}>Lost password?</a>
                    </div>
                    <div className='submit-container'>
                      <button type='submit' className='submit' onClick={(e) => { e.preventDefault(); handleSubmit(e);}}>Login</button>
                    </div>
                    <div className='register'>
                      <p>Don't have an account? <a href='#' onClick={(e) => { e.preventDefault(); switchToSignup(); }}>Register</a></p>
                    </div>
                  </form>
                </div>
    </>
);
}

