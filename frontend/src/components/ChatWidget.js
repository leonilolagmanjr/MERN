import React, { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import {
  getChats,
  getMessages,
  sendMessage as apiSendMessage,
  getGlobalChat,
} from '../services/chatApi';
import { useAuth } from '../context/AuthContext'; // Import AuthContext to get the current user
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { FriendContext } from '../context/FriendContext'; // Import FriendContext

const socket = io('http://localhost:5000'); // Connect to backend socket.io server

const ChatWidget = () => {
  const { user } = useAuth(); // Get the current logged-in user
  const { friendListUpdated, openChatUserId, clearOpenChatUser } = useContext(FriendContext); // Get friendListUpdated and openChatUserId from context
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (selectedChat) {
      socket.emit('joinChat', selectedChat._id);

      socket.on('receiveMessage', (message) => {
        if (message.chatId === selectedChat._id) {
          setMessages((prev) => [...prev, message]);
        }
      });
    }

    return () => {
      socket.off('receiveMessage');
    };
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChats = async () => {
    try {
      const res = await getChats();
      setChats(res.data);
    } catch (err) {
      console.error('Failed to fetch chats', err);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await getMessages(chatId);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);
    await fetchMessages(chat._id);
  };

  const handleGlobalChat = async () => {
    try {
      const res = await getGlobalChat();
      setSelectedChat(res.data);
      await fetchMessages(res.data._id);
    } catch (err) {
      console.error('Failed to fetch global chat', err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      // Send the message to the server
      await apiSendMessage({
        chatId: selectedChat._id,
        receiverId: selectedChat.participants?.[1]?._id,
        content: newMessage,
      });

      // Emit the message to the server via socket
      socket.emit('sendMessage', {
        chatId: selectedChat._id,
        content: newMessage,
        sender: user || { name: 'Guest', _id: 'guest' }, // Use placeholder for non-logged-in users
      });

      // Clear the input field
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  useEffect(() => {
    if (isOpen) fetchChats();
  }, [isOpen]);

  // New effect to refetch chats when friend list updates
  useEffect(() => {
    if (friendListUpdated && isOpen) {
      fetchChats();
    }
  }, [friendListUpdated, isOpen]);

  // New effect to open chat when openChatUserId changes
  useEffect(() => {
    const openChat = async () => {
      if (!openChatUserId) return;

      try {
        // Check if chat with user exists
        const existingChat = chats.find(chat =>
          chat.participants.some(p => p._id === openChatUserId)
        );

        if (existingChat) {
          setSelectedChat(existingChat);
        } else {
          // Create new chat with user
          const res = await fetch('/api/chat/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ participantId: openChatUserId }),
          });
          const newChat = await res.json();
          setChats(prev => [...prev, newChat]);
          setSelectedChat(newChat);
        }
        setIsOpen(true);
      } catch (err) {
        console.error('Failed to open chat with user', err);
      } finally {
        clearOpenChatUser();
      }
    };

    openChat();
  }, [openChatUserId, chats, clearOpenChatUser]);

  return (
    <div className="chat-widget">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#1b2838',
          color: '#66c0f4',
          border: 'none',
          padding: '12px 16px',
          borderRadius: '50%',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '400px',
            height: '500px',
            backgroundColor: '#171a21',
            border: '2px solid #3a3f4b',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'row',
            boxShadow: '0 0 15px rgba(0,0,0,0.6)',
            zIndex: 999,
          }}
        >
          {/* Chat List */}
          <div
            style={{
              flex: 1,
              borderRight: '1px solid #3a3f4b',
              padding: 10,
              backgroundColor: '#1b2838',
              color: '#c7d5e0',
              overflowY: 'auto',
            }}
          >
            <button
              onClick={handleGlobalChat}
              style={{
                background: '#66c0f4',
                color: '#1b2838',
                padding: '6px 12px',
                marginBottom: 10,
                border: 'none',
                borderRadius: 5,
                fontWeight: 'bold',
              }}
            >
              🌐 Global Chat
            </button>
            <h4 style={{ color: '#66c0f4', marginBottom: 10 }}>Chats</h4>
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => handleSelectChat(chat)}
                style={{
                  padding: '8px',
                  marginBottom: 6,
                  cursor: 'pointer',
                  borderRadius: 5,
                  backgroundColor:
                    selectedChat?._id === chat._id ? '#2a475e' : 'transparent',
                  transition: '0.2s',
                }}
              >
                {chat.participants?.map((p) => p?.name).join(', ') || 'Global Chat'}
              </div>
            ))}
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 2,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#2a2a2a',
              color: '#fff',
              padding: 10,
            }}
          >
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                paddingRight: 8,
              }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    margin: '6px 0',
                    backgroundColor: msg.sender?._id === user?.id ? '#1b2838' : '#4b4b4b',
                    padding: '6px 12px',
                    borderRadius: 10,
                    alignSelf: msg.sender?._id === user?.id ? 'flex-end' : 'flex-start',
                    maxWidth: '70%',
                  }}
                >
                  <b style={{ color: '#66c0f4' }}>
                    {msg.sender?._id === user?.id ? (
                      'You'
                    ) : (
                      <Link
                        to={msg.sender?._id !== 'guest' ? `/profile/${msg.sender?._id}` : '#'}
                        style={{ color: '#66c0f4', textDecoration: 'none' }}
                      >
                        {msg.sender?.name || 'Unknown'}
                      </Link>
                    )}
                  </b>
                  : {msg.content}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div style={{ display: 'flex', marginTop: 10 }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: 10,
                  backgroundColor: '#1b2838',
                  border: '1px solid #3a3f4b',
                  borderRadius: 5,
                  color: '#fff',
                  marginRight: 5,
                }}
              />
              <button
                onClick={handleSendMessage}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#66c0f4',
                  color: '#1b2838',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: 5,
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
