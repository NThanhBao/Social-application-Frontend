import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

// Kết nối WebSocket
export const connectWebSocket = (userId, onMessageReceived, onConnect, onError) => {
    const socket = new SockJS('http://localhost:8083/ws');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, frame => {
        console.log('Connected: ' + frame);

        // Lắng nghe tin nhắn cho user
        stompClient.subscribe(`/topic/messages/${userId}`, message => {
            const newMessage = JSON.parse(message.body);
            onMessageReceived(newMessage);
        });

        // Gọi callback khi kết nối thành công
        if (onConnect) onConnect(stompClient);
    }, error => {
        console.error('Error connecting to WebSocket:', error);

        // Gọi callback khi có lỗi
        if (onError) onError();
    });

    return stompClient;
};

// Gửi tin nhắn
export const sendMessage = (stompClient, userId, recipientId, content) => {
    if (stompClient && stompClient.connected && recipientId) {
        const message = {
            sender: userId,
            recipient: recipientId,
            content: content,
            type: 'CHAT',
        };

        stompClient.send(`/app/chat/${recipientId}`, {}, JSON.stringify(message));
        return { ...message, lastName: 'You' };
    }
    console.warn('Cannot send message, stompClient is not connected or recipientId is not set', stompClient);
    return null;
};
