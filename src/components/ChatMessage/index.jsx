import React, { useEffect, useState } from 'react';
import WebSocketService from '../../services/WebSocketService';
import axios from 'axios';
import { avatarBaseUrl } from '../../services/Constants';
import './styles.css';

const ChatComponent = ({ token }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [friends, setFriends] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);

    // Hàm toggle notification
    const toggleNotification = () => {
        setIsNotificationEnabled(prev => !prev);
    };

    // Kết nối WebSocket
    useEffect(() => {
        WebSocketService.connect(() => setIsConnected(true));
        WebSocketService.stompClient.onDisconnect = () => setIsConnected(false);

        return () => WebSocketService.disconnect();
    }, []);

    // Fetch friends list
    useEffect(() => {
        const fetchFriends = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) return console.error('Access token not found');

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

    // Filter friends list
    const filteredFriends = friends.filter(friend =>
        `${friend.firstName} ${friend.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Gửi tin nhắn
    const sendMessage = async () => {
        if (!isConnected || !messageInput.trim() || !selectedUser) return;

        const message = {
            sender: 'Anonymous',
            content: messageInput.trim(),
            recipient: selectedUser,
        };

        WebSocketService.sendPrivateMessage(selectedUser, JSON.stringify(message));

        try {
            await axios.post('http://localhost:8083/messages', message, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(prev => [...prev, message]);
            setMessageInput('');
        } catch (error) {
            console.error('Error saving message to database:', error);
        }
    };

    // Subscribe to private messages
    useEffect(() => {
        if (isConnected && selectedUser) {
            const handleMessage = message => {
                setMessages(prev => [...prev, JSON.parse(message.body)]);
            };

            WebSocketService.subscribeToPrivateMessage(selectedUser, handleMessage);

            return () => WebSocketService.unsubscribeFromPrivateMessage(selectedUser);
        }
    }, [isConnected, selectedUser]);

    // Chọn bạn bè để chat
    const handleUserSelect = user => {
        setSelectedUser(user);
        setMessages([]);
    };

    const selectedFriend = friends.find(friend => `${friend.firstName} ${friend.lastName}` === selectedUser);

    return (
        <div className="chat-container">
            <div className="chat-sidebar">
                <h2>Friends List</h2>
                <input
                    type="text"
                    placeholder="Search friends"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="search-input"
                />
                <ul className="chat-list">
                    {filteredFriends.length > 0 ? (
                        filteredFriends.map((friend, index) => (
                            <li
                                key={friend.id || index}
                                className={friend.firstName + ' ' + friend.lastName === selectedUser ? 'active' : ''}
                                onClick={() => handleUserSelect(`${friend.firstName} ${friend.lastName}`)}
                            >
                                <div className="chat-item">
                                    <img
                                        src={`${avatarBaseUrl}${friend.avatar}`}
                                        alt={`${friend.firstName} ${friend.lastName}'s Avatar`}
                                        className="chat-avatar"
                                    />
                                    <div className="chat-info">
                                        <span>{friend.firstName} {friend.lastName}</span>
                                        <span className="last-message">Last message preview</span>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="no-friends text-center">No friends found</li>
                    )}
                </ul>
            </div>

            <div className="chat-main">
                <div className="chat-header">
                    <h2>{selectedUser || 'Select a friend to start chatting'}</h2>
                    {!selectedUser && <p className="warning-message">Please select a friend to start chatting!</p>}
                </div>
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender === 'Anonymous' ? 'sent' : 'received'}`}>
                            <div className="message-bubble">
                                <p>{msg.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="chat-input">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={e => setMessageInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        placeholder={selectedUser ? "Enter your message..." : "Please select a recipient to start chatting"}
                        disabled={!selectedUser}
                    />
                    <button onClick={sendMessage} disabled={!isConnected || !selectedUser}>Send</button>
                </div>
            </div>

            {selectedFriend && (
                <div className="user-info">
                    <img
                        src={`${avatarBaseUrl}${selectedFriend.avatar}`}
                        alt={`${selectedFriend.firstName} ${selectedFriend.lastName}'s Avatar`}
                        className="user-avatar"
                    />
                    <h3>{`${selectedFriend.firstName} ${selectedFriend.lastName}`}</h3>
                    <p>{selectedFriend.username}</p>

                    <div className='icons'>
                        {/* Notification Icon */}
                        <div className="icon" onClick={toggleNotification}>
                            {isNotificationEnabled ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                    <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7l-90.2-70.7c.2-.4 .4-.9 .6-1.3c5.2-11.5 3.1-25-5.3-34.4l-7.4-8.3C497.3 319.2 480 273.9 480 226.8l0-18.8c0-77.4-55-142-128-156.8L352 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 19.2c-42.6 8.6-79 34.2-102 69.3L38.8 5.1zM288 464h64c0 17-6.7 33.3-18.7 45.3s-28.3 18.7-45.3 18.7s-33.3-6.7-45.3-18.7S224 481 224 464h64z" />
                                </svg>
                            )}
                        </div>
                        {/* Search Icon */}
                        <div className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                            </svg>
                        </div>
                        {/* Menu Icon */}
                        <div className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
                            </svg>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatComponent;
