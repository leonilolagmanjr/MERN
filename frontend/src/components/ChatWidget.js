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

// Ring sound for incoming calls
const ringSound = new Audio('/ring.mp3'); // Add ring.mp3 to public folder

// --- Socket Setup ---
const socket = io(process.env.REACT_APP_SOCKET_URL, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

// FIX: Helper function to reliably determine if a chat object is the Global Chat
const isGlobalChat = (chat) => chat.participants && chat.participants.length === 0;

// VideoCallPopup Component
const VideoCallPopup = ({
    localVideoRef,
    remoteVideoRef,
    onHangUp,
    position,
    size,
    onDragStart,
    onResizeStart
}) => {
    // Calculate aspect ratio for the videos
    const videoAspectRatio = 16 / 9;
    
    // Calculate the best fit for the remote video to maintain aspect ratio
    const calculateRemoteVideoStyle = () => {
        const containerAspectRatio = size.width / size.height;
        
        if (containerAspectRatio > videoAspectRatio) {
            // Container is wider than video - fit to height
            return {
                width: `${size.height * videoAspectRatio}px`,
                height: '100%',
                margin: '0 auto'
            };
        } else {
            // Container is taller than video - fit to width
            return {
                width: '100%',
                height: `${size.width / videoAspectRatio}px`,
                margin: 'auto 0'
            };
        }
    };

    // Dynamic local video positioning and sizing
    const localVideoSize = Math.min(size.width * 0.25, 120); // Max 25% of container width or 120px
    const localVideoAspectRatio = 4 / 3; // Common webcam aspect ratio
    
    const localVideoStyle = {
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        width: `${localVideoSize}px`,
        height: `${localVideoSize / localVideoAspectRatio}px`,
        border: '2px solid white',
        borderRadius: '10px',
        objectFit: 'contain', // Changed from 'cover' to 'contain'
        backgroundColor: '#000', // Add background for letterboxing
        zIndex: 10000,
    };

    const remoteVideoStyle = calculateRemoteVideoStyle();

    return (
        <div
            style={{
                position: 'absolute',
                top: position.y,
                left: position.x,
                width: size.width,
                height: size.height,
                backgroundColor: '#000',
                borderRadius: '10px',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                zIndex: 9999,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Draggable Header */}
            <div
                onMouseDown={onDragStart}
                style={{
                    height: '20px',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    cursor: 'grab',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: 'white',
                }}
            >
                Drag to move
            </div>

            {/* Videos Container */}
            <div 
                style={{ 
                    position: 'relative', 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: '#000'
                }}
            >
                {/* Remote Video - Centered with aspect ratio maintained */}
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    style={{
                        ...remoteVideoStyle,
                        objectFit: 'contain', // Changed from 'cover' to 'contain'
                        backgroundColor: '#000', // Add background for letterboxing
                    }}
                />
                
                {/* Local Video - Dynamic Overlay */}
                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    style={localVideoStyle}
                />
                
                {/* Hang Up Button - Always Visible Overlay */}
                <button
                    onClick={onHangUp}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        zIndex: 10001,
                    }}
                >
                    End
                </button>
            </div>

            {/* Resize Handle */}
            <div
                onMouseDown={onResizeStart}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '20px',
                    height: '20px',
                    cursor: 'nw-resize',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                }}
            />
        </div>
    );
};

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

    // Video Call State
    const [callState, setCallState] = useState('idle'); // 'idle' | 'calling' | 'ringing' | 'in-call'
    const [incomingCall, setIncomingCall] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const [iceCandidatesBuffer, setIceCandidatesBuffer] = useState([]);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    // Popup Position and Size State
    const [popupPosition, setPopupPosition] = useState({ x: window.innerWidth - 420, y: window.innerHeight - 320 });
    const [popupSize, setPopupSize] = useState({ width: 400, height: 300 });

    // Drag and Resize Handlers
    const handleDragStart = useCallback((e) => {
        e.preventDefault();
        const startX = e.clientX - popupPosition.x;
        const startY = e.clientY - popupPosition.y;

        const handleMouseMove = (e) => {
            let newX = e.clientX - startX;
            let newY = e.clientY - startY;

            // Constrain to viewport
            newX = Math.max(0, Math.min(newX, window.innerWidth - popupSize.width));
            newY = Math.max(0, Math.min(newY, window.innerHeight - popupSize.height));

            setPopupPosition({ x: newX, y: newY });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [popupPosition, popupSize]);

    const handleResizeStart = useCallback((e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = popupSize.width;
        const startHeight = popupSize.height;
        const aspectRatio = 16 / 9; // Maintain 16:9 aspect ratio

        const handleMouseMove = (e) => {
            let deltaX = e.clientX - startX;
            let deltaY = e.clientY - startY;

            let newWidth = startWidth + deltaX;
            let newHeight = startHeight + deltaY;

            // Maintain aspect ratio by adjusting based on the larger change
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Width change is dominant, adjust height
                newHeight = newWidth / aspectRatio;
            } else {
                // Height change is dominant, adjust width
                newWidth = newHeight * aspectRatio;
            }

            // Minimum size constraints (based on aspect ratio)
            const minWidth = 320;
            const minHeight = minWidth / aspectRatio;
            newWidth = Math.max(minWidth, newWidth);
            newHeight = Math.max(minHeight, newHeight);

            // Constrain so popup doesn't go outside viewport
            if (popupPosition.x + newWidth > window.innerWidth) {
                newWidth = window.innerWidth - popupPosition.x;
                newHeight = newWidth / aspectRatio;
            }
            if (popupPosition.y + newHeight > window.innerHeight) {
                newHeight = window.innerHeight - popupPosition.y;
                newWidth = newHeight * aspectRatio;
            }

            setPopupSize({ width: newWidth, height: newHeight });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [popupSize, popupPosition]);
    
    const bottomRef = useRef(null);
    const refreshIntervalRef = useRef(null);

    // --- Auto-Refresh Functionality ---
    const refreshMessages = useCallback(async () => {
        if (!selectedChat?._id || !user) return;

        try {
            const res = await getMessages(selectedChat._id);
            setMessages(res.data);
        } catch (err) {
            console.error('Failed to refresh messages', err);
            // Don't show error for auto-refresh to avoid spam
        }
    }, [selectedChat?._id, user]);

    const refreshChatList = useCallback(async () => {
        if (!user) return;
        
        try {
            const res = await getChats();
            const globalChat = res.data.find(isGlobalChat);
            const privateChats = res.data
                .filter(chat => !isGlobalChat(chat))
                .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

            setChats(globalChat ? [globalChat, ...privateChats] : privateChats);
        } catch (err) {
            console.error('Failed to refresh chat list', err);
        }
    }, [user]);

    // Setup auto-refresh interval
    useEffect(() => {
        if (isOpen) {
            // Refresh every second (1000ms)
            refreshIntervalRef.current = setInterval(() => {
                if (selectedChat) {
                    refreshMessages();
                }
                refreshChatList();
            }, 2000);
        }

        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
                refreshIntervalRef.current = null;
            }
        };
    }, [isOpen, selectedChat, refreshMessages, refreshChatList]);

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

        const handleIncomingCall = ({ offer, callerId }) => {
            if (callState === 'idle') {
                setCallState('ringing');
                setIncomingCall({ offer, callerId });
                ringSound.loop = true;
                ringSound.play().catch(err => console.error('Ring sound error:', err));
                if (navigator.vibrate) navigator.vibrate(1000);
            } else {
                // If already in call, send busy signal
                socket.emit("call-busy", { targetId: callerId });
            }
        };

        const handleCallAccepted = () => {
            setCallState('in-call');
            ringSound.pause();
            ringSound.currentTime = 0;
        };

        const handleCallRejected = ({ reason } = {}) => {
            setCallState('idle');
            setIncomingCall(null);
            ringSound.pause();
            ringSound.currentTime = 0;
            if (reason === 'busy') {
                alert("User is busy or declined.");
            } else {
                alert("Call declined.");
            }
        };

        const handleCallEnded = () => {
            setCallState('idle');
            setIncomingCall(null);
            if (peerConnection) {
                peerConnection.close();
                setPeerConnection(null);
            }
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
                setLocalStream(null);
            }
            setRemoteStream(null);
            // Clear video elements to prevent stale streams on subsequent calls
            if (localVideoRef.current) localVideoRef.current.srcObject = null;
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
            ringSound.pause();
            ringSound.currentTime = 0;
        };

        const handleAnswer = async (answer) => {
            if (peerConnection) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
                // Process buffered ICE candidates
                setIceCandidatesBuffer(prev => {
                    prev.forEach(cand => {
                        if (peerConnection.remoteDescription) {
                            peerConnection.addIceCandidate(new RTCIceCandidate(cand)).catch(err => console.error('Error adding buffered ICE candidate:', err));
                        }
                    });
                    return [];
                });
            }
        };

        const handleIceCandidate = (candidate) => {
            if (peerConnection) {
                if (peerConnection.remoteDescription) {
                    peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch(err => console.error('Error adding ICE candidate:', err));
                } else {
                    // Buffer the candidate until remote description is set
                    setIceCandidatesBuffer(prev => [...prev, candidate]);
                }
            }
        };

        socket.on('receiveMessage', handleReceiveMessage);
        socket.on('incoming-call', handleIncomingCall);
        socket.on('call-accepted', handleCallAccepted);
        socket.on('call-rejected', handleCallRejected);
        socket.on('call-ended', handleCallEnded);
        socket.on('answer', handleAnswer);
        socket.on('ice-candidate', handleIceCandidate);

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
            socket.off('incoming-call', handleIncomingCall);
            socket.off('call-accepted', handleCallAccepted);
            socket.off('call-rejected', handleCallRejected);
            socket.off('call-ended', handleCallEnded);
            socket.off('answer', handleAnswer);
            socket.off('ice-candidate', handleIceCandidate);
            socket.emit('leaveChat', chatId);
        };
    }, [selectedChat?._id, peerConnection]);

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

    // Ensure local video srcObject is set when stream is available and call is in progress
    useEffect(() => {
        if (callState === 'in-call' && localStream && localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [callState, localStream]);

    // Ensure remote video srcObject is set when stream is available and call is in progress
    useEffect(() => {
        if (callState === 'in-call' && remoteStream && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [callState, remoteStream]);

    // --- Video Call Logic ---
    const startCall = async () => {
        if (!selectedChat || isGlobalChat(selectedChat)) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;

            const pc = new RTCPeerConnection();
            setPeerConnection(pc);

            stream.getTracks().forEach(track => pc.addTrack(track, stream));

            pc.ontrack = event => {
                setRemoteStream(event.streams[0]);
                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
            };

            pc.onicecandidate = event => {
                if (event.candidate) {
                    socket.emit('ice-candidate', { chatId: selectedChat._id, candidate: event.candidate });
                }
            };

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit('call-user', { chatId: selectedChat._id, offer });
            setCallState('calling');
        } catch (err) {
            console.error('Error starting call:', err);
            setChatError('Failed to start call. Check camera/microphone permissions.');
        }
    };

    const acceptCall = async () => {
        if (!incomingCall) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;

            const pc = new RTCPeerConnection();
            setPeerConnection(pc);

            stream.getTracks().forEach(track => pc.addTrack(track, stream));

            pc.ontrack = event => {
                setRemoteStream(event.streams[0]);
                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
            };

            pc.onicecandidate = event => {
                if (event.candidate) {
                    socket.emit('ice-candidate', { chatId: selectedChat._id, candidate: event.candidate });
                }
            };

            await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit('answer', { chatId: selectedChat._id, answer });
            socket.emit('accept-call', { chatId: selectedChat._id });
            ringSound.pause();
            ringSound.currentTime = 0;
            setIncomingCall(null);
            setCallState('in-call');
        } catch (err) {
            console.error('Error accepting call:', err);
            setChatError('Failed to accept call.');
        }
    };

    const rejectCall = () => {
        socket.emit('reject-call', { chatId: selectedChat._id });
        setIncomingCall(null);
        setCallState('idle');
        ringSound.pause();
        ringSound.currentTime = 0;
    };

    const hangUp = () => {
        socket.emit('call-ended', { chatId: selectedChat._id });
        if (peerConnection) {
            peerConnection.close();
            setPeerConnection(null);
        }
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
        setRemoteStream(null);
        setCallState('idle');
        setIncomingCall(null);
        ringSound.pause();
        ringSound.currentTime = 0;
    };

    const cancelCall = () => {
        socket.emit('call-ended', { chatId: selectedChat._id });
        if (peerConnection) {
            peerConnection.close();
            setPeerConnection(null);
        }
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
        setRemoteStream(null);
        setCallState('idle');
        setIncomingCall(null);
        ringSound.pause();
        ringSound.currentTime = 0;
    };

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
                <div style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)', color: 'var(--color-primary)', padding: 20 }}>
                    Select a chat from the list to start messaging.
                </div>
            );
        }
        
        const isPrivateChat = selectedChat.participants?.length > 0;
        const chatHeader = isPrivateChat 
            ? getChatPartner(selectedChat) 
            : '🌐 Global Chat';

        return (
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', padding: 10 }}>
                {/* Chat Header */}
                <div style={{
                    padding: '8px 0',
                    borderBottom: '1px solid var(--color-accent)',
                    marginBottom: 10,
                    fontWeight: 'bold',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>{chatHeader}</span>
                    {isPrivateChat && callState === 'idle' && (
                        <button
                            onClick={startCall}
                            style={{
                                padding: '5px 10px',
                                backgroundColor: 'var(--color-primary)',
                                color: 'var(--color-bg)',
                                border: 'none',
                                borderRadius: 5,
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            📞 Call
                        </button>
                    )}
                    {callState === 'calling' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Calling...</span>
                            <button
                                onClick={cancelCall}
                                style={{
                                    padding: '3px 8px',
                                    backgroundColor: 'red',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 3,
                                    cursor: 'pointer',
                                    fontSize: '10px'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                    {callState === 'ringing' && (
                        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Ringing...</span>
                    )}
                    {callState === 'in-call' && (
                        <button
                            onClick={hangUp}
                            style={{
                                padding: '5px 10px',
                                backgroundColor: 'red',
                                color: 'white',
                                border: 'none',
                                borderRadius: 5,
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            Hang Up
                        </button>
                    )}
                </div>

                {/* Incoming Call Notification */}
                {incomingCall && (
                    <div style={{
                        padding: '10px',
                        backgroundColor: 'var(--color-accent)',
                        color: 'var(--color-bg)',
                        borderRadius: 5,
                        marginBottom: 10,
                        textAlign: 'center'
                    }}>
                        <div>Incoming call from {getChatPartner(selectedChat)}</div>
                        <div style={{ marginTop: 10 }}>
                            <button
                                onClick={acceptCall}
                                style={{
                                    padding: '5px 15px',
                                    backgroundColor: 'green',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 5,
                                    cursor: 'pointer',
                                    marginRight: 10
                                }}
                            >
                                Accept
                            </button>
                            <button
                                onClick={rejectCall}
                                style={{
                                    padding: '5px 15px',
                                    backgroundColor: 'red',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 5,
                                    cursor: 'pointer'
                                }}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                )}



                {/* Messages Area */}
                <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8, display: 'flex', flexDirection: 'column' }}>
                    {isLoading && messages.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>Loading Messages...</div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg._id || msg.createdAt}
                                style={{
                                    margin: '6px 0',
                                    backgroundColor: msg.sender?._id === user?.id ? 'var(--color-card-bg)' : 'var(--color-button-bg)',
                                    padding: '8px 12px',
                                    borderRadius: 10,
                                    alignSelf: msg.sender?._id === user?.id ? 'flex-end' : 'flex-start',
                                    maxWidth: '85%',
                                    lineHeight: '1.4',
                                }}
                            >
                                <b style={{ color: 'var(--color-text-secondary)' }}>
                                    {msg.sender?._id === user?.id ? (
                                        'You'
                                    ) : (
                                        <UserLink
                                            userId={msg.sender?._id}
                                            name={msg.sender?.name || 'Unknown'}
                                            sx={{ color: 'var(--color-primary)', textDecoration: 'none' }}
                                        />
                                    )}
                                </b>
                                <span style={{ display: 'block', wordWrap: 'break-word' }}>{msg.content}</span>
                                <small style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '4px', display: 'block' }}>
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
                            backgroundColor: 'var(--color-card-bg)',
                            border: '1px solid var(--color-accent)',
                            borderRadius: 5,
                            color: 'var(--color-text)',
                            marginRight: 5,
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!user || !selectedChat || isLoading || !newMessage.trim()}
                        style={{
                            padding: '10px 16px',
                            backgroundColor: (user && selectedChat && !isLoading && newMessage.trim()) ? 'var(--color-primary)' : 'var(--color-button-bg)',
                            color: (user && selectedChat && !isLoading && newMessage.trim()) ? 'var(--color-bg)' : 'var(--color-text-secondary)',
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
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="chat-widget-toggle"
            >
                💬
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-widget-window">
                    {/* Chat List (Sidebar) */}
                    <div
                        style={{
                            flex: 1.2, borderRight: '1px solid var(--color-accent)', padding: 10,
                            backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text)', overflowY: 'auto',
                        }}
                    >
                        {isLoading && !chats.length && <div style={{color: 'var(--color-text-secondary)'}}>Loading Chats...</div>}

                        {chats.map((chat) => {
                            const isCurrentGlobal = isGlobalChat(chat);

                            return (
                                <React.Fragment key={chat._id}>
                                    {/* Global Chat entry */}
                                    {isCurrentGlobal && (
                                        <div
                                            style={{
                                                color: 'var(--color-primary)',
                                                marginBottom: 10,
                                                paddingTop: 0,
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                backgroundColor: selectedChat?._id === chat._id ? 'var(--color-accent)' : 'transparent',
                                                padding: '8px',
                                                borderRadius: 5,
                                                borderBottom: '1px solid var(--color-accent)',
                                            }}
                                            onClick={() => handleSelectChat(chat)}
                                        >
                                            <div style={{fontWeight: 'bold'}}>🌐 Global Chat</div>
                                            <small style={{color: 'var(--color-text-secondary)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', display: 'block'}}>
                                            </small>
                                        </div>
                                    )}

                                    {/* Private Chats header */}
                                    {isCurrentGlobal && <h4 style={{ color: 'var(--color-primary)', marginBottom: 10, marginTop: 10 }}>Private Chats</h4>}

                                    {/* Private chat items */}
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
                                                    backgroundColor: selectedChat?._id === chat._id ? 'var(--color-accent)' : 'transparent',
                                                    transition: '0.2s',
                                                    border: '1px solid transparent',
                                                }}
                                            >
                                                <div style={{fontWeight: 'bold'}}>
                                                    <UserLink userId={partner?._id} name={partner?.name} />
                                                </div>
                                                <small style={{color: 'var(--color-text-secondary)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', display: 'block'}}>
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

            {/* Video Call Popup */}
            {callState === 'in-call' && (
                <VideoCallPopup
                    localVideoRef={localVideoRef}
                    remoteVideoRef={remoteVideoRef}
                    onHangUp={hangUp}
                    position={popupPosition}
                    size={popupSize}
                    onDragStart={handleDragStart}
                    onResizeStart={handleResizeStart}
                />
            )}
        </div>
    );
};

export default ChatWidget;