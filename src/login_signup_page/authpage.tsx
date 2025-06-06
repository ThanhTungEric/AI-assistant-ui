import { useState } from 'react'
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

  if (isAuthenticated) {
    return <ChatPage userName={userName}></ChatPage>
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