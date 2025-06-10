import { Route, Routes } from 'react-router-dom'
import ChatPage from './chat_page/chat.tsx'
import AuthPage from './login_signup_page/authpage.tsx'
import ResetPasswordForm from './login_signup_page/reset_password.tsx'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/chat" element={<ChatPage userName="" />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
      </Routes>
    </div>
  )
}

export default App
