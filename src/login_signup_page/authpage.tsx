import { useState } from 'react'
import LoginForm from './loginform.tsx' 
import SignupForm from './signupform.tsx'
import LostPasswordForm from './lost_password.tsx'
import ChatPage from '../chat_page/chat.tsx'
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLostPassword, setIsLostPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false); 
    setIsLogin(true);
    setIsLostPassword(false);
  };

  if (isAuthenticated) {
    return <ChatPage switchToLogin={handleLogout} />;
  }
  return (
  <div>
    {isLostPassword ? (
      <LostPasswordForm switchToLogin={() => setIsLostPassword(false)} />
    ) : isLogin ? (
      <LoginForm 
        switchToSignup={() => setIsLogin(false)} 
        switchToLost={() => setIsLostPassword(true)}
        switchToChatPage={handleLoginSuccess} //
      />
    ) : (
      <SignupForm switchToLogin={() => setIsLogin(true)} />
    )}
  </div>
);
}