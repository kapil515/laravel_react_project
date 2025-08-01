import React from 'react';

const Message = ({ role, content }) => {
  const isUser = role === 'user';
  return (
    <div className={`my-2 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`p-3 rounded-lg ${isUser ? 'bg-blue-200' : 'bg-gray-200'} max-w-sm`}>
        <p className="text-sm">{content}</p>
      </div>
    </div>
  );
};

export default Message;
