import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../Header'
import CreateComment from '../Posts/CreateComment';
import ShowComments from '../Posts/ShowComments';
import ShowListUserShare from '../Posts/ShowListUserSharePost';
import SharePost from '../Posts/button/SharesPost';
import { formatDistanceToNow } from 'date-fns';
import UserImages from './ImagesProfileUser';
import { fetchLikePosts, handleLikePost } from '../Posts/button/LikePost'
import UserVideos from './VideoProfileUser';
import '../../styles/style.css';
import { avatarBaseUrl } from '../../services/Constants';
function ProfileUser() {
  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("posts");
  const [followingStatus, setFollowingStatus] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [selectedPostIdComments, setSelectedPostIdComments] = useState(null);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [selectedPostIdShares, setSelectedPostIdShares] = useState(null);
  const [shares, setShares] = useState([]);
  const [token, setToken] = useState('');
  const [content, setContent] = useState('');
  const [likePosts, setLikePosts] = useState([]);

  useEffect(() => {
    const fetchFollowingUsers = async () => {
      try {
        const headers = {
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        };

        const response = await axios.get('/auth/ListUsers/following', { headers });
        const followingUsers = response.data.map(user => user.id);
        const status = {};
        followingUsers.forEach(id => {
          status[id] = true;
        });
        setFollowingStatus(status);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching following users:', error);
        setIsLoading(false);
      }
    };

    fetchFollowingUsers();
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    fetchLikePosts(accessToken, setLikePosts);
  }, []);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`/posts/userList/${userId}`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    fetchUserPosts();
  }, [userId]);
  const handleInputChange = (event) => {
    setContent(event.target.value);
  };
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPostIdComments) {
      console.error('Error creating comment: Post ID is missing');
      return;
    }
    const fetchComments = async (postId) => {
      try {
        const response = await axios.get(`/comments/post/${postId}`);
        setComments(response.data.content);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

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
  const updateCommentList = (updatedComments) => {
    setComments(updatedComments);
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
      const response = await axios.get(`/shares/post/${postId}/shared`); // Sửa endpoint gọi API
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
  const handleToggleFollow = async (id) => {
    try {
      if (followingStatus[id]) {
        await axios.delete(`/auth/unfollow/${id}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken')
          }
        });
        setFollowingStatus(prevState => ({
          ...prevState,
          [id]: false
        }));
      } else {
        // Nếu chưa theo dõi, thì gửi yêu cầu follow
        await axios.post(`/auth/follow/${id}`, null, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken')
          }
        });
        setFollowingStatus(prevState => ({
          ...prevState,
          [id]: true
        }));
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8083/auth/user/${userId}`);
        setUserData(response.data);
        setIsLoading(false);

        const isFollowing = response.data.isFollowing;
        setFollowingStatus(isFollowing);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);


  useEffect(() => {
    const fetchUserProfile = async () => {
      const accessToken = localStorage.getItem('accessToken');
      setToken(accessToken);
      if (!accessToken) {
        console.error('Access token not found');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/auth/profile', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
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
  }, []);

  useEffect(() => {
    if (userData) {
      const fetchFollowerCount = async () => {
        try {
          const accessToken = localStorage.getItem('accessToken');
          const username = userData.username;
          const response = await axios.get(`http://localhost:8083/auth/followerCount/${username}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          setFollowerCount(response.data);
        } catch (error) {
          console.error('Error fetching follower count:', error);
        }
      };

      const fetchFollowingCount = async () => {
        try {
          const accessToken = localStorage.getItem('accessToken');
          const username = userData.username;
          const response = await axios.get(`http://localhost:8083/auth/followingCount/${username}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          setFollowingCount(response.data);
        } catch (error) {
          console.error('Error fetching following count:', error);
        }
      };

      fetchFollowerCount();
      fetchFollowingCount();
    }
  }, [userData]);

  useEffect(() => {
    const fetchPostCount = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(`/posts/userCount/${userId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setPostCount(response.data);
      } catch (error) {
        console.error('Error fetching post count:', error);
      }
    };

    fetchPostCount();
  }, [userId]);

  const handleCancel = () => {
    setShowModal(false); // Đóng modal khi hủy bỏ
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleConfirm = async () => {
    try {

      closeModal();
    } catch (error) {
      console.error('Error confirming unfollow:', error);
    }
  };
  function formatDateOfBirth(dateOfBirth) {
    if (!dateOfBirth) return '';

    const dobDate = new Date(dateOfBirth);

    const day = dobDate.getDate();
    const month = dobDate.getMonth() + 1;
    const year = dobDate.getFullYear();


    return `${day}/${month}/${year}`;
  }


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
                src={`${avatarBaseUrl}${userData.background}`}
                alt="Cover Photo"
              />
            </div>
            
            <div className="text-center border-gray-200 border-t relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-20">
                <div className="flex justify-center items-center w-44 h-36">
                  <label htmlFor="avatarInput" className="cursor-pointer">
                    <img
                      className="w-44 h-44 object-cover rounded-full shadow-lg"
                      src={`${avatarBaseUrl}${userData.avatar}`}
                      alt="Avatar"
                    />
                  </label>
                </div>
              </div>
              <div className="pt-4 w-full mt-16">
                <div className=" justify-between items-center ">
                  <div>
                    <h2 className="font-semibold text-2xl">{userData.firstName} {userData.lastName}</h2>
                    <p className="text-gray-700">@{userData.username}</p>
                  </div>
                  <div className="flex absolute bottom-28 right-0  rounded-md px-4 py-2 mr-4 mb-4">
                <a href="#" className="py-2 mr-4 px-4 ms-2 text-m font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Message</a>
                <button
                  onClick={() => handleToggleFollow(userData.id)}
                  className={`button ${followingStatus[userData.id] ? 'button-red' : 'button-blue'}`}>
                  {followingStatus[userData.id] ? 'Unfollow' : 'Follow'}
                </button>
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

        <div className="mt-4">
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
                Images
              </a>
              <a
                style={{ marginRight: '50px' }}
                className={`hover:underline cursor-pointer text-m ${selectedTab === "videos" ? 'font-bold' : ''}`}
                onClick={() => setSelectedTab("videos")}
              >
                Video
              </a>
            </div>
          </div>

          <div className="flex mt-4">
            {selectedTab === "posts" && (
              <div style={{ width: '100%' }} className="flex rounded-lg overflow-hidden">
                <div style={{ flex: '1' }}>
                  <div className="flex  ">
                    <div style={{ backgroundColor: 'rgb(240, 242, 245)', width: '45%', marginRight: '2%', padding: '20px', height: '50%' }} className="flex rounded-lg overflow-hidden">
                      <div style={{ flex: '1', marginRight: '20px' }}>
                        {userData ? (
                          <div>
                            <h1><strong>Information</strong></h1>
                            <div style={{ textAlign: 'center', margin: '10px' }}>
                              <p>Created by NguyenThanhBao</p>
                              <hr className="my-2" />
                            </div>
                            <div style={{ padding: '5px' }}>
                              <p style={{ padding: '5px' }}><strong>Email:</strong> {userData.mail}</p>
                              <p style={{ padding: '5px' }}><strong>Gender:</strong> {userData.gender ? 'Nam' : 'Nữ'}</p>
                              <p style={{ padding: '5px' }}><strong>Phone Number:</strong> {userData.phoneNumber}</p>
                              <p style={{ padding: '5px' }}><strong>Date of Birth:</strong> {formatDateOfBirth(userData.dateOfBirth)}</p>
                              <p style={{ padding: '5px' }}><strong>Address:</strong> {userData.address}</p>
                            </div>
                          </div>
                        ) : (
                          <p>User not found</p>
                        )}
                      </div>
                    </div>

                    <div style={{ width: '65%' }} className="rounded-lg overflow-hidden">
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
                                <button className="rounded-full hover:bg-gray-300 focus:outline-none">
                                  <svg className="w-5 h-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
                                    <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                                  </svg>
                                </button>
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
                            <div className="flex justify-between mt-4">
                              <button className='text-red-500 hover:text-gray-700 flex' onClick={() => handleLikePost(post.reactionsId, post.id, token, likePosts, setLikePosts, setPosts)}>
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
                              <button className="text-green-500 hover:text-gray-700" onClick={() => handleCommentButtonClick(post.id)}>Comment</button>
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
                  </div>
                </div>
              </div>
            )}

            {selectedTab === "photos" && (
              <div style={{ padding: '10px' }} className="flex bg-white rounded-lg overflow-hidden shadow-md">
                <div style={{ flex: '1' }}>
                  <UserImages userId={userId} />
                </div>
              </div>
            )}

            {selectedTab === "videos" && (
              <div style={{ padding: '10px' }} className="flex bg-white rounded-lg overflow-hidden shadow-md">
                <div style={{ flex: '1' }}>
                  <UserVideos userId={userId} />
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Modal xác nhận */}
        {showModal && (
          <div id="popup-modal" tabIndex="-1" className="fixed top-0 right-0 bottom-0 left-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
            <div className="relative p-4 w-full max-w-md">
              <div className="relative bg-white rounded-lg shadow">
                <button type="button" onClick={closeModal} className="absolute top-3 right-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center">
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="p-4 md:p-5 text-center">
                  <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <h3 className="mb-5 text-lg font-normal text-gray-500">Are you sure you want to unfollow this user?</h3>
                  <button onClick={handleConfirm} type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                    Yes, I'm sure
                  </button>
                  <button onClick={handleCancel} type="button" className="ml-3 py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
                    No, cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileUser;
