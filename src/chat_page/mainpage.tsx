import { useState } from 'react';
import './chat.css';

const ABC = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Xin chào! Tôi là chatbot tư vấn tuyển sinh của Đại học Kinh tế TP.HCM (UEH).' },
    { sender: 'user', text: 'nhiều điểm tốt nghiệp là tối thiểu' },
    { sender: 'bot', text: 'Hiện tại, tôi không tìm thấy thông tin cụ thể về điểm tốt nghiệp tối thiểu...' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Xin lỗi, tôi chưa có thông tin về điều đó.' }]);
    }, 500);
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>Lịch sử chat</h2>
        <div className="chat-item">Điểm Tốt Nghiệp Tối Thiểu</div>
        <div className="chat-item">Không thể trả lời câu</div>
      </aside>

      <div className="chat-window">
        <header className="header">
          <div className="logo">UEH Chatbot</div>
          <div className="user-info">
            <div className="avatar">T</div>
            <span>Trần Nguyên Lâm</span>
          </div>
        </header>

        <main className="messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message ${msg.sender === 'user' ? 'user' : 'bot'}`}
            >
              <strong>{msg.sender === 'user' ? 'Trần Nguyễn' : 'Assistant'}</strong>
              <div>{msg.text}</div>
            </div>
          ))}
        </main>

        <footer className="input-area">
          <input
            type="text"
            placeholder="Nhập tin nhắn của bạn..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Gửi</button>
        </footer>
      </div>
    </div>
  );
};

export default ABC;
