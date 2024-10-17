import React, { useEffect, useState, useRef } from 'react';
import WebSocketService from '../../services/WebSocketService';
import axios from 'axios';
import Sidebar from './ChatComponent/ChatSidebar';
import ChatMessages from './ChatComponent/ChatMessages';
import ChatInformation from './ChatComponent/ChatInformation';
import './styles.css';

const ChatComponent = ({ token }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [friends, setFriends] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
    const webSocketRef = useRef(null); // Thêm ref để lưu trữ kết nối WebSocket

    const toggleNotification = () => {
        setIsNotificationEnabled(prev => !prev);
    };

    // Kết nối WebSocket
    useEffect(() => {
        webSocketRef.current = WebSocketService;
        webSocketRef.current.connect(() => setIsConnected(true));

        // Ngắt kết nối WebSocket khi component bị huỷ
        return () => {
            webSocketRef.current.disconnect();
        };
    }, []);

    // Fetch danh sách bạn bè
    useEffect(() => {
        const fetchFriends = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                console.error('Access token not found');
                return;
            }
        
            try {
                const response = await axios.get('http://localhost:8083/ListFriends', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setFriends(response.data);
            } catch (error) {
                console.error('Error fetching friends list:', error);
            }
        };

        fetchFriends();
    }, [token]);

    // Fetch lịch sử tin nhắn
    const fetchChatHistory = async () => {
        if (!selectedUserId) return;
    
        const token = localStorage.getItem('accessToken'); // Đảm bảo token được lấy chính xác
        const userId = localStorage.getItem('userId');
    
        try {
            const response = await axios.get('http://localhost:8083/chat/history', {
                params: {
                    currentUser: userId,
                    recipient: selectedUserId,
                    page: 0,
                    pageSize: 50,
                },
                headers: { Authorization: `Bearer ${token}` }, // Đảm bảo token được gửi đúng
            });
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching chat history:', error.response ? error.response.data : error.message);
        }
    };


    useEffect(() => {
        fetchChatHistory();
    }, [selectedUserId, token]);

    // Gửi tin nhắn
    const sendMessage = async () => {
        if (!isConnected || !messageInput.trim() || !selectedUserId) return;
        const token = localStorage.getItem('accessToken');
        const userId = localStorage.getItem('userId');
        const message = {
            sender: userId || 'Anonymous',
            content: messageInput.trim(),
            recipient: selectedUserId,
            createdAt: new Date(),
        };
    
        // Cập nhật tin nhắn trên UI của người gửi ngay lập tức
        setMessages(prev => [...prev, message]);
    
        // Gửi tin nhắn qua WebSocket
        try {
            WebSocketService.sendPrivateMessage(selectedUserId, JSON.stringify(message));
            // Gửi tin nhắn lên server để lưu vào database
            await axios.post('http://localhost:8083/chat/privateMessage', message, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessageInput('');  // Xóa input sau khi gửi tin nhắn
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    

    // Quản lý subscription khi người dùng chọn một bạn bè
    useEffect(() => {
        if (isConnected && selectedUserId) {
            const handleMessage = message => {
                const newMessage = JSON.parse(message.body);
                console.log('Received message:', newMessage);
                // Cập nhật danh sách tin nhắn ngay khi nhận được tin nhắn mới
                setMessages(prev => [...prev, newMessage]);
            };
    
            WebSocketService.subscribeToPrivateMessage(selectedUserId, handleMessage);
    
            return () => WebSocketService.unsubscribeFromPrivateMessage(selectedUserId);
        }
    }, [isConnected, selectedUserId]);
    

    const selectedFriend = friends.find(friend => friend.id === selectedUserId);

    return (
        <div className="chat-container">
            <Sidebar 
                friends={friends} 
                selectedUserId={selectedUserId} 
                setSelectedUserId={setSelectedUserId} 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
            />
            <ChatMessages 
                messages={messages} 
                sendMessage={sendMessage} 
                messageInput={messageInput} 
                setMessageInput={setMessageInput} 
                selectedUser={selectedFriend ? `${selectedFriend.firstName} ${selectedFriend.lastName}` : ''} 
                isConnected={isConnected} 
            />
            <ChatInformation 
                selectedFriend={selectedFriend} 
                toggleNotification={toggleNotification} 
                isNotificationEnabled={isNotificationEnabled} 
            />
        </div>
    );
};

export default ChatComponent;
