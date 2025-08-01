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
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2 p-2 border-t">
  <input
    type="text"
    value={text}
    onChange={(e) => setText(e.target.value)}
    placeholder="Type your message..."
    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <button
    type="submit"
    className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition"
  >
    Send
  </button>
</form>
  );
};

export default ChatInput;
