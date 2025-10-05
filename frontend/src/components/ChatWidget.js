import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import io from 'socket.io-client';
import {
    getChats,
    getMessages,
    sendMessage as apiSendMessage,
    getOrCreateChat,
} from '../services/chatApi';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FriendContext } from '../context/FriendContext';
import UserLink from './UserLink';

// --- Socket Setup ---
const socket = io('http://100.123.122.74:5000', {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

// FIX: Helper function to reliably determine if a chat object is the Global Chat
const isGlobalChat = (chat) => chat.participants && chat.participants.length === 0;

const ChatWidget = () => {
    const { user } = useAuth();
    const { friendListUpdated, openChatUserId, clearOpenChatUser } = useContext(FriendContext);
    
    // --- State Variables ---
    const [isOpen, setIsOpen] = useState(false);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    
    // New State: Loading and Error Handling
    const [isLoading, setIsLoading] = useState(false);
    const [chatError, setChatError] = useState('');
    
    const bottomRef = useRef(null);

    // --- Utility Functions ---
    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    // Helper to determine the name of the chat partner for a private chat
    const getChatPartner = (chat) => {
        if (isGlobalChat(chat)) return '🌐 Global Chat';
        
        // Find the participant who is NOT the current user
        const partner = chat.participants.find(p => p._id !== user?.id);
        return partner?.name || 'Unknown User';
    };
    
    // --- Data Fetching Functions ---
    const fetchChats = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        setChatError('');
        try {
            const res = await getChats();
            // Separate Global Chat from Private Chats for organized rendering
            const globalChat = res.data.find(isGlobalChat);
            const privateChats = res.data
                .filter(chat => !isGlobalChat(chat))
                .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

            // Set chats with Global Chat first (if it exists)
            setChats(globalChat ? [globalChat, ...privateChats] : privateChats);
        } catch (err) {
            console.error('Failed to fetch chats', err);
            setChatError('Failed to load chats.');
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const fetchMessages = useCallback(async (chatId) => {
        if (!chatId) return;
        setIsLoading(true);
        setChatError('');
        try {
            const res = await getMessages(chatId);
            setMessages(res.data);
        } catch (err) {
            console.error('Failed to fetch messages', err);
            setChatError('Failed to load messages.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSelectChat = async (chat) => {
        setSelectedChat(chat);
        setMessages([]);
        await fetchMessages(chat._id);
    };

    const handleGetOrCreateChat = useCallback(async (otherUserId = null) => {
        if (!user) {
            setChatError('You must be logged in to chat.');
            return;
        }
        setIsLoading(true);
        setChatError('');
        try {
            const res = await getOrCreateChat(otherUserId); 
            await fetchChats(); // Refetch to ensure the list is up-to-date
            
            setSelectedChat(res.data);
            await fetchMessages(res.data._id);
            setIsOpen(true);
        } catch (err) {
            console.error('Failed to fetch or create chat', err);
            setChatError(err.response?.data?.msg || 'Failed to open chat.');
        } finally {
            setIsLoading(false);
        }
    }, [user, fetchChats, fetchMessages]);


    // --- Socket Effects ---
    useEffect(() => {
        if (!selectedChat?._id) return;
        
        const chatId = selectedChat._id;
        socket.emit('joinChat', chatId);

        const handleReceiveMessage = (message) => {
            if (message.chat === chatId) {
                setMessages((prev) => [...prev, message]);
                
                // Update chat list for last message/sort order
                setChats(prevChats => {
                    const updatedChats = prevChats.map(chat => 
                        chat._id === chatId ? { ...chat, lastMessage: message.content, lastUpdated: message.createdAt } : chat
                    );
                    
                    // Re-sort, but keep Global Chat always at index 0 if present
                    const globalChat = updatedChats.find(isGlobalChat);
                    const privateChats = updatedChats
                        .filter(chat => !isGlobalChat(chat))
                        .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
                        
                    return globalChat ? [globalChat, ...privateChats] : privateChats;
                });
            }
        };
        
        socket.on('receiveMessage', handleReceiveMessage);

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
            socket.emit('leaveChat', chatId);
        };
    }, [selectedChat?._id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedChat]);

    useEffect(() => {
        if (isOpen && user) {
            fetchChats();
        }
    }, [isOpen, user, fetchChats, friendListUpdated]);

    useEffect(() => {
        if (openChatUserId) {
            handleGetOrCreateChat(openChatUserId);
            clearOpenChatUser();
        }
    }, [openChatUserId, clearOpenChatUser, handleGetOrCreateChat]);

    // --- Message Sending Logic ---
    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim() || !selectedChat || !user || isLoading) return;
        
        const content = newMessage.trim();
        setNewMessage('');
        setChatError('');

        try {
            const isGlobal = isGlobalChat(selectedChat);
            const otherParticipant = selectedChat.participants.find(p => p._id !== user.id);
            const receiverId = isGlobal ? null : otherParticipant?._id;

            await apiSendMessage({
                chatId: selectedChat._id,
                receiverId: receiverId, 
                content: content,
            });
            
            // Update the chat list summary immediately
            setChats(prevChats => {
                 const updatedChats = prevChats.map(chat => 
                    chat._id === selectedChat._id ? { ...chat, lastMessage: content, lastUpdated: new Date().toISOString() } : chat
                );
                
                const globalChat = updatedChats.find(isGlobalChat);
                const privateChats = updatedChats
                    .filter(chat => !isGlobalChat(chat))
                    .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
                    
                return globalChat ? [globalChat, ...privateChats] : privateChats;
            });


        } catch (err) {
            console.error('Failed to send message', err);
            setChatError(err.response?.data?.msg || 'Failed to send message.');
            setNewMessage(content);
        }
    };

    // --- Render Functions ---
    const renderChatContent = () => {
        if (!selectedChat) {
             return (
                <div style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2a2a2a', color: '#66c0f4', padding: 20 }}>
                    Select a chat from the list to start messaging.
                </div>
            );
        }
        
        const isPrivateChat = selectedChat.participants?.length > 0;
        const chatHeader = isPrivateChat 
            ? getChatPartner(selectedChat) 
            : '🌐 Global Chat';

        return (
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', backgroundColor: '#2a2a2a', color: '#fff', padding: 10 }}>
                {/* Chat Header */}
                <div style={{ padding: '8px 0', borderBottom: '1px solid #3a3f4b', marginBottom: 10, fontWeight: 'bold', color: '#66c0f4' }}>
                    {chatHeader}
                </div>

                {/* Messages Area (Omitted for brevity) */}
                <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8, display: 'flex', flexDirection: 'column' }}>
                    {isLoading && messages.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>Loading Messages...</div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg._id || msg.createdAt}
                                style={{
                                    margin: '6px 0',
                                    backgroundColor: msg.sender?._id === user?.id ? '#2a475e' : '#4b4b4b',
                                    padding: '8px 12px',
                                    borderRadius: 10,
                                    alignSelf: msg.sender?._id === user?.id ? 'flex-end' : 'flex-start',
                                    maxWidth: '85%',
                                    lineHeight: '1.4',
                                }}
                            >
                                <b style={{ color: '#c7d5e0' }}>
                                    {msg.sender?._id === user?.id ? (
                                        'You'
                                    ) : (
                                        <UserLink
                                            userId={msg.sender?._id}
                                            name={msg.sender?.name || 'Unknown'}
                                            sx={{ color: '#66c0f4', textDecoration: 'none' }}
                                        />
                                    )}
                                </b>
                                <span style={{ display: 'block', wordWrap: 'break-word' }}>{msg.content}</span>
                                <small style={{ fontSize: '10px', color: '#999', marginTop: '4px', display: 'block' }}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </small>
                            </div>
                        ))
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input Area (Omitted for brevity) */}
                <form onSubmit={handleSendMessage} style={{ display: 'flex', marginTop: 10 }}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={user ? "Type a message..." : "Log in to chat."}
                        disabled={!user || !selectedChat || isLoading}
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
                        type="submit"
                        disabled={!user || !selectedChat || isLoading || !newMessage.trim()}
                        style={{
                            padding: '10px 16px',
                            backgroundColor: (user && selectedChat && !isLoading && newMessage.trim()) ? '#66c0f4' : '#3a3f4b',
                            color: (user && selectedChat && !isLoading && newMessage.trim()) ? '#1b2838' : '#6c757d',
                            fontWeight: 'bold',
                            border: 'none',
                            borderRadius: 5,
                            cursor: (user && selectedChat && !isLoading && newMessage.trim()) ? 'pointer' : 'not-allowed',
                        }}
                    >
                        {isLoading ? 'Sending...' : 'Send'}
                    </button>
                </form>
                
                {chatError && (
                    <div style={{ color: 'red', marginTop: 5, textAlign: 'center' }}>{chatError}</div>
                )}
            </div>
        );
    };


    // --- Main Render ---
    if (!user) return null;
    return (
        <div className="chat-widget">
            {/* Floating Toggle Button (Omitted for brevity) */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="chat-widget-toggle"
            >
                💬
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div
                    className="chat-widget-window"
                >
                    {/* Chat List (Sidebar) */}
                    <div
                        style={{
                            flex: 1.2, borderRight: '1px solid #3a3f4b', padding: 10,
                            backgroundColor: '#1b2838', color: '#c7d5e0', overflowY: 'auto',
                        }}
                    >
                        {/* FIX: Map all chats now, but the fetching logic ensures Global Chat is first. */}
                        
                        {isLoading && !chats.length && <div style={{color: '#999'}}>Loading Chats...</div>}

                        {chats.map((chat) => {
                            const isCurrentGlobal = isGlobalChat(chat);

                            return (
                                <React.Fragment key={chat._id}>
                                    {/* FIX: Render the Global Chat entry here */}
                                    {isCurrentGlobal && (
                                        <div 
                                            style={{ 
                                                // Global Chat header style to match original
                                                color: '#66c0f4', 
                                                marginBottom: 10, 
                                                paddingTop: 0, 
                                                fontWeight: 'bold',
                                                // Make the whole block clickable
                                                cursor: 'pointer',
                                                backgroundColor: selectedChat?._id === chat._id ? '#2a475e' : 'transparent',
                                                padding: '8px',
                                                borderRadius: 5,
                                                borderBottom: '1px solid #3a3f4b',
                                            }}
                                            onClick={() => handleSelectChat(chat)}
                                        >
                                            <div style={{fontWeight: 'bold'}}>🌐 Global Chat</div>
                                            <small style={{color: '#999', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', display: 'block'}}>
                                                {chat.lastMessage || 'Start a global conversation.'}
                                            </small>
                                        </div>
                                    )}

                                    {/* FIX: Render the Private Chats header after Global Chat, but only once */}
                                    {isCurrentGlobal && <h4 style={{ color: '#66c0f4', marginBottom: 10, marginTop: 10 }}>Private Chats</h4>}
                                    
                                    {/* Render private chat items */}
                                    {!isCurrentGlobal && (() => {
                                        const partner = chat.participants.find(p => p._id !== user?.id);
                                        return (
                                            <div
                                                onClick={() => handleSelectChat(chat)}
                                                style={{
                                                    padding: '8px',
                                                    marginBottom: 6,
                                                    cursor: 'pointer',
                                                    borderRadius: 5,
                                                    backgroundColor: selectedChat?._id === chat._id ? '#2a475e' : 'transparent',
                                                    transition: '0.2s',
                                                    border: '1px solid transparent',
                                                    ':hover': { borderColor: '#66c0f4' }
                                                }}
                                            >
                                                <div style={{fontWeight: 'bold'}}>
                                                    <UserLink userId={partner?._id} name={partner?.name} />
                                                </div>
                                                <small style={{color: '#999', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', display: 'block'}}>
                                                    {chat.lastMessage || 'Start a conversation.'}
                                                </small>
                                            </div>
                                        );
                                    })()}
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* Messages Content */}
                    {renderChatContent()}

                </div>
            )}
        </div>
    );
};

export default ChatWidget;