import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { avatarBaseUrl } from '../../../services/Constants';
import { formatDistanceToNow } from 'date-fns';
import { AiFillHeart, AiFillComment, AiFillShareAlt, AiFillDelete } from 'react-icons/ai';
import { FaEllipsisV } from 'react-icons/fa';

const Repository = ({ token }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const formRef = useRef(null);
    const [openDropdownId, setOpenDropdownId] = useState(null); // Track which dropdown is open

    useEffect(() => {
        fetchFavorites();
    }, []);

    useEffect(() => {
        const formPosition = formRef.current.getBoundingClientRect().top;
        window.scrollTo({
            top: formPosition,
            behavior: 'smooth'
        });
    }, [favorites]);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/favorites/all-posts', {
                headers: {
                    Authorization: `Bearer ${token}` // Sử dụng token đã được truyền vào
                }
            });
            console.log(response.data); // In ra log danh sách bài viết đã lấy được
            setFavorites(response.data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        try {
            setLoading(true);
            const accessToken = localStorage.getItem('accessToken');
            await axios.delete(`/favorites/delete/${postId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            // Refetch the favorites after deletion
            fetchFavorites();
        } catch (error) {
            console.error('Error deleting favorite:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleDropdown = (id) => {
        setOpenDropdownId(openDropdownId === id ? null : id);
    };
    
    return (
        <div>
            <div className=" w-full">
                <div className="p-2" ref={formRef}>
                    {loading ? (
                        <div className="flex justify-center items-center animate__animated animate__fadeIn">
                            <p>Loading...</p>
                        </div>
                    ) : (
                        <div style={{ maxHeight: '78vh', overflowY: 'auto' }}>
                            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {favorites.map((favorite) => (
                                    <li key={favorite.postsID} className="h-fit border bg-gray-100 rounded-lg overflow-hidden">
                                        <div className=" bg-gray-200 flex items-center justify-between">
                                        <div className="p-2 pl-6 flex items-center">
                                            <img src={`${avatarBaseUrl}${favorite.avatar}`} alt="Avatar" className="w-10 h-10 rounded-full shadow-lg mr-4" />
                                            <div>
                                                <p className="text-sm font-semibold">{favorite.firstName} {favorite.lastName}</p>
                                                <p className="text-xs text-gray-600">{formatDistanceToNow(new Date(favorite.createAt), { addSuffix: true })}</p>
                                            </div>
                                        </div>
                                        <div className="relative pr-6">
                                                <button onClick={() => toggleDropdown(favorite.postsID)} className="focus:outline-none">
                                                    <FaEllipsisV />
                                                </button>
                                                {openDropdownId === favorite.postsID && (
                                                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                                                        <button
                                                            onClick={() => handleDelete(favorite.postsID)}
                                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            </div>
                                        <div className="px-4 py-2 border-t">
                                            <p className="text-sm font-semibold">{favorite.body}</p>
                                            {favorite.mediaPublicUrls && favorite.mediaPublicUrls.length > 0 && (
                                                <div>
                                                    {favorite.mediaPublicUrls.map((mediaUrl, index) => (
                                                        <div key={index}>
                                                            {mediaUrl.endsWith('.mp4') ? (
                                                                <video controls src={`${avatarBaseUrl}${mediaUrl}`} alt={`Video ${index}`} className="w-full object-contain mb-2"></video>
                                                            ) : (
                                                                <img src={`${avatarBaseUrl}${mediaUrl}`} alt={`Image ${index}`} className="w-full object-contain mb-2" />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <div className='flex justify-between mt-4 ml-4 mr-4'>
                                                <p className="text-sm text-red-500 flex">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512 " strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                                                        <path fill="#ff5252" d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                                                    </svg>
                                                    {favorite.totalLike}
                                                </p>
                                                <p className="text-sm text-green-500 flex">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                                                    </svg>
                                                    {favorite.totalComment}
                                                </p>
                                                <p className="text-sm text-gray-500 flex">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                                    </svg>
                                                    {favorite.totalShare}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {/* Added line for displaying a message when there are no favorites */}
                            {!loading && favorites.length === 0 && (
                                <p className="text-center text-red-500 mt-4">No favorites available</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
    
};

export default Repository;
