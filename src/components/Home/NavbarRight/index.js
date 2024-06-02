import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { avatarBaseUrl } from '../../../services/Constants';
import { handleFollowUser, fetchUnfollowedUsers } from '../../../services/Home/NavbarRightService';
import '../../../styles/style.css';

function NavbarRight() {
    const [unfollowedUsers, setUnfollowedUsers] = useState([]);
    const [isLoading, setIsLoading] = useState({});

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

    useEffect(() => {
        fetchUnfollowedUsers(setUnfollowedUsers);
    }, []);

    const handleFollow = (userId) => {
        setIsLoading(prevState => ({ ...prevState, [userId]: true }));
        handleFollowUser(userId, () => {
            fetchUnfollowedUsers(setUnfollowedUsers);
        });
    };

    return (
        <div className='hidden lg:flex flex-col' style={{
            position: 'fixed',
            marginTop:'5rem',
            right: '0',
            height: '100%',
            width: '450px',
            backgroundColor: 'rgb(240, 242, 245)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            overflowY: 'auto',
            padding: '20px',
            boxSizing: 'border-box',
        }}>
            <div className='suggestion-list' style={{
                marginBottom: '20px',
            }}>
                <div>
                    <h1 className="self-center text-base font-semibold whitespace-nowrap dark:text-white bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Suggest</h1>
                </div>
                <ul>
                    {unfollowedUsers.map(user => (
                        <li className='hover:scale-105 transition-transform duration-300 flex items-center m-2 p-2 border-t border-gray-200 bg-white/50 shadow-lg backdrop-blur-lg rounded-lg' key={user.id}>
                            <Link to={`/profile/${user.id}`} className='flex items-center w-full'>
                                <img src={`${avatarBaseUrl}${user.avatar}`} alt="Avatar" className='shadow-lg rounded-full mr-4' style={{ width: '3rem', height: '3rem' }} />
                                <div className='pt-2'>
                                    <div>{user.firstName} {user.lastName}</div>
                                </div>
                            </Link>
                            <button 
                                className='ml-auto button-blue py-2 px-4 rounded-full' 
                                onClick={() => handleFollow(user.id)}
                                disabled={isLoading[user.id]}
                            >
                                {isLoading[user.id] ? 'Loading...' : 'Follow'}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="_8icz"></div>
            <div className='friend-list'>
                <div className="pb-4">
                    <h1 className="text-base font-semibold whitespace-nowrap dark:text-white bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Contact</h1>
                </div>
                <ul className="space-y-2">
                    {friends.map((friend) => (
                        <li key={friend.id}>
                            <Link to={`/profile/${friend.id}`} className="flex items-center p-2 rounded-lg hover:bg-gray-300">
                                <div className="relative">
                                    <img src={`${avatarBaseUrl}${friend.avatar}`} alt="Avatar" className='shadow-lg rounded-full' style={{ width: '3rem', height: '3rem' }} />
                                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border border-white"></div>
                                </div>
                                <div className='pt-2 ml-4'>
                                    <div>{friend.firstName} {friend.lastName}</div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default NavbarRight;
