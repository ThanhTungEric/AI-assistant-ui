import { useState } from 'react'
import LoginForm from './loginform.tsx' 
import SignupForm from './signupform.tsx'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      {isLogin ? (
        <LoginForm switchToSignup={() => setIsLogin(false)} />
      ) : (
        <SignupForm switchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
}