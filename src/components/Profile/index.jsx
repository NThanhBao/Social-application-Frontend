import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import '../../styles/style.css';
import Header from '../Header';
import ShowComments from '../Posts/ShowComments';
import CreateComment from '../Posts/CreateComment';
import ShowListUserShare from '../Posts/ShowListUserSharePost';
import SharePost from '../Posts/button/SharesPost';
import UserImages from './ImagesProfileUser';
import UserVideos from './VideoProfileUser';
import ChangeBackground from './butons/ChangeBackground';
import ChangeAvatar from './butons/ChangeAvatar';
import EditProfile from './EditProfile';
import Repository from './Repository';
import { fetchLikePosts, handleLikePost } from '../Posts/button/LikePost'
import { avatarBaseUrl } from '../../services/Constants';

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("posts");
  const [avatarUrl, setAvatarUrl] = useState('');
  const [userPosts, setUserPosts] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [selectedPostIdComments, setSelectedPostIdComments] = useState(null);
  const [content, setContent] = useState('');
  const [selectedPostIdShares, setSelectedPostIdShares] = useState(null);
  const [shares, setShares] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reloadProfile, setReloadProfile] = useState(false);
  const [likePosts, setLikePosts] = useState([]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const responseFollower = await axios.get('/auth/followerCount', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        setFollowerCount(responseFollower.data);

        const responseFollowing = await axios.get('/auth/followingCount', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        setFollowingCount(responseFollowing.data);

        const responsePost = await axios.get('/posts/userCount', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        setPostCount(responsePost.data);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    fetchLikePosts(accessToken, setLikePosts);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const accessToken = localStorage.getItem('accessToken');
      setToken(accessToken);

      if (!accessToken) {
        console.error('Access token not found');
        return;
      }

      try {
        const response = await axios.get('/auth/profile', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        const { avatar } = response.data;
        const formattedAvatar = avatar.startsWith(avatarBaseUrl) ? avatar : `${avatarBaseUrl}${avatar}`;
        setAvatarUrl(formattedAvatar);
        setUserInfo(response.data);
        console.error('Error fetching user posts:', response.data.id);
      } catch (error) {
        setError(error.response.data);
      }
    };

    fetchUserProfile();
  }, [reloadProfile]);

  const handleReloadProfile = () => {
    setReloadProfile(prevState => !prevState);
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get('posts/userList', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    fetchUserPosts();
  }, []);

  const handleCommentButtonClick = async (postId) => {
    setSelectedPostIdComments(postId);
    try {
      const response = await axios.get(`/comments/post/${postId}`);
      setComments(response.data.content);
      handleLike(postId);
      console.log('List comments post:', response.data);
    } catch (error) {
      console.error('Error fetching shares:', error);
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

  const handleLike = async (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, totalLike: post.totalLike + 1 };
      }
      console.log('Like successfull Id-Post:', postId);
      return post;
    });
    setPosts(updatedPosts);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  const updateCommentList = (updatedComments) => {
    setComments(updatedComments);
  };
  const handleInputChange = (event) => {
    setContent(event.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPostIdComments) {
      console.error('Error creating comment: Post ID is missing');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('postId', selectedPostIdComments);
      formData.append('content', content);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      };
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleCommentSubmit(e);
      console.log('Comment successfully post.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setShowAvatarModal(false);
  };

  const openAvatarModal = () => {
    setShowAvatarModal(true);
  };



  function formatDateOfBirth(dateOfBirth) {
    if (!dateOfBirth) return '';

    const dobDate = new Date(dateOfBirth);
    const day = dobDate.getDate();
    const month = dobDate.getMonth() + 1;
    const year = dobDate.getFullYear();

    return `${day}/${month}/${year}`;
  }

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

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!userInfo) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <Header />
      <div style={{ width: '1300px', marginTop: '5rem' }} className="mx-auto">
        <div className="mt-4">
          <div style={{ backgroundColor: 'rgb(240, 242, 245)' }} className="border-gray-200 border rounded-lg overflow-hidden shadow-md">
            <div className="relative h-40">
              <img
                className="w-full h-full object-cover"
                src={`${avatarBaseUrl}${userInfo.background}`}
                alt="Cover Photo"
              />
              <div className="flex absolute bottom-0 right-0  rounded-md px-4 py-2 mr-4 mb-4">
                <EditProfile handleReloadProfile={handleReloadProfile} token={token} />
                <ChangeBackground token={token} setUserInfo={setUserInfo} handleReloadProfile={handleReloadProfile} />
              </div>
            </div>
            <div className="text-center border-gray-200 border-t relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-20">
                <div className="flex justify-center items-center w-44 h-36">
                  <label htmlFor="avatarInput" className="cursor-pointer">
                    <img
                      className="w-44 h-44 object-cover rounded-full shadow-lg"
                      src={`${avatarBaseUrl}${userInfo.avatar}`}
                      alt="Avatar"
                      onClick={openAvatarModal}
                    />
                  </label>
                </div>
              </div>
              <div className="pt-4 w-full mt-16">
                <div className=" justify-between items-center ">
                  <div>
                    <h2 className="font-semibold text-2xl">{userInfo.firstName} {userInfo.lastName}</h2>
                    <p className="text-gray-700">@{userInfo.username}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center relative">
                <div className="flex justify-between w-full pt-2 relative">
                  <p className="text-gray-700 text-l w-full px-2 py-1 pt-2 pb-2 relative border-t-2 border-gray-400">{`Posts: ${postCount}`}</p>
                  <p className="text-gray-700 text-l w-full px-2 py-1 pt-2 pb-2 relative border-t-2 border-l-2 border-gray-400">{`Followers: ${followerCount}`}</p>
                  <p className="text-gray-700 text-l w-full px-2 py-1 pt-2 pb-2 relative border-t-2 border-l-2 border-gray-400">{`Following: ${followingCount}`}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showAvatarModal && (
          <ChangeAvatar token={token} setUserInfo={setUserInfo} handleReloadProfile={handleReloadProfile} closeModal={closeModal} />)}
        {showModal && (
          <div id="success-modal" tabIndex="-1" className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg max-w-md w-full p-10">
              <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 10l3 3 7-7" clipRule="evenodd" />
                </svg>
              </button>
              <div className="text-center">
                {/* Success message content */}
                <svg style={{ color: '#5c6370' }} className="mx-auto mb-4 text-green-500 w-12 h-12 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Update successful!</h3>
                <button onClick={closeModal} className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
        <div style={{}} className="mt-4">
          <div style={{ backgroundColor: 'rgb(240, 242, 245)' }} className="flex border-gray-200 border rounded-lg overflow-hidden shadow-md">
            <div className="w-full justify-between p-4">
              <a
                style={{ marginRight: '50px' }}
                className={`hover:underline cursor-pointer text-m ${selectedTab === "posts" ? 'font-bold' : ''}`}
                onClick={() => setSelectedTab("posts")}
              >
                Posts
              </a>
              <a
                style={{ marginRight: '50px' }}
                className={`hover:underline cursor-pointer text-m ${selectedTab === "photos" ? 'font-bold' : ''}`}
                onClick={() => setSelectedTab("photos")}
              >
                Image
              </a>
              <a
                style={{ marginRight: '50px' }}
                className={`hover:underline cursor-pointer text-m ${selectedTab === "videos" ? 'font-bold' : ''}`}
                onClick={() => setSelectedTab("videos")}
              >
                Video
              </a>
              <a
                style={{ marginRight: '50px' }}
                className={`hover:underline cursor-pointer text-m ${selectedTab === "repository" ? 'font-bold' : ''}`}
                onClick={() => setSelectedTab("repository")}
              >
                Repository
              </a>
            </div>
          </div>

          <div className=" mt-4">
            {selectedTab === "posts" && (
              <div style={{ width: '100%' }} className="flex rounded-lg overflow-hidden ">
                <div style={{ flex: '1' }}>
                  <div className="flex">
                    <div style={{ backgroundColor: 'rgb(240, 242, 245)', width: '35%', marginRight: '2%', padding: '20px', height: '50%' }} className="flex rounded-lg overflow-hidden shadow-md">
                      <div style={{ flex: '1', marginRight: '20px' }}>
                        {userInfo ? (
                          <div>
                            <h1><strong>Information</strong></h1>
                            <div style={{ textAlign: 'center', margin: '10px' }}>
                              <p>Created by NguyenThanhBao</p>
                              <hr className="my-2" />
                            </div>
                            <div style={{ padding: '5px' }}>
                              <p style={{ padding: '5px' }}><strong>Email:</strong> {userInfo.mail}</p>
                              <p style={{ padding: '5px' }}><strong>Gender:</strong> {userInfo.gender ? 'Male' : 'Female'}</p>
                              <p style={{ padding: '5px' }}><strong>Phone Number:</strong> {userInfo.phoneNumber}</p>
                              <p style={{ padding: '5px' }}><strong>Date of Birth:</strong> {formatDateOfBirth(userInfo.dateOfBirth)}</p>
                              <p style={{ padding: '5px' }}><strong>Address:</strong> {userInfo.address}</p>
                            </div>
                          </div>
                        ) : (
                          <p>User not found</p>
                        )}
                      </div>
                    </div>
                    <div style={{ width: '65%' }} className=" rounded-lg overflow-hidden ">
                      <div style={{ flex: '2', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                        {posts.map((post, index) => (
                          <div key={index} className="bg-gray-100 rounded-md p-4 mb-4">
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center">
                                <img src={`${avatarBaseUrl}${post.userId.avatar}`} alt="Avatar" className="w-8 h-8 rounded-full mr-2" />
                                <div>
                                  <p className="text-sm font-medium">{post.userId.firstName} {post.userId.lastName}</p>
                                  <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(post.createAt), { addSuffix: true })}</p>
                                </div>
                              </div>
                              <div className="relative">
                                <button onClick={toggleDropdown} className="rounded-full hover:bg-gray-300 focus:outline-none">
                                  <svg className="w-5 h-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
                                    <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                                  </svg>
                                </button>
                                {isDropdownOpen && (
                                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none">
                                      Save
                                    </button>
                                    <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none">
                                      Update
                                    </button>
                                    <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none">
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-700">{post.body}</p>
                            {post.medias && post.medias.map((media, index) => (
                              <React.Fragment key={index}>
                                {media.publicUrl.endsWith('.mp4') ? (
                                  <video controls src={`${avatarBaseUrl}${media.publicUrl}`} alt={`Media ${index}`} className="w-full object-contain mb-2"></video>
                                ) : (
                                  <img src={`${avatarBaseUrl}${media.publicUrl}`} alt={`Media ${index}`} className="w-full object-contain mb-2" />
                                )}
                              </React.Fragment>
                            ))}
                            <div className="flex justify-between items-center mt-4">
                              <span>{post.totalLike} Like</span>
                              <div className="flex">
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
                            <div className="flex justify-between mt-4">
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
                              <button className="text-green-500 hover:text-gray-700 flex" onClick={() => handleCommentButtonClick(post.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                                </svg>
                                <p>Comment</p>
                              </button>
                              <SharePost postId={post.id} token={token} onShare={handleShare} />
                            </div>
                          </div>
                        ))}
                        {/* Hiển thị modal chứa các comment */}
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
                  </div>
                </div>
              </div>
            )}

            {selectedTab === "photos" && (
              <div style={{ padding: '10px' }} className="flex bg-white rounded-lg overflow-hidden shadow-md">
                <div style={{ flex: '1' }}>
                  <UserImages token={token} />
                </div>
              </div>
            )}

            {selectedTab === "videos" && (
              <div style={{ padding: '10px' }} className="flex bg-white rounded-lg overflow-hidden shadow-md">
                <div style={{ flex: '1' }}>
                  <UserVideos token={token} />
                </div>
              </div>
            )}

            {selectedTab === "repository" && (
              <div style={{ padding: '10px' }} className=" bg-white rounded-lg overflow-hidden shadow-md">
                <div style={{ flex: '1' }}>
                  <Repository token={token} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;