import { useState } from 'react'
import LoginForm from './loginform.tsx' 
import SignupForm from './signupform.tsx'
import LostPasswordForm from './lost_password.tsx'
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLostPassword, setIsLostPassword] = useState(false);

  return (
  <div>
    {isLostPassword ? (
      <LostPasswordForm switchToLogin={() => setIsLostPassword(false)} />
    ) : isLogin ? (
      <LoginForm 
        switchToSignup={() => setIsLogin(false)} 
        switchToLost={() => setIsLostPassword(true)} 
      />
    ) : (
      <SignupForm switchToLogin={() => setIsLogin(true)} />
    )}
  </div>
);
}