import { useState } from 'react'
import { logout } from '../api/api.ts'
import ChatPage from '../chat_page/chat.tsx'
import LoginForm from './loginform.tsx'
import LostPasswordForm from './lost_password.tsx'
import SignupForm from './signupform.tsx'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLostPassword, setIsLostPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  const handleLoginSuccess = (name: string) => {
    setUserName(name)
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      setIsLogin(true);
      setIsLostPassword(false);
    } catch (error) {
        console.error('Logout failed: ', error)
    }
  };

  if (isAuthenticated) {
    return <ChatPage switchToLogin={handleLogout} userName={userName}/>;
  }
  return (
  <div>
    {isLostPassword ? (
      <LostPasswordForm switchToLogin={() => setIsLostPassword(false)} />
    ) : isLogin ? (
      <LoginForm
        switchToSignup={() => setIsLogin(false)}
        switchToLost={() => setIsLostPassword(true)}
        switchToChatPage={handleLoginSuccess}
      />
    ) : (
      <SignupForm switchToLogin={() => setIsLogin(true)} />
    )}
  </div>
);
}