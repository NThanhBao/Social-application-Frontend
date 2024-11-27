import React, { useState } from 'react';
import { avatarBaseUrl } from '../../../services/Constants';
import '../styles.css';

const ChatSidebar = ({ friends, newMessages, handleFriendSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            console.log(`Tìm kiếm cho: ${searchTerm}`);
        }
    };

    const filteredFriends = friends.filter(friend =>
        friend.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="chat-sidebar">
            <h3 className="sidebar-title">MESSCHAT</h3>
            <input 
                type="text" 
                placeholder="Tìm kiếm bạn bè..." 
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="search-input"
            />
            <ul className="chat-list">
                {filteredFriends.map(friend => (
                    <li 
                        key={friend.id} 
                        className="chat-item" 
                        onClick={() => handleFriendSelect(friend.id)}
                    >
                        <div className="chat-avatar">
                            <img 
                                src={`${avatarBaseUrl}${friend.avatar}`} 
                                alt={`${friend.firstName} ${friend.lastName}`} 
                                className="avatar" 
                            />
                        </div>
                        <div className="chat-info">
                            <span className="friend-name">{friend.firstName} {friend.lastName}</span>
                            {newMessages.filter(msg => msg.sender === friend.id).length > 0 && 
                                <span className="last-message">
                                    ({newMessages.filter(msg => msg.sender === friend.id).length} tin nhắn mới)
                                </span>
                            }
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatSidebar;
