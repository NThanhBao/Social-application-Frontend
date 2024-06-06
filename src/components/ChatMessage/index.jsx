import React, { useEffect, useState } from 'react';
import WebSocketService from '../../services/WebSocketService';
import axios from 'axios'; // Import axios for HTTP requests
import './styles.css'; // Import CSS file for styling

const ChatComponent = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        const connectToWebSocket = async () => {
            WebSocketService.connect();

            WebSocketService.stompClient.onConnect = () => {
                console.log('Connected to WebSocket');
                setIsConnected(true);
            };

            WebSocketService.stompClient.onDisconnect = () => {
                console.log('Disconnected from WebSocket');
                setIsConnected(false);
            };
        };

        connectToWebSocket();

        return () => {
            WebSocketService.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (isConnected && messageInput.trim() !== '') {
            const message = {
                sender: username,
                content: messageInput.trim()
            };
            WebSocketService.sendMessage(message); // Send message via WebSocket

            // Save message to database via HTTP POST request
            axios.post('http://your-api-url/messages', message)
                .then(response => {
                    console.log('Message saved to database:', response.data);
                })
                .catch(error => {
                    console.error('Error saving message to database:', error);
                });

            setMessageInput('');
        }
    };

    useEffect(() => {
        if (isConnected) {
            const callback = (message) => {
                setMessages(prevMessages => [...prevMessages, message]);
            };

            WebSocketService.subscribe(callback);

            return () => {
                WebSocketService.unsubscribe(callback);
            };
        }
    }, [isConnected]);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Messages Chat</h2>
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === username ? 'sent' : 'received'}`}>
                        <div className="message-info">
                            {msg.sender === username ? 'You' : msg.sender}
                        </div>
                        <div className="message-content">
                            <p>{msg.content}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                />
                <button onClick={sendMessage} disabled={!isConnected}>Gửi</button>
            </div>
            <div className="chat-username">
                <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="Tên của bạn"
                />
            </div>
        </div>
    );
};

export default ChatComponent;
