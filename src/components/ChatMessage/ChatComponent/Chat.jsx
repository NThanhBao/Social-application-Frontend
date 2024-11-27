import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import ChatSidebar from './ChatSidebar';
import ChatMessages from './ChatMessages';
import ChatInformation from './ChatInformation';
import { connectWebSocket, sendMessage } from '../../../services/WebSocketService';  
import '../styles.css'; 

const ChatComponent = () => {
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState([]);
    const [content, setContent] = useState('');
    const [recipientId, setRecipientId] = useState('');
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const handleMessageReceived = (newMessage) => {
            if (newMessage.recipient === userId || newMessage.sender === userId) {
                if (recipientId === newMessage.sender) {
                    setMessages(prevMessages => [...prevMessages, newMessage]);
                } else {
                    setNewMessages(prevMessages => [...prevMessages, newMessage]);
                }
            }
        };
    
        const handleError = () => {
            setTimeout(() => {
                connectWebSocket(userId, handleMessageReceived, setStompClient, handleError);
            }, 5000);
        };
    
        const stompClient = connectWebSocket(userId, handleMessageReceived, setStompClient, handleError);
    
        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect(() => {
                    console.log('WebSocket disconnected');
                });
            }
        };  
    }, [recipientId, userId]);
    
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get('http://localhost:8083/ListFriends', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setFriends(response.data);
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };
        fetchFriends();
    }, []);

    const handleSendMessage = () => {
        const newMessage = sendMessage(stompClient, userId, recipientId, content);
        if (newMessage) {
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setContent('');
        }
    };

    const fetchMessages = useCallback(async (recipientId) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`http://localhost:8083/messages`, {
                params: {
                    senderId: userId,
                    recipientId: recipientId,
                    page: 0,
                    pageSize: 100
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessages(response.data.filter(msg => msg.recipient === recipientId || msg.sender === recipientId)); 
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }, [userId]);

    useEffect(() => {
        if (recipientId) {
            fetchMessages(recipientId);
            const friend = friends.find(f => f.id === recipientId);
            setSelectedFriend(friend); // Cập nhật thông tin bạn bè được chọn
        }
    }, [recipientId, fetchMessages, friends]);

    const handleFriendSelect = (friendId) => {
        setRecipientId(friendId);
        setNewMessages(prevMessages => prevMessages.filter(msg => msg.recipient === friendId || msg.sender === friendId));
    };

    return (
        <div className="chat-container">
            <div className="chat-sidebar">
                <ChatSidebar 
                    friends={friends} 
                    newMessages={newMessages} 
                    handleFriendSelect={handleFriendSelect} 
                />
            </div>
            <div className="chat-main">
                <ChatMessages 
                    messages={messages} 
                    content={content} 
                    setContent={setContent} 
                    sendMessage={handleSendMessage} 
                    userId={userId}
                    selectedFriend={selectedFriend}
                />
            </div>
            {/* Chỉ hiển thị ChatInformation nếu có người bạn được chọn */}
            {selectedFriend && (
                <div className="chat-information">
                    <ChatInformation 
                        selectedFriend={selectedFriend}
                    />
                </div>
            )}
        </div>
    );    
};

export default ChatComponent;
