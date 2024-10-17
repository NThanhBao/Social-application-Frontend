import React, { useEffect, useRef } from 'react';
import '../styles.css';

const ChatMessages = ({ messages, sendMessage, messageInput, setMessageInput, selectedUser, isConnected }) => {
    const userId = localStorage.getItem('userId'); // Lấy ID người dùng từ localStorage
    const messagesEndRef = useRef(null); // Ref để cuộn đến tin nhắn mới

    // Hàm cuộn đến cuối danh sách tin nhắn
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom(); // Cuộn xuống dưới mỗi khi messages thay đổi
    }, [messages]);

    return (
        <div className="chat-main">
            <div className="chat-header">
                <h2>{selectedUser || 'Select a friend to start chatting'}</h2>
                {!selectedUser && <p className="warning-message">Please select a friend to start chatting!</p>}
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === userId ? 'sent' : 'received'}`}>
                        <div className="message-bubble">
                            <p>{msg.content}</p>
                            <p className="message-time">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
                {/* Phần tử ẩn để cuộn đến */}
                <div ref={messagesEndRef} />
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
    );
};

export default ChatMessages;
