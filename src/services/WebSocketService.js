import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.socket = new SockJS('http://localhost:8083/ws');
        this.stompClient = Stomp.over(this.socket);
    }

    connect() {
        this.stompClient.connect({}, () => {
            console.log('Connected to WebSocket');
        });
    }

    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log('Disconnected from WebSocket');
    }

    sendMessage(message) {
        this.stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(message));
    }

    addUsername(username) {
        const message = { sender: username };
        this.stompClient.send('/app/chat.addUser', {}, JSON.stringify(message));
    }

    subscribe(callback) {
        this.stompClient.subscribe('/topic/public', (response) => {
            try {
                const body = response.body;
                const contentType = response.headers['content-type'];

                if (contentType === 'application/json') {
                    const message = JSON.parse(body);
                    callback(message);
                } else {
                    callback(body);
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        });
    }

    unsubscribe(callback) {
        callback && callback.unsubscribe();
    }

    subscribe(callback) {
        this.stompClient.subscribe('/topic/public', (response) => {
            const message = JSON.parse(response.body);
            const parsedMessage = {
                sender: message.sender,
                content: message.content
            };
            callback(parsedMessage);
        });
    }
}

export default new WebSocketService();
