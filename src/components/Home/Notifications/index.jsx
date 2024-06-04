import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { avatarBaseUrl } from '../../../services/Constants';
import 'animate.css';

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const accessToken = localStorage.getItem('accessToken');
            const commentsResponse = await axios.get('/comments/my-posts', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const reactionsPostsResponse = await axios.get('/reactions/my-posts', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const reactionsCommentsResponse = await axios.get('/reactions/my-comments', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const mergedNotifications = [
                ...commentsResponse.data.map((comment) => ({ ...comment, type: 'comment' })),
                ...reactionsPostsResponse.data.map((reactionPost) => ({ ...reactionPost, type: 'reactionPost' })),
                ...reactionsCommentsResponse.data.map((reactionComment) => ({ ...reactionComment, type: 'reactionComment' }))
            ];

            // Sắp xếp theo thời gian giảm dần
            const sortedNotifications = mergedNotifications.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));

            setNotifications(sortedNotifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" bg-gray-100 items-start">
            <div className="p-4 bg-white shadow-lg rounded-lg">
                <div style={{ maxHeight: '60rem', overflowY: 'auto' }}>
                    {loading ? (
                        <div className="flex justify-center items-center animate__animated animate__fadeIn">
                            <p>Loading...</p>
                        </div>
                    ) : (
                        <ul className="space-y-1">
                            {notifications.map((notification) => (
                                <li key={notification.id} className='hover:scale-105 transition-transform duration-300 flex items-center m-2 p-2 border-t border-gray-200 bg-white/50 shadow-lg backdrop-blur-lg rounded-lg' >
                                    <div className="flex items-start py-2">
                                        {notification.createBy && notification.createBy.avatar && (
                                            <img src={`${avatarBaseUrl}${notification.createBy.avatar}`} alt="Avatar" className="w-12 h-12 rounded-full shadow-lg mr-2" />
                                        )}
                                        <div className="flex flex-col flex-grow">
                                            <div className="justify-between mb-1">
                                                {notification.createBy && (
                                                    <Link to={`/profile/${notification.createBy.id}`} className="text-blue-500 hover:underline">
                                                        <p className="text-sm font-semibold">{notification.createBy.firstName} {notification.createBy.lastName}</p>
                                                    </Link>
                                                )}
                                                <p className="text-xs text-gray-600">
                                                    {notification.type === 'comment' ? 'commented' : notification.type === 'reactionPost' ? 'liked' : 'liked on your comment'} on your post {formatDistanceToNow(new Date(notification.createAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                            {notification.type === 'comment' && (
                                                <>
                                                    <p className="text-xs text-gray-500 mt-1">Post: {notification.postId.body}</p>
                                                    <div className='flex justify-between mt-2 mr-4'>
                                                        <p className="text-xs text-gray-700">{notification.content}</p>
                                                        <p className="text-xs text-gray-500">{notification.totalLike} Like</p>
                                                    </div>
                                                </>
                                            )}
                                            {(notification.type === 'reactionPost' || notification.type === 'reactionComment') && (
                                                <>
                                                    
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    {!loading && notifications.length === 0 && (
                        <p className="text-center text-red-500 mt-4">No notification available</p>
                    )}
                </div>
            </div>
        </div>
    );

}

export default Notifications;
