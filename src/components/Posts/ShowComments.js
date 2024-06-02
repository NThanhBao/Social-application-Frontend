import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { avatarBaseUrl } from '../../services/Constants';
import { fetchLikeComments, handleLikeComments } from '../Posts/button/LikeComment'

const ShowComments = ({ comments, setcomments }) => {
    const [token, setToken] = useState('');

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            setToken(accessToken);
        }
    }, []);

    const [likeComments, setLikeComments] = useState([]);
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        fetchLikeComments(accessToken, setLikeComments);
    }, []);

    return (
        <React.Fragment>
            {comments && comments.length > 0 ? (
                comments.map((comment, index) => (
                    <div key={index} className="flex items-start mt-4 p-2">
                        <img src={`${avatarBaseUrl}${comment.createBy.avatar}`} alt="Avatar" className="w-12 h-12 rounded-full mr-2" />
                        <div className="flex-1 p-4 border-t border-gray-200 bg-white/50 shadow-lg backdrop-blur-lg rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                                <Link to={`/profile/${comment.createBy.id}`}>
                                    <p className="text-sm font-semibold">{comment.createBy.firstName} {comment.createBy.lastName}</p>
                                </Link>
                                <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(comment.createAt), { addSuffix: true })}</p>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                            <div className="flex justify-between mt-1">
                                <div className="flex justify-between mt-1">
                                    <button className='text-red-500 hover:text-gray-700 flex' onClick={() => handleLikeComments(comment.reactionsId, comment.id, token, likeComments, setLikeComments, setcomments)}>
                                        {likeComments.includes(comment.id) ?
                                            <svg className="w-4 h-4 mt-1 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path fill="#e43f3f" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                                            </svg>
                                            :
                                            <svg className="w-4 h-4 mt-1 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path fill="#e43f3f" d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                                            </svg>
                                        }
                                        <p>Love</p>
                                    </button>
                                    <button className="text-green-500 hover:text-gray-700 flex ml-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mt-1 mr-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                                        </svg>
                                        <p>Reply</p>
                                    </button>
                                </div>
                                <span className="flex text-sm text-gray-500">
                                    <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path fill="#e43f3f" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                                    </svg>
                                    {comment.totalLike}
                                </span>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-red-500 mt-4">No comments available</p>
            )}
        </React.Fragment>
    );
};

export default ShowComments;
