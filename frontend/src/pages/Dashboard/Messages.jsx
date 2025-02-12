import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';

const ChatList = ({ onSelectChat }) => {
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
      console.log('Conversations response:', response.data);
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
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-white">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
      </div>
      <div className="overflow-y-auto">
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
                  src={`http://localhost:8000/${chat.profilePicture}`}
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
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (username && user && token) {
      fetchChatHistory();
      setupWebSocket();
    }

    return () => {
      if (wsRef.current) {
        console.log('Cleaning up WebSocket connection');
        const ws = wsRef.current;
        wsRef.current = null; // Prevent reconnection attempts
        ws.close();
      }
    };
  }, [username, user, token]);

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
      // Clear any existing reconnect timeout
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
      
      // Only try to reconnect if the component is still mounted and we haven't started a new connection
      if (wsRef.current === ws) {
        // Wait for 3 seconds before trying to reconnect
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
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-4">
          <img
            src='https://thelightcommittee.com/wp-content/uploads/elementor/thumbs/women-linkedin-headshot-los-angeles-1-q71sclhob153lpmbqr2eydwgqhf7girral69pesikw.jpg'
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
           
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{username}</h2>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === user.username ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                msg.sender === user.username
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              <p className="break-words">{msg.message}</p>
              <span className="text-xs opacity-75 mt-1 block">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
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

const Messages = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const handleSelectChat = (username) => {
    navigate(`/dashboard/messages/${username}`);
  };

  if (!username) {
    return <ChatList onSelectChat={handleSelectChat} />;
  }

  return <ChatWindow username={username} />;
};

export default Messages;
