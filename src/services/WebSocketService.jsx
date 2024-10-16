import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

const WebSocketService = {
    stompClient: null,
    subscriptions: {},
    isConnected: false,

    connect(callback) {
        const socket = new SockJS('http://localhost:8083/ws');
        this.stompClient = Stomp.over(socket);

        this.stompClient.connect({}, (frame) => {
            console.log('Connected: ' + frame);
            this.isConnected = true;
            if (callback) callback(); // Call the callback if provided
        }, (error) => {
            console.error('Connection error: ' + error);
        });
    },

    disconnect() {
        if (this.stompClient && this.isConnected) {
            Object.values(this.subscriptions).forEach(subscription => {
                this.stompClient.unsubscribe(subscription.id);
            });
            this.stompClient.disconnect(() => {
                console.log("Disconnected");
                this.isConnected = false;
                this.subscriptions = {};
            });
        }
    },

    sendMessage(message) {
        if (this.isConnected && message.room) {
            this.stompClient.send(`/app/chat.sendMessage`, {}, message); // Send JSON directly
        } else {
            console.log('Cannot send message:', { isConnected: this.isConnected, message });
        }
    },

    sendPrivateMessage(recipient, message) {
        if (this.isConnected && recipient) {
            this.stompClient.send(`/app/chat.privateMessage.${recipient}`, {}, message); // Send JSON directly
        } else {
            console.log('Cannot send private message:', { isConnected: this.isConnected, recipient });
        }
    },

    subscribeToRoom(room, callback) {
        if (this.isConnected && room) {
            const subscription = this.stompClient.subscribe(`/topic/${room}`, callback);
            this.subscriptions[room] = subscription;
            console.log(`Subscribed to room: ${room}`);
        } else {
            console.log(`Cannot subscribe to room: ${room}, isConnected: ${this.isConnected}`);
        }
    },

    subscribeToPrivateMessage(recipient, callback) {
        if (this.isConnected && recipient) {
            const subscription = this.stompClient.subscribe(`/user/${recipient}/private`, callback);
            this.subscriptions[recipient] = subscription;
            console.log(`Subscribed to private messages for user: ${recipient}`);
        } else {
            console.log(`Cannot subscribe to private messages for user: ${recipient}, isConnected: ${this.isConnected}`);
        }
    },

    unsubscribeFromRoom(room) {
        if (this.isConnected && this.subscriptions[room]) {
            this.stompClient.unsubscribe(this.subscriptions[room].id);
            delete this.subscriptions[room];
            console.log(`Unsubscribed from room: ${room}`);
        }
    },

    unsubscribeFromPrivateMessage(recipient) {
        if (this.isConnected && this.subscriptions[recipient]) {
            this.stompClient.unsubscribe(this.subscriptions[recipient].id);
            delete this.subscriptions[recipient];
            console.log(`Unsubscribed from private messages for user: ${recipient}`);
        }
    }
};

export default WebSocketService;
