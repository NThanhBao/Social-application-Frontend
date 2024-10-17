import React from 'react';
import { avatarBaseUrl } from '../../../services/Constants';

const ChatSidebar = ({ friends, selectedUserId, setSelectedUserId, searchQuery, setSearchQuery }) => {
    const filteredFriends = friends.filter(friend =>
        `${friend.firstName} ${friend.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="chat-sidebar">
            <h2>MESSCHAT</h2>
            <input
                type="text"
                placeholder="Search friends"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-input"
            />
            <ul className="chat-list">
                {filteredFriends.length > 0 ? (
                    filteredFriends.map((friend) => (
                        <li
                            key={friend.id}
                            className={friend.id === selectedUserId ? 'active' : ''}
                            onClick={() => setSelectedUserId(friend.id)}
                        >
                            <div className="chat-item">
                                <img
                                    src={`${avatarBaseUrl}${friend.avatar}`}
                                    alt={`${friend.firstName} ${friend.lastName}'s Avatar`}
                                    className="chat-avatar"
                                />
                                <div className="chat-info">
                                    <p>{friend.firstName} {friend.lastName}</p>
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
    );
};

export default ChatSidebar;
