import React, { useState } from 'react';
const ChatInput = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (typeof onSend !== 'function') {
      console.error('onSend prop is not a function');
      return;
    }

    if (!text.trim()) return;

    onSend(text);  // This is line 9 where the error comes from
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 border rounded p-2"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 rounded">Send</button>
    </form>
  );
};

export default ChatInput;
