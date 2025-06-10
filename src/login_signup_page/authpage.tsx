import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from './loginform.tsx'
import LostPasswordForm from './lost_password.tsx'
import SignupForm from './signupform.tsx'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLostPassword, setIsLostPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  const navigate = useNavigate()

  const handleLoginSuccess = (name: string) => {
    setUserName(name)
    setIsAuthenticated(true);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/chat/${userName}`);
    }
  }, [isAuthenticated, userName]);
  
  return (
  <div>
    {isLostPassword ? (
      <LostPasswordForm />
    ) : isLogin ? (
      <LoginForm
        switchToChatPage={handleLoginSuccess}
      />
    ) : (
      <SignupForm />
    )}
  </div>
);
}