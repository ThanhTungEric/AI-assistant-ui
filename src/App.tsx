import { Route, Routes } from 'react-router-dom'
import ChatPage from './chat_page/chat.tsx'
import AuthPage from './login_signup_page/authpage.tsx'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ChatPage userName="" />} />
        <Route path="/login" element={<AuthPage />} />
        </Routes>
    </div>
  )
}

export default App
