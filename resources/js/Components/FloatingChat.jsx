import React, { useState } from 'react';
// Remove or keep this based on your setup
// import { X } from 'lucide-react';
import ChatApp from '@/Pages/ChatApp';

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition duration-300 z-50"
      >
        💬
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 max-h-[90vh] bg-white shadow-2xl border border-gray-200 rounded-xl z-50 flex flex-col animate-fadeIn">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 rounded-t-xl flex justify-between items-center">
            <span className="font-semibold text-lg">Chat Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 p-1 rounded transition"
            >
              {/* Replace with Lucide X if installed */}
              ✕
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <ChatApp />
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChat;
