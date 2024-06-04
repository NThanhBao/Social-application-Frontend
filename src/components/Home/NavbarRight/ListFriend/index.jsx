import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { avatarBaseUrl } from '../../../../services/Constants';

function ListFriend() {
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get('/auth/ListFollowing', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setFriends(response.data);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    return (
        <div style={{ marginTop: '20%', position: 'fixed', right: '1px', top: '50%', transform: 'translateY(-50%)' }} className='hidden lg:block '>
            <div className="z-20 flex mr-4 shrink-0 grow-0 justify-around gap-4 border-t border-gray-200 bg-white/50 p-2.5 shadow-lg backdrop-blur-lg dark:border-slate-600/60 dark:bg-slate-800/50 -translate-y-2/4 left-6 min-h-[auto] min-w-[64px] flex-col rounded-lg border">
                <ul className="space-y-2">
                    {friends.map((friend) => (
                        <li key={friend.id}>
                            <Link to={`/profile/${friend.id}`} className="flex items-center p-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700">
                                <div className="relative">
                                    <img src={`${avatarBaseUrl}${friend.avatar}`} alt="Avatar" style={{ width: '3rem', height: '3rem', borderRadius: '50%' }} className='shadow-lg'/>
                                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border border-white"></div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    );
}

export default ListFriend;
