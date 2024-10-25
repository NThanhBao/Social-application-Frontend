// ChatMessages.jsx phần hiển thị tin nhắn 

import React, { useRef, useEffect } from 'react';
import { avatarBaseUrl } from '../../../services/Constants';
import '../styles.css';

const ChatMessages = ({ messages, content, setContent, sendMessage, userId, selectedFriend }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom(); 
    }, [messages]);

    return (
        <div className="chat-main">
            <div className="chat-header">
                {selectedFriend ? ( 
                    <>
                        <img
                            src={`${avatarBaseUrl}${selectedFriend.avatar}`}
                            alt={`${selectedFriend.firstName} ${selectedFriend.lastName}`}
                            className="header-avatar"
                        />
                        <div className="header-info">
                            <h2>{selectedFriend.firstName} {selectedFriend.lastName}</h2>
                            <p className="status-text">Đang hoạt động</p> 
                        </div>
                    </>
                ) : (
                    <div className="no-friend-message">
                        <h2>Chọn một người bạn để trò chuyện</h2> 
                    </div>
                )}
            </div>
            <ul className="message-list">
                {messages.map((msg, index) => (
                    <li key={index} className={msg.sender === userId ? 'sent' : 'received'}>
                        <div className="message-bubble">
                            {/* <p className="message-sender">
                                {msg.sender === userId
                                    ? 'You'
                                    : selectedFriend ? `${selectedFriend.firstName} ${selectedFriend.lastName}` : 'Người gửi'}
                            </p> */}
                            <p>{msg.content}</p>
                            <p className="message-time">
                                {msg.createdAt ? new Date(msg.createdAt).toLocaleString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                }) : 'Unknown Time'}
                            </p>
                        </div>
                    </li>
                ))}
                <div ref={messagesEndRef} />
            </ul>


            {/* Đưa input tin nhắn nằm dưới cùng danh sách tin nhắn */}
            <div className="chat-input">
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type your message"
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatMessages;
