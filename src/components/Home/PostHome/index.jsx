import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { avatarBaseUrl } from '../../../services/Constants';
import { fetchSavedPosts, handleSavePost } from '../../Posts/button/SavePost'
import { fetchLikePosts, handleLikePost } from '../../Posts/button/LikePost'
import SharePost from '../../Posts/button/SharesPost';
import ShowComments from '../../Posts/ShowComments';
import CreateComment from '../../Posts/CreateComment';
import CreatePost from '../../Posts/CreatePost';
import ShowListUserShare from '../../Posts/ShowListUserSharePost';
import '../../../styles/style.css';

const PostForm = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [token, setToken] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [video, setVideo] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [status, setStatus] = useState('public');
    const [posts, setPosts] = useState([]);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [comments, setComments] = useState([]);
    const [shares, setShares] = useState([]);
    const [selectedPostIdComments, setSelectedPostIdComments] = useState(null);
    const [selectedPostIdShares, setSelectedPostIdShares] = useState(null);
    const [content, setContent] = useState('');
    const [savedPosts, setSavedPosts] = useState([]);
    const [likePosts, setLikePosts] = useState([]);
    
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
        } else {
            setToken(accessToken);
            fetchUserProfile(accessToken);

        }
    }, []);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        fetchSavedPosts(accessToken, setSavedPosts);
    }, []);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        fetchLikePosts(accessToken, setLikePosts);
    }, []);


    const fetchUserProfile = async (accessToken) => {
        try {
            const config = { headers: { Authorization: `Bearer ${accessToken}` } };
            const response = await axios.get('/auth/profile', config);
            const { firstName, lastName, avatar } = response.data;
            setFirstName(firstName);
            setLastName(lastName);
            const formattedAvatar = avatar.startsWith(avatarBaseUrl) ? avatar : `${avatarBaseUrl}${avatar}`;
            setAvatarUrl(formattedAvatar);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/posts/allList');
                const updatedPosts = response.data.map(post => {
                    const isSaved = post.isSaved;
                    return { ...post, isSaved };
                });
                setPosts(updatedPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    const handleCommentButtonClick = async (postId) => {
        setSelectedPostIdComments(postId);
        try {
            const response = await axios.get(`/comments/post/${postId}`);
            setComments(response.data.content);
            console.log('List comments post:', response.data);
        } catch (error) {
            console.error('Error fetching shares:', error);
        }
    };

    const handleSharesButtonClick = async (postId) => {
        setSelectedPostIdShares(postId);
        try {
            const response = await axios.get(`/shares/post/${postId}/shared`);
            await fetchShares(postId);
            setShares(response.data);
        } catch (error) {
            console.error('Error fetching users shares post:', error);
        }
    };

    const fetchShares = async (postId) => {
        try {
            const response = await axios.get(`/shares/post/${postId}/shared`);
            setShares(response.data.content);
            console.log('List users shares post:', response.data);
        } catch (error) {
            console.error('Error fetching users shares post:', error);
        }
    };

    const handleShare = (postId) => {
        const updatedPosts = posts.map(post => {
            if (post.id === postId) {
                return { ...post, totalShare: post.totalShare + 1 };
            }
            console.log('Share successfull Id-Post:', postId);
            return post;
        });
        setPosts(updatedPosts); // Cập nhật danh sách bài viết
    };

    const handleInputChange = (event) => {
        setContent(event.target.value);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const mediaId = await uploadMedia();
            const response = await createPost(mediaId);
            // Ẩn modal tạo bài viết
            handleCloseModal();
            // Cập nhật danh sách bài viết
            fetchPosts();
            resetForm();
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const uploadMedia = async () => {
        const formData = new FormData();
        if (image) formData.append('filePath', image);
        if (video) formData.append('filePath', video);
        const config = { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` } };
        const mediaResponse = await axios.post('/posts/upload', formData, config);
        return mediaResponse.data;
    };

    const createPost = async (mediaId) => {
        const postData = { title: title, body: body, status: status, mediasId: mediaId ? [mediaId] : [] };
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        return await axios.post('/posts/create', postData, config);
    };

    const resetForm = () => {
        setTitle('');
        setBody('');
        setImage(null);
        setVideo(null);
        setImageUrl(null);
        setVideoUrl(null);
        setStatus('public');
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
        setImageUrl(URL.createObjectURL(selectedImage));
        handleShowModal();
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        console.log('Comment successfully posted.');
        if (!selectedPostIdComments) {
            console.error('Error creating comment: Post ID is missing');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('postId', selectedPostIdComments);
            formData.append('content', content);
            const config = { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` } };
            const response = await axios.post('/comments/create', formData, config);
            const updatedPosts = posts.map(post => {
                if (post.id === selectedPostIdComments) {
                    return { ...post, totalComment: post.totalComment + 1 };
                } else {
                    return post;
                }
            });
            setPosts(updatedPosts);
            fetchComments(selectedPostIdComments);
            setContent('');
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const fetchComments = async (postId) => {
        try {
            const response = await axios.get(`/comments/post/${postId}`);
            setComments(response.data.content);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleCommentSubmit(e);
            console.log('Comment successfully post.');
        }
    };

    const handleVideoChange = (e) => {
        const selectedVideo = e.target.files[0];
        setVideo(selectedVideo);
        setVideoUrl(URL.createObjectURL(selectedVideo));
        handleShowModal();
    };

    const handleImageRemove = () => {
        setImage(null);
        setImageUrl(null);
    };

    const handleVideoRemove = () => {
        setVideo(null);
        setVideoUrl(null);
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const updateCommentList = (updatedComments) => {
        setComments(updatedComments);
    };

    const fetchPosts = async () => {
        try {
            const response = await axios.get('/posts/allList');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };    

    return (
        <div className="lg:ml-custom sm:ml-0">
            {/* phần form khi nhấn vào sẽ hiện ra modal để tạo ở dưới */}
            <div style={{ marginTop: '6rem', backgroundColor: 'rgb(240, 242, 245)' }} className="p-6 border-gray-200 border rounded-lg overflow-hidden shadow-md">
                <div className='flex'>
                    <img src={avatarUrl} alt="User Avatar" className="rounded-full w-12 h-12 shadow-lg" />
                    <input
                        style={{ borderRadius: '50px', marginLeft: '0.5rem' }}
                        className="w-full p-2 x1lliihq x6ikm8r x10wlt62 x1n2onr6 border border-gray-300"
                        placeholder=" What's are you thinking ?"
                        onClick={handleShowModal}
                    />
                </div>
                <div className='_8icz'></div>
                <div className='flex justify-between'>
                    <div className=" flex items-center">
                        <label htmlFor="image" className="block cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-8 h-8">
                                <path fill="#54ba40" d="M160 80H512c8.8 0 16 7.2 16 16V320c0 8.8-7.2 16-16 16H490.8L388.1 178.9c-4.4-6.8-12-10.9-20.1-10.9s-15.7 4.1-20.1 10.9l-52.2 79.8-12.4-16.9c-4.5-6.2-11.7-9.8-19.4-9.8s-14.8 3.6-19.4 9.8L175.6 336H160c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16zM96 96V320c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H160c-35.3 0-64 28.7-64 64zM48 120c0-13.3-10.7-24-24-24S0 106.7 0 120V344c0 75.1 60.9 136 136 136H456c13.3 0 24-10.7 24-24s-10.7-24-24-24H136c-48.6 0-88-39.4-88-88V120zm208 24a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
                            </svg>
                            <input type="file" id="image" onChange={handleImageChange} className="hidden" />
                        </label>
                        <p className="ml-2 ">Image</p>
                    </div>
                    <div className=" flex items-center">
                        <label htmlFor="live" className="block cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-8 h-8">
                                <path fill="#b81414" d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" />
                            </svg>
                        </label>
                        <label htmlFor="Live" className="ml-2 ">Live</label>
                    </div>
                    <div className=" flex items-center">
                        <label htmlFor="video" className="block cursor-pointer ml-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-8 h-6">
                                <path fill="#0285e8" d="M64 64V352H576V64H64zM0 64C0 28.7 28.7 0 64 0H576c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zM128 448H512c17.7 0 32 14.3 32 32s-14.3 32-32 32H128c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
                            </svg>
                            <input type="file" id="video" onChange={handleVideoChange} className="hidden" accept="video/*" title="Video" />
                        </label>
                        <p className="ml-2 ">Video</p>
                    </div>
                    <div className=" flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-8 h-6">
                            <path fill="#e4c44e" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                        </svg>
                        <p className="ml-2 ">Feeling</p>
                    </div>
                </div>
            </div>
            {/* phần modal sau khi nhấn vào form ở trên */}
            <CreatePost
                showModal={showModal}
                handleCloseModal={handleCloseModal}
                handleFormSubmit={handleFormSubmit}
                handleImageChange={handleImageChange}
                handleVideoChange={handleVideoChange}
                handleImageRemove={handleImageRemove}
                handleVideoRemove={handleVideoRemove}
                body={body}
                setBody={setBody}
                status={status}
                setStatus={setStatus}
                image={image}
                imageUrl={imageUrl}
                video={video}
                videoUrl={videoUrl}
                firstName={firstName}
                lastName={lastName}
                avatarUrl={avatarUrl}
            />

            {/* Show bài viết----------------------------------------------------------------------------------- */}
            <div style={{ backgroundColor: 'rgb(212, 223, 235)' }} className="mt-10">
                {posts.map((post, index) => (
                    <div key={index} className="max-w-3xl mx-auto bg-gray-100 mb-8 rounded-md relative">
                        <div className='flex justify-between rounded-t-md pt-4 pl-4 pr-4 bg-gray-200'>
                            <div>
                                <Link className="flex items-center mb-3">
                                    <img src={`${avatarBaseUrl}${post.userId.avatar}`} alt="Avatar" className="w-12 h-12 rounded-full mr-2 shadow-lg" />
                                    <div>
                                        <p className="text-sm font-medium">{post.userId.firstName} {post.userId.lastName}</p>
                                        <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(post.createAt), { addSuffix: true })}</p>
                                    </div>
                                </Link>
                            </div>
                            <div className='p-4'>
                                <button className='hover:scale-105 transition-transform duration-300' onClick={() => handleSavePost(post.id, token, savedPosts, setSavedPosts)}>
                                    {savedPosts.includes(post.id) ?
                                        <svg className="w-6 h-6 text-gray-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                            <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z" />
                                        </svg>
                                        :
                                        <svg className="w-6 h-6 text-gray-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                            <path d="M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4V48H48V0H336c26.5 0 48 21.5 48 48V488c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488V48z" />
                                        </svg>
                                    }
                                </button>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-2 ml-6">{post.body}</p>
                        {post.medias && post.medias.map((media, index) => (
                            <React.Fragment key={index}>
                                {media.publicUrl.endsWith('.mp4') ? (
                                    <video style={{ maxHeight: '25rem' }} controls src={`${avatarBaseUrl}${media.publicUrl}`} alt={`Media ${index}`} className="w-full object-contain mb-2"></video>
                                ) : (
                                    <img style={{ maxHeight: '25rem' }} src={`${avatarBaseUrl}${media.publicUrl}`} alt={`Media ${index}`} className="w-full object-contain mb-2" />
                                )}
                            </React.Fragment>
                        ))}
                        <div style={{ fontSize: 'small' }} className="flex justify-between ml-8 mr-6">
                            <span>{post.totalLike} Love</span>
                            <div className="flex justify-between ml-4">
                                {post.totalComment}{" "}
                                <button className="ml-2 mr-2" onClick={() => handleCommentButtonClick(post.id)}>
                                    Comment
                                </button>
                                <button className="ml-2 mr-2" onClick={() => handleSharesButtonClick(post.id)}>
                                    {post.totalShare} Share
                                </button>
                            </div>
                        </div>
                        <div className='_8icz'></div>
                        <div className="flex justify-between mt-4 ml-4 mr-4 pb-4 pl-4 pr-4">
                            <button className='text-red-500 hover:text-gray-700 flex hover:scale-105 transition-transform duration-300' onClick={() => handleLikePost(post.reactionsId, post.id, token, likePosts, setLikePosts, setPosts)}>
                                {likePosts.includes(post.id) ?
                                    <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path fill="#e43f3f" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                                    </svg>
                                    :
                                    <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path fill="#e43f3f" d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                                    </svg>
                                }
                                <p>Love</p>
                            </button>
                            <button className="text-green-500 hover:text-gray-700 flex hover:scale-105 transition-transform duration-300" onClick={() => handleCommentButtonClick(post.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                                </svg>
                                <p>Comment</p>
                            </button>
                            <SharePost postId={post.id} token={token} onShare={handleShare} />
                        </div>
                    </div>
                ))}
                {selectedPostIdComments && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: 999 }}>
                        <div style={{ flex: '2', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', marginTop: '5rem', overflowX: 'hidden' }} id="crud-modal" tabIndex="-1" aria-hidden="true">
                            <div className="flex items-center">
                                <div className="bg-gray-500 bg-opacity-75 fixed inset-0 transition-opacity" aria-hidden="true"></div>
                                <div className="bg-white p-6 rounded-lg shadow-md z-50 lg:ml-customs sm:ml-0 lg:w-2/5 sm:w-full">
                                    <div className='flex justify-between items-center'>
                                        <h2 className="text-lg font-semibold">Comments</h2>
                                        <button className="text-gray-500 hover:text-gray-700" onClick={() => setSelectedPostIdComments(null)}>
                                            <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className='_8icz border-t border-gray-200 mt-4'></div>
                                    <ShowComments comments={comments} updateCommentList={updateCommentList} />
                                    <div className='_8icz border-t border-gray-200 mt-4'></div>
                                    <CreateComment
                                        avatarUrl={avatarUrl}
                                        handleCommentSubmit={handleCommentSubmit}
                                        handleInputChange={handleInputChange}
                                        handleKeyPress={handleKeyPress}
                                        content={content}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {selectedPostIdShares && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: 999 }}>
                        <div style={{ flex: '2', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', marginTop: '5rem', overflowX: 'hidden' }} id="crud-modal" tabIndex="-1" aria-hidden="true">
                            <div className="flex items-center">
                                <div className="bg-gray-500 bg-opacity-75 fixed inset-0 transition-opacity" aria-hidden="true"></div>
                                <div className="bg-white p-6 rounded-lg shadow-md z-50 lg:ml-customs sm:ml-0 lg:w-2/5 sm:w-full">
                                    <div className='flex justify-between items-center'>
                                        <h2 className="text-lg font-semibold">Share</h2>
                                        <button className="text-gray-500 hover:text-gray-700" onClick={() => setSelectedPostIdShares(null)}>
                                            <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className='_8icz border-t border-gray-200 mt-4'></div>
                                    <ShowListUserShare shares={shares} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostForm;
