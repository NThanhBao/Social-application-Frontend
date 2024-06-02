import React, { useEffect, useState } from 'react';
import WebSocketService from '../../services/WebSocketService';
import axios from 'axios'; // Import axios for HTTP requests

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
            axios.post( message)
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
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <p>{msg.sender}: {msg.content}</p>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={sendMessage} disabled={!isConnected}>Send</button>
            <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Your username"
            />
        </div>
    );
};

export default ChatComponent;
