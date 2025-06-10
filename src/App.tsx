import { Route, Routes } from 'react-router-dom'
import ChatPage from './chat_page/chat.tsx'
import AuthPage from './login_signup_page/authpage.tsx'
import ResetPasswordForm from './login_signup_page/reset_password.tsx'
import LostPasswordForm from './login_signup_page/lost_password.tsx'
import SignupForm from './login_signup_page/signupform.tsx'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/chat/:username" element={<ChatPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<SignupForm />} />
        <Route path="/lost-password" element={<LostPasswordForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
      </Routes>
    </div>
  )
}

export default App
