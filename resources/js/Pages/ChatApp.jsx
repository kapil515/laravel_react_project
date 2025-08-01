// ChatApp.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Message from '../Components/Message';
import ChatInput from '@/Pages/ChatInput';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);

  const sendMessage = async (text) => {
    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await axios.post('/api/chat', { message: text });
      const aiMsg = { role: 'assistant', content: res.data.reply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, idx) => (
          <Message key={idx} role={msg.role} content={msg.content} />
        ))}
      </div>

      {/* ✅ This is critical: make sure you're passing sendMessage */}
      <ChatInput onSend={sendMessage} />
    </div>
  );
};

export default ChatApp;
