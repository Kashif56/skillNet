import React, { useState } from 'react';
import { FaPaperPlane, FaSmile, FaPaperclip } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');

  const chats = [
    {
      id: 1,
      user: {
        name: 'Sarah Wilson',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        status: 'online'
      },
      lastMessage: 'Looking forward to our React session!',
      time: '2m ago',
      unread: 2
    },
    {
      id: 2,
      user: {
        name: 'Mike Johnson',
        avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
        status: 'offline'
      },
      lastMessage: 'Thanks for the Python tips!',
      time: '1h ago',
      unread: 0
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Sarah Wilson',
      content: "Hi! I saw your profile and I'm interested in learning React.",
      time: '10:30 AM',
      isSender: false
    },
    {
      id: 2,
      sender: 'You',
      content: "Hello Sarah! That's great. I'd be happy to help. What's your current experience level with JavaScript?",
      time: '10:32 AM',
      isSender: true
    },
    {
      id: 3,
      sender: 'Sarah Wilson',
      content: "I have basic knowledge of JavaScript and HTML/CSS. I've built a few simple websites.",
      time: '10:35 AM',
      isSender: false
    }
  ];

  return (
    <div className="flex h-screen pt-2 bg-gray-50">
      {/* Chat List */}
      <div className="w-80 border-r border-gray-200 bg-white">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Messages</h2>
          <div className="space-y-2">
            {chats.map((chat) => (
              <motion.div
                key={chat.id}
                whileHover={{ x: 5 }}
                onClick={() => setSelectedChat(chat)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedChat?.id === chat.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={chat.user.avatar}
                      alt={chat.user.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        chat.user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    ></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {chat.user.name}
                      </h3>
                      <span className="text-xs text-gray-500">{chat.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedChat.user.avatar}
                  alt={selectedChat.user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedChat.user.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedChat.user.status === 'online' ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isSender ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                      msg.isSender
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.isSender ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-600">
                  <FaSmile className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-600">
                  <FaPaperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="p-2 text-blue-600 hover:text-blue-700">
                  <FaPaperPlane className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
