import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { avatarBaseUrl } from '../../../services/Constants';
import { FaEllipsisV, FaTimes } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const Charts = () => {
    const [showPosts, setShowPosts] = useState(false);
    const [posts, setPosts] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [showBarChart, setShowBarChart] = useState(true); // State to control the bar chart visibility

    // Dữ liệu biểu đồ mẫu
    const data = [
        { name: 'January', users: 4000, posts: 2400, comments: 1200 },
        { name: 'February', users: 3000, posts: 2100, comments: 1100 },
        { name: 'March', users: 2000, posts: 1600, comments: 900 },
        { name: 'April', users: 2780, posts: 1900, comments: 1000 },
        { name: 'May', users: 1890, posts: 1400, comments: 700 },
        { name: 'June', users: 2390, posts: 1700, comments: 900 },
        { name: 'July', users: 3490, posts: 2200, comments: 1200 },
        { name: 'August', users: 4000, posts: 2400, comments: 1300 },
        { name: 'September', users: 3000, posts: 2100, comments: 1100 },
        { name: 'October', users: 2000, posts: 1600, comments: 900 },
        { name: 'November', users: 2780, posts: 1900, comments: 1000 },
        { name: 'December', users: 1890, posts: 1400, comments: 700 },
    ];

    useEffect(() => {
        fetchPosts();
        fetchComments();
    }, []);

    const toggleDropdown = (id) => {
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    const fetchPosts = async () => {
        try {
            const response = await axios.get('/admin/PostsAllList');
            setPosts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get('/admin/allComments');
            setComments(response.data);
            console.log(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleDeletePosts = async (postId) => {
        try {
            setLoading(true);
            const accessToken = localStorage.getItem('accessToken');
            await axios.delete(`/delete/${postId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

        } catch (error) {
            console.error('Error deleting favorite:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComments = async (commentId) => {
        try {
            await axios.delete(`/admin/delete/${commentId}`);
            setComments(comments.filter(comment => comment.id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handlePostsClick = () => {
        setShowPosts(!showPosts);
        setShowComments(false); 
        setShowBarChart(showPosts); 
    }

    const handleCommentsClick = () => {
        setShowComments(!showComments);
        setShowPosts(false); 
        setShowBarChart(showComments);
    }

    const openModal = (post) => {
        setSelectedPost(post);
    };

    const closeModal = () => {
        setSelectedPost(null);
    };

    return (
        <div style={{ marginLeft: '15.5%', width: '1558px' }} className=" mx-auto mt-28">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1 */}
                <div className="bg-blue-100 rounded-lg shadow-md p-6 hover:scale-105 transition-transform duration-300">
                    <h2 className="text-xl font-semibold mb-4">Users</h2>
                    <p className="text-gray-600">Total users: 1000</p>
                    {/* Biểu đồ */}
                    <div className="mt-4">
                        <ResponsiveContainer width="100%" height={100}>
                            <LineChart data={data}>
                                <Line type="monotone" dataKey="users" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Thẻ chuyển trang */}
                    <a href="/listUser" className="text-blue-500 mt-2 block hover:underline">View all users</a>
                </div>
                {/* Card 2 */}
                <div className="bg-green-100 rounded-lg shadow-md p-6 hover:scale-105 transition-transform duration-300">
                    <h2 className="text-xl font-semibold mb-4">Posts</h2>
                    <p className="text-gray-600">Total posts: 500</p>
                    <div className="mt-4">
                        <ResponsiveContainer width="100%" height={100}>
                            <LineChart data={data}>
                                <Line type="monotone" dataKey="users" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <a href="#" className="text-blue-500 mt-2 block hover:underline" onClick={handlePostsClick}>
                        {showPosts ? "Hide posts" : "View all posts"}
                    </a>

                </div>
                {/* Card 3 */}
                <div className="bg-yellow-100 rounded-lg shadow-md p-6 hover:scale-105 transition-transform duration-300">
                    <h2 className="text-xl font-semibold mb-4">Comments</h2>
                    <p className="text-gray-600">Total comments: 2000</p>
                    <div className="mt-4">
                        <ResponsiveContainer width="100%" height={100}>
                            <LineChart data={data}>
                                <Line type="monotone" dataKey="users" stroke="#ffc658" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <a href="#" className="text-blue-500 mt-2 block hover:underline" onClick={handleCommentsClick}>
                        {showComments ? "Hide comments" : "View all comments"}
                    </a>


                </div>
                {/* Card 4 */}
                <div className="bg-orange-100 rounded-lg shadow-md p-6 hover:scale-105 transition-transform duration-300">
                    <h2 className="text-xl font-semibold mb-4">Analytics</h2>
                    <p className="text-gray-600">Monthly visitors: 5000</p>
                    {/* Biểu đồ */}
                    <div className="mt-4">
                        <ResponsiveContainer width="100%" height={100}>
                            <LineChart data={data}>
                                <Line type="monotone" dataKey="users" stroke="#ff7300" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Biểu đồ cột */}
                {showBarChart && (
                    <div className="mt-8" style={{ width: '1558px' }}>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                                <XAxis dataKey="name" stroke="#8884d8" />
                                <YAxis stroke="#8884d8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#f5f5f5', border: 'none' }}
                                    cursor={{ fill: 'rgba(136, 132, 216, 0.2)' }}
                                />
                                <Legend verticalAlign="top" height={36} />
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.3} />
                                    </linearGradient>
                                    <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.3} />
                                    </linearGradient>
                                    <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#ffc658" stopOpacity={0.3} />
                                    </linearGradient>
                                </defs>
                                <Bar dataKey="users" fill="url(#colorUsers)" barSize={30} radius={[10, 10, 0, 0]} />
                                <Bar dataKey="posts" fill="url(#colorPosts)" barSize={30} radius={[10, 10, 0, 0]} />
                                <Bar dataKey="comments" fill="url(#colorComments)" barSize={30} radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}


                {showPosts && (
                    <div className='mb-8' style={{ width: '1558px' }}>
                        <table className="w-full rounded-lg overflow-hidden">
                            <thead>
                                <tr className='hover:bg-gray-50'>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className=" bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Body</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Like</th>
                                    <th className=" bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Comment</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Share</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Media</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">create At</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {posts.map(post => (
                                    <tr key={post.id}>
                                        <td onClick={() => openModal(post)} className="hover:scale-105 transition-transform duration-300 px-6 py-4 whitespace-nowrap text-green-600">{post.id}</td>
                                        <td className=" whitespace-nowrap">{post.body}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{post.status}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{post.totalLike}</td>
                                        <td className="whitespace-nowrap">{post.totalComment}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{post.totalShare}</td>
                                        <td>
                                            {post.medias.map(media => (
                                                <div key={media.id}>
                                                    {media.publicUrl}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{post.userId.firstName} {post.userId.lastName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(post.createAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal */}
                {selectedPost && (
                    <li key={selectedPost.id} className="relative h-fit border bg-gray-100 rounded-lg overflow-hidden">
                        <div style={{ width: '1558px' }} className="flex items-center justify-between">
                            <div className="pb-2 pl-6 flex items-center justify-between">
                                <div className="flex items-center">
                                    <img src={`${avatarBaseUrl}${selectedPost.userId.avatar}`} alt="Avatar" className="w-10 h-10 rounded-full shadow-lg mr-4" />
                                    <div>
                                        <p className="text-sm font-semibold">{selectedPost.userId.firstName} {selectedPost.userId.lastName}</p>
                                        <p className="text-xs text-gray-600">{formatDistanceToNow(new Date(selectedPost.createAt), { addSuffix: true })}</p>
                                    </div>
                                </div>
                                <div className="relative ml-48">
                                    <button onClick={() => closeModal(selectedPost.id)} className="focus:outline-none">
                                        <FaTimes />
                                    </button>

                                </div>
                            </div>
                            <div className="relative pr-6 flex items-center">
                                <button onClick={() => toggleDropdown(selectedPost.id)} className="focus:outline-none">
                                    <FaEllipsisV />
                                </button>
                                {openDropdownId === selectedPost.id && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                                        <button
                                            onClick={() => handleDeletePosts(selectedPost.id)}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}

                            </div>
                        </div>
                        <div className="px-4 py-2 border-t">
                            <p className="text-sm font-semibold">{selectedPost.body}</p>
                            {selectedPost.medias && selectedPost.medias.length > 0 && (
                                <div>
                                    {selectedPost.medias.map((media, index) => (
                                        <div key={index}>
                                            {media.publicUrl.endsWith('.mp4') ? (
                                                <video controls src={`${avatarBaseUrl}${media.publicUrl}`} alt={`Video ${index}`} className="w-full object-contain mb-2"></video>
                                            ) : (
                                                <img src={`${avatarBaseUrl}${media.publicUrl}`} alt={`Image ${index}`} className="w-full object-contain mb-2" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className='flex justify-between mt-4 ml-4 mr-4'>
                                <p className="text-sm text-red-500 flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                                        <path fill="#ff5252" d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                                    </svg>
                                    {selectedPost.totalLike}
                                </p>
                                <p className="text-sm text-green-500 flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                                    </svg>
                                    {selectedPost.totalComment}
                                </p>
                                <p className="text-sm text-gray-500 flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                    </svg>
                                    {selectedPost.totalShare}
                                </p>
                            </div>
                        </div>
                    </li>
                )}

                {showComments && (
                    <div className='mb-8' style={{ width: '1558px' }}>
                        <table className="w-full rounded-lg overflow-hidden">
                            <thead>
                                <tr className='hover:bg-gray-50'>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post ID</th>
                                    <th className=" bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Like</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Create At</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">id user</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {comments.map((comment) => (
                                    <tr key={comment.id}>
                                        <td className="hover:scale-105 transition-transform duration-300 px-6 py-4 whitespace-nowrap">{comment.id}</td>
                                        <td className="hover:scale-105 transition-transform duration-300 px-6 py-4 whitespace-nowrap">{comment.content}</td>
                                        <td className="hover:scale-105 transition-transform duration-300 px-6 py-4 whitespace-nowrap">{comment.postId.id}</td>
                                        <td className="hover:scale-105 transition-transform duration-300 px-6 py-4 whitespace-nowrap">{comment.totalLike}</td>
                                        <td className="hover:scale-105 transition-transform duration-300 px-6 py-4 whitespace-nowrap">{new Date(comment.createAt).toLocaleDateString()}</td>
                                        <td className="hover:scale-105 transition-transform duration-300 px-6 py-4 whitespace-nowrap">{comment.createBy.firstName} {comment.createBy.lastName}</td>
                                        <td className="hover:scale-105 transition-transform duration-300 px-6 py-4 whitespace-nowrap">{comment.createBy.id}</td>
                                        <td className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <button className="w-4 h-4 mr-1 text-red-500 hover:scale-105 transition-transform duration-300" onClick={() => handleDeleteComments(comment.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Charts;
