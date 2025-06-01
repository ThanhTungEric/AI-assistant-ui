import { useEffect,useRef, useState } from 'react';
import './chat.css';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Mainpageglobalstyle from './globalstyle_mainpage';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { IconButton } from '@mui/material';


interface ChatPageprops{
  switchToLogin: () => void
}

export default function ChatPage({ switchToLogin }: ChatPageprops) {
  const [showMenu, setShowMenu] = useState(false);

  const handleSettings = () => {
    alert('Go to Settings');
  };

  const handleLogout = () => {
    alert('You are logged out');
    switchToLogin()
  };

  interface Message {
    sender: 'user' | 'bot';
    text: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
  if (!input.trim()) return;

  const userMessage: Message = { sender: 'user', text: input };
  const typingMessage: Message = { sender: 'bot', text: 'Assistant is typing' };

  setMessages((prev) => [...prev, userMessage, typingMessage]);
  setInput('');

  setTimeout(() => {
    const botMessage: Message = {
      sender: 'bot',
      text: 'Hallo, ich komme von der Vietnam-Deutschland-Universität. Ich unterstütze Sie bei Ihrer Zulassung.',
    };

    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = botMessage; 
      return updated;
    });
  }, 2000);
};

  useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }
  }, [messages]);


  return (
    <>
      <Mainpageglobalstyle />
      <div className="navbar">
        <div className="left-navbar">
          <img src="./src/assets/LOGO/loginlogo.png" alt="" className="Logo" />
          <div className="title">VGU Chatbot</div>
        </div>
        <div className="user-menu">
          <button
            type="button"
            className="user-content"
            onClick={() => setShowMenu(!showMenu)}
          >
            Trần Nguyễn Lâm
            <ArrowDropDownIcon />
          </button>

          {showMenu && (
            <div className="dropdown-menu">
              <ul>
                <li className='menu-item' onClick={() => handleSettings()}>Settings</li>
                <li className='menu-item' onClick={() => handleLogout()}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="chatbot-container">
        <div className="sidebar">
          <h2>Chat history</h2>
          <div className="history-item">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </div>
          <div className="history-item">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </div>
        </div>

        <div className="chat-window">
          <div className="messages">
            <div className='message bot'>
                <div className='sender'>
                    Assistant
                </div>
                <div className='bubble'>
                    Hallo, ich komme von der Vietnam-Deutschland-Universität. Ich unterstütze Sie bei Ihrer Zulassung.
                    Hallo, ich komme von der Vietnam-Deutschland-Universität. Ich unterstütze Sie bei Ihrer Zulassung.
                    Hallo, ich komme von der Vietnam-Deutschland-Universität. Ich unterstütze Sie bei Ihrer Zulassung.
                    Hallo, ich komme von der Vietnam-Deutschland-Universität. Ich unterstütze Sie bei Ihrer Zulassung.
                    <div className='chat-actions'>
                      <ThumbUpIcon fontSize="small" />
                      <EditIcon fontSize="small" />
                      <FileCopyIcon fontSize="small" />
                    </div>
                </div>
              </div>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender} fade-in`}>
                <div className="sender">
                  {msg.sender === 'user' ? 'You' : 'Assistant'}
                </div>
                <div className={`bubble ${msg.text.includes('typing') ? 'typing' : ''}`}>
                  {msg.text}
                  {msg.sender === 'bot' && !msg.text.includes('typing') && (
                  <div className="chat-actions">
                    <ThumbUpIcon fontSize="small" />
                    <EditIcon fontSize="small" />
                    <FileCopyIcon fontSize="small" />
                  </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-area">
            <textarea
              value={input}
              placeholder="Type a message..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault(); 
                  handleSend();       
                }
              }}
              className="chat-textarea"
            />

            <div className="input-actions">
              <IconButton className="input-buttons" onClick={handleSend}>
                <ArrowUpwardIcon className="input-icons" fontSize="large" />
              </IconButton>
              <IconButton className="input-buttons">
                <AddCircleOutlineIcon className="input-icons" fontSize="large" />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
