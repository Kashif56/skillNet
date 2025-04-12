import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const ConversationList = ({ onSelectChat, activeChat }) => {
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
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                activeChat === chat.username ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={`http://localhost:8000${chat.profilePicture}`}
                  alt={chat.username}
                  className="w-12 h-12 rounded-full object-cover"
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

const ChatWindow = ({ username }) => {
  const { user, token } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatUser, setChatUser] = useState(null);
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);
  const navigate = useNavigate();
  
  // Extract user's profile picture URL
  const currentUserImg = user?.profilePicture || '/default-profile.jpg';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (username && user && token) {
      fetchChatHistory();
      setupWebSocket();
      fetchConversationDetails();
    }

    return () => {
      if (wsRef.current) {
        console.log('Cleaning up WebSocket connection');
        const ws = wsRef.current;
        wsRef.current = null;
        ws.close();
      }
    };
  }, [username, user, token]);

  const fetchConversationDetails = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/chats/conversations/', {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (Array.isArray(response.data)) {
        const currentChat = response.data.find(chat => chat.username === username);
        if (currentChat) {
          setChatUser(currentChat);
          console.log("currentChat", currentChat);
        }
      }
    } catch (error) {
      console.error('Error fetching conversation details:', error);
      toast.error('Failed to load user details');
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/chats/chat-history/${username}/`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (Array.isArray(response.data)) {
        setMessages(response.data);
      } else {
        console.error('Received non-array data:', response.data);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      toast.error('Failed to load chat history');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    const roomName = [user.username, username].sort().join('_');
    const wsUrl = `ws://localhost:8000/ws/chat/${roomName}/?token=${token}`;
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const ws = new WebSocket(wsUrl);
    let reconnectTimeout;

    ws.onopen = () => {
      console.log('WebSocket Connected');
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        console.error('WebSocket message error:', data.error);
        toast.error(data.error);
      } else {
        setMessages(prev => [...prev, data]);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('Connection error. Messages might not be real-time.');
    };

    ws.onclose = (e) => {
      console.log('WebSocket Disconnected. Code:', e.code, 'Reason:', e.reason);
      
      if (wsRef.current === ws) {
        reconnectTimeout = setTimeout(() => {
          if (wsRef.current === ws) {
            console.log('Attempting to reconnect...');
            setupWebSocket();
          }
        }, 3000);
      }
    };

    wsRef.current = ws;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !wsRef.current) return;

    try {
      setSending(true);
      wsRef.current.send(JSON.stringify({
        message: newMessage,
        sender_id: user.id,
        receiver_id: username
      }));
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
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
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard/conversations')}
            className="md:hidden p-2 hover:bg-gray-100 rounded-full"
          >
            <FaArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <img
            src={`http://localhost:8000${chatUser?.profilePicture}`}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {chatUser ? `${chatUser.firstName} ${chatUser.lastName}` : username}
            </h2>
            <span className="text-sm font-normal text-gray-500">@{username}</span>
          </div>
         
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-white p-4">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index}>
              <div className={`flex items-end gap-2 ${msg.sender === user.username ? 'flex-row-reverse' : 'flex-row'}`}>
                <img
                  src={msg.sender === user.username 
                    ? (user.profilePicture ? `http://localhost:8000${user.profilePicture}` : '/default-profile.jpg')
                    : (chatUser?.profilePicture ? `http://localhost:8000${chatUser.profilePicture}` : '/default-profile.jpg')
                  }
                  alt={msg.sender === user.username ? 'Your profile' : 'Profile'}
                  className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                />
               
                <div className="flex flex-col">
                  <div
                    className={`px-4 py-2 max-w-sm ${
                      msg.sender === user.username
                        ? 'bg-[#0084ff] text-white rounded-l-2xl rounded-tr-2xl'
                        : 'bg-[#f0f0f0] text-black rounded-r-2xl rounded-tl-2xl'
                    }`}
                  >
                    <p className="text-[15px]">{msg.message}</p>
                  </div>
                  <span className={`text-xs text-gray-500 mt-1 ${
                    msg.sender === user.username ? 'self-end' : 'self-start'
                  }`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 ${
              !newMessage.trim() || sending
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-700'
            }`}
          >
            {sending ? (
              <FaSpinner className="w-4 h-4 animate-spin" />
            ) : (
              <FaPaperPlane className="w-4 h-4" />
            )}
            <span>Send</span>
          </button>
        </div>
      </form>
    </div>
  );
};

const Chat = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const handleSelectChat = (newUsername) => {
    navigate(`/dashboard/chat/${newUsername}`);
  };

  return (
   
      <div className="flex h-[calc(100vh-64px)]">
        <div className="hidden md:block w-1/3 border-r border-gray-200">
          <ConversationList onSelectChat={handleSelectChat} activeChat={username} />
        </div>
        <div className="w-full md:w-2/3">
          <ChatWindow username={username} />
        </div>
      </div>
   
  );
};

export default Chat;
