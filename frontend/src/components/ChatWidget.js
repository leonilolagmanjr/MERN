import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import {
  getChats,
  getMessages,
  sendMessage as apiSendMessage,
  getGlobalChat,
} from '../services/chatApi';

const socket = io('http://localhost:5000'); // Connect to backend socket.io server

const ChatWidget = () => {
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
      socket.emit('joinChat', selectedChat._id); // Join the selected chat room

      // Listen for incoming messages
      socket.on('receiveMessage', (message) => {
        if (message.chatId === selectedChat._id) {
          setMessages((prev) => [...prev, message]);
        }
      });
    }

    return () => {
      socket.off('receiveMessage'); // Clean up listener
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
    const res = await getGlobalChat();
    setSelectedChat(res.data);
    await fetchMessages(res.data._id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const res = await apiSendMessage({
        chatId: selectedChat._id,
        receiverId: selectedChat.participants?.[1]?._id, // For private chat
        content: newMessage,
      });

      // Emit the message to the server
      socket.emit('sendMessage', {
        chatId: selectedChat._id,
        content: newMessage,
      });

      setMessages((prev) => [...prev, res.data]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  useEffect(() => {
    if (isOpen) fetchChats();
  }, [isOpen]);

  return (
    <div className="chat-widget">
      <button onClick={() => setIsOpen((prev) => !prev)}>
        {isOpen ? 'Close Chat' : 'Open Chat'}
      </button>

      {isOpen && (
        <div style={{ display: 'flex', height: 400, border: '1px solid gray', marginTop: 10 }}>
          {/* Chat List */}
          <div style={{ flex: 1, borderRight: '1px solid gray', padding: 10 }}>
            <button onClick={handleGlobalChat}>🌐 Global Chat</button>
            <h4>Chats</h4>
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => handleSelectChat(chat)}
                style={{
                  padding: '5px',
                  margin: '5px 0',
                  cursor: 'pointer',
                  background: selectedChat?._id === chat._id ? '#eee' : 'transparent',
                }}
              >
                {chat.participants?.map((p) => p?.name).join(', ') || 'Global Chat'}
              </div>
            ))}
          </div>

          {/* Messages */}
          <div style={{ flex: 2, padding: 10, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflowY: 'auto', borderBottom: '1px solid gray' }}>
              {messages.map((msg, index) => (
                <div key={index}>
                  <b>{msg.sender?.name || 'You'}:</b> {msg.content}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div style={{ display: 'flex', marginTop: 10 }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
                style={{ flex: 1, marginRight: 5 }}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
