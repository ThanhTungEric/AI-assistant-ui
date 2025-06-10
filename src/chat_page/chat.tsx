import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { IconButton } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './chat.css';
import Mainpageglobalstyle from './globalstyle_mainpage';
// API
import { createMessage, logout } from '../api/api';



export default function ChatPage() {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate()
  const {username} = useParams()

  useEffect(() => {
    // If userName is missing or empty, redirect to login page
    if (!username || username.trim() === '') {
      navigate('/login');
    }
  }, [username, navigate]);

  const handleSettings = () => {
    alert('Go to Settings');
  };

  const handleLogout = async () => {
    navigate('/', { replace: true });
    try {
      await logout();
    } catch (error) {
        console.error('Logout failed: ', error)
    }
  };

  interface Message {
    sender: 'user' | 'bot';
    text: string;
    createdAt?: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const now = new Date().toISOString();

    const userMessage: Message = { sender: 'user', text: input, createdAt: now };
    const typingMessage: Message = { sender: 'bot', text: 'Assistant is typing' };

    setMessages((prev) => [...prev, userMessage, typingMessage]);
    setInput('');

  try {
    await createMessage(1, input, 'user');
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

    } catch (error) {
      console.error('❌ Failed to send message:', error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          sender: 'bot',
          text: 'Fehler beim Senden der Nachricht. Bitte versuchen Sie es erneut.',
        };
        return updated;
      });
    }
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
            {username}
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
                  {msg.createdAt && (
                      <div className="timestamp">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                  )}
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
