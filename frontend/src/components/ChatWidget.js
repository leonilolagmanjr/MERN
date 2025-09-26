import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import io from 'socket.io-client';
import {
    getChats,
    getMessages,
    sendMessage as apiSendMessage,
    getOrCreateChat, // This is now correctly imported from chatApi.js
} from '../services/chatApi';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FriendContext } from '../context/FriendContext';

// --- Socket Setup ---
const socket = io('http://localhost:5000', {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

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
        if (!chat.participants || chat.participants.length === 0) return '🌐 Global Chat'; // Global
        
        // Find the participant who is NOT the current user
        const partner = chat.participants.find(p => p._id !== user?.id);
        return partner?.name || 'Unknown User';
    };
    
    // --- Data Fetching Functions ---
    const fetchChats = useCallback(async () => {
        if (!user) return; // Prevent fetching if user is not logged in
        setIsLoading(true);
        setChatError('');
        try {
            const res = await getChats();
            // Ensure chats are sorted by lastUpdated for better UX
            const sortedChats = res.data.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
            setChats(sortedChats);
        } catch (err) {
            console.error('Failed to fetch chats', err);
            setChatError('Failed to load chats.');
        } finally {
            setIsLoading(false);
        }
    }, [user]); // Dependency: user

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
    }, []); // No external dependencies

    const handleSelectChat = async (chat) => {
        setSelectedChat(chat);
        setMessages([]); // Clear previous messages immediately for better perceived speed
        await fetchMessages(chat._id);
    };

    // FIX: Wrapped in useCallback to resolve ESLint missing dependency warning.
    const handleGetOrCreateChat = useCallback(async (otherUserId = null) => {
        if (!user) {
            setChatError('You must be logged in to chat.');
            return;
        }
        setIsLoading(true);
        setChatError('');
        try {
            // Use the service function that handles both cases
            const res = await getOrCreateChat(otherUserId); 
            
            // Update the chat list only if a new chat was created (optional, but good for real-time)
            const isNewChat = !chats.some(chat => chat._id === res.data._id);
            if (isNewChat && otherUserId) {
                // Refetch all chats to get the populated list
                await fetchChats();
            }
            
            setSelectedChat(res.data);
            await fetchMessages(res.data._id);
            setIsOpen(true); // Open the widget if not already open
        } catch (err) {
            console.error('Failed to fetch or create chat', err);
            setChatError(err.response?.data?.msg || 'Failed to open chat.');
        } finally {
            setIsLoading(false);
        }
    }, [user, chats, fetchChats, fetchMessages]); // Dependencies for useCallback


    // --- Socket Effects ---

    // Effect for setting up and cleaning up socket listeners
    useEffect(() => {
        if (!selectedChat?._id) return;
        
        const chatId = selectedChat._id;
        socket.emit('joinChat', chatId); // Join the room

        const handleReceiveMessage = (message) => {
            // Robust check: only update if the message belongs to the currently selected chat
            if (message.chat === chatId) {
                setMessages((prev) => [...prev, message]);
                // Also update the chat list's last message for the currently selected chat
                setChats(prevChats => prevChats.map(chat => 
                    chat._id === chatId ? { ...chat, lastMessage: message.content, lastUpdated: message.createdAt } : chat
                ).sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)));
            }
        };
        
        socket.on('receiveMessage', handleReceiveMessage);

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
            socket.emit('leaveChat', chatId); // Clean up: leave the room
        };
    }, [selectedChat?._id]);


    // Effect for scrolling to bottom
    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedChat]);


    // --- Primary Logic Effects ---

    // Effect to fetch chats when widget opens, user changes, or friend list updates (consolidated)
    useEffect(() => {
        if (isOpen && user) {
            fetchChats();
        }
    }, [isOpen, user, fetchChats, friendListUpdated]);

    // Effect to handle opening a chat from an external button (FriendContext)
    useEffect(() => {
        if (openChatUserId) {
            handleGetOrCreateChat(openChatUserId);
            clearOpenChatUser(); // Important: Clear the ID after processing
        }
    }, [openChatUserId, clearOpenChatUser, handleGetOrCreateChat]); // FIX: Added handleGetOrCreateChat

    // --- Message Sending Logic ---
    const handleSendMessage = async (e) => {
        e.preventDefault(); // Prevent form submission default if using a form

        if (!newMessage.trim() || !selectedChat || !user || isLoading) return;
        
        const content = newMessage.trim();
        setNewMessage(''); // Clear input immediately for better responsiveness
        setChatError('');

        try {
            // Determine the receiver ID for the API call (null for global chat)
            const isGlobal = selectedChat.participants.length === 0;
            const otherParticipant = selectedChat.participants.find(p => p._id !== user.id);
            const receiverId = isGlobal ? null : otherParticipant?._id;

            // 1. Send the message to the API (saves to DB and broadcasts via backend)
            // FIX: Removed the unused 'res =' declaration
            await apiSendMessage({
                chatId: selectedChat._id,
                receiverId: receiverId, 
                content: content,
            });
            
            // The backend's socket broadcast handles updating the 'messages' state.

            // We update the chat list summary immediately for better UX.
            setChats(prevChats => prevChats.map(chat => 
                chat._id === selectedChat._id ? { ...chat, lastMessage: content, lastUpdated: new Date().toISOString() } : chat
            ).sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)));


        } catch (err) {
            console.error('Failed to send message', err);
            setChatError(err.response?.data?.msg || 'Failed to send message.');
            setNewMessage(content); // Restore input value on failure
        }
    };

    // --- Render Functions ---

    const renderChatContent = () => {
        if (!selectedChat) {
            return (
                <div style={{ padding: 20, textAlign: 'center', color: '#66c0f4' }}>
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

                {/* Messages Area */}
                <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8, display: 'flex', flexDirection: 'column' }}>
                    {isLoading && messages.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>Loading Messages...</div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg._id || msg.createdAt} // Use _id if available, fallback to createdAt/temp ID
                                style={{
                                    margin: '6px 0',
                                    backgroundColor: msg.sender?._id === user?.id ? '#2a475e' : '#4b4b4b',
                                    padding: '8px 12px',
                                    borderRadius: 10,
                                    // Use flex properties for proper alignment
                                    alignSelf: msg.sender?._id === user?.id ? 'flex-end' : 'flex-start',
                                    maxWidth: '85%',
                                    lineHeight: '1.4',
                                }}
                            >
                                <b style={{ color: '#c7d5e0' }}>
                                    {msg.sender?._id === user?.id ? (
                                        'You'
                                    ) : (
                                        <Link
                                            to={`/profile/${msg.sender?._id}`}
                                            style={{ color: '#66c0f4', textDecoration: 'none' }}
                                        >
                                            {msg.sender?.name || 'Unknown'}
                                        </Link>
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

                {/* Input Area */}
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
                            backgroundColor: (user && selectedChat && !isLoading) ? '#66c0f4' : '#3a3f4b', // Dim when disabled
                            color: (user && selectedChat && !isLoading) ? '#1b2838' : '#6c757d',
                            fontWeight: 'bold',
                            border: 'none',
                            borderRadius: 5,
                            cursor: (user && selectedChat && !isLoading) ? 'pointer' : 'not-allowed',
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
                        width: '450px', 
                        height: '550px', 
                        backgroundColor: '#171a21',
                        border: '2px solid #3a3f4b',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'row',
                        boxShadow: '0 0 15px rgba(0,0,0,0.6)',
                        zIndex: 999,
                    }}
                >
                    {/* Chat List (Sidebar) */}
                    <div
                        style={{
                            flex: 1.2, 
                            borderRight: '1px solid #3a3f4b',
                            padding: 10,
                            backgroundColor: '#1b2838',
                            color: '#c7d5e0',
                            overflowY: 'auto',
                        }}
                    >
                        <button
                            onClick={() => handleGetOrCreateChat(null)} // Use the generic function for global chat
                            style={{
                                background: '#66c0f4',
                                color: '#1b2838',
                                padding: '6px 12px',
                                marginBottom: 10,
                                border: 'none',
                                borderRadius: 5,
                                fontWeight: 'bold',
                                width: '100%',
                                cursor: 'pointer',
                            }}
                        >
                            🌐 Global Chat
                        </button>
                        <h4 style={{ color: '#66c0f4', marginBottom: 10 }}>Private Chats</h4>
                        
                        {isLoading && !chats.length && <div style={{color: '#999'}}>Loading Chats...</div>}
                        
                        {chats.map((chat) => (
                            <div
                                key={chat._id}
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
                                <div style={{fontWeight: 'bold'}}>{getChatPartner(chat)}</div>
                                <small style={{color: '#999', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', display: 'block'}}>
                                    {chat.lastMessage || 'Start a conversation.'}
                                </small>
                            </div>
                        ))}
                    </div>

                    {/* Messages Content */}
                    {renderChatContent()}

                </div>
            )}
        </div>
    );
};

export default ChatWidget;