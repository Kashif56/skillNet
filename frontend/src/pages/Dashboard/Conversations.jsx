import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';

const ConversationList = ({ onSelectChat }) => {
  const { token } = useSelector((state) => state.auth);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, [token]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/chats/conversations/', {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (Array.isArray(response.data)) {
        setConversations(response.data);
      } else {
        console.error('Received non-array data:', response.data);
        setConversations([]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FaSpinner className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-full bg-white">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100%-4rem)]">
        {!Array.isArray(conversations) || conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No conversations yet
          </div>
        ) : (
          conversations.map((chat) => (
            <div
              key={chat.username}
              onClick={() => onSelectChat(chat.username)}
              className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={chat.profilePicture ? `http://localhost:8000${chat.profilePicture}` : 'https://via.placeholder.com/40'}
                  alt={chat.username}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/40';
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {chat.firstName} {chat.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {chat.lastMessageTime ? format(new Date(chat.lastMessageTime), 'MMM d, h:mm a') : ''}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const WelcomeSection = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50 p-8">
      <img
        src="https://via.placeholder.com/200"
        alt="Welcome"
        className="w-32 h-32 mb-6"
      />
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Welcome to Messages
      </h2>
      <p className="text-gray-600 text-center max-w-md">
        Select a conversation from the list to start chatting or create a new conversation.
      </p>
    </div>
  );
};

const Conversations = () => {
  const navigate = useNavigate();

  const handleSelectChat = (username) => {
    navigate(`/dashboard/chat/${username}`);
  };

  return (
   
    <div className="flex h-[calc(100vh-64px)]">
      <div className="w-1/3 border-r border-gray-200">
        <ConversationList onSelectChat={handleSelectChat} />
      </div>
      <div className="w-2/3">
        <WelcomeSection />
      </div>
    </div>
   
  );
};

export default Conversations;
