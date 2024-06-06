import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { avatarBaseUrl, Url } from '../../../../services/Constants';
function Profile() {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const [token, setToken] = useState('');
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [postCount, setPostCount] = useState(0);
    const [loading, setLoading] = useState(false);

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
        const fetchUserProfile = async () => {
            const accessToken = localStorage.getItem('accessToken');
            setToken(accessToken);
            if (!accessToken) {
                console.error('Access token not found');
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get('/auth/profile', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setUserInfo(response.data);
                console.error('Error fetching user posts:', response.data.id);
            } catch (error) {
                setError(error.response.data);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);


    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (!userInfo) {
        return <div className="text-gray-500">Loading...</div>;
    }


    return (
        <div className="w-full mt-4 bg-gray-100 min-h-screen flex items-start">
            <div className="max-w-lg w-full bg-white shadow-lg rounded-lg">
                {loading ? (
                    <div className="flex justify-center  items-center animate__animated animate__fadeIn">
                        <p>Loading...</p>
                    </div>
                ) : (
                    <div style={{ maxHeight: '78vh', overflowY: 'auto' }}>
                        <div style={{ backgroundColor: 'rgb(240, 242, 245)' }} className="border-gray-200 border rounded-lg overflow-hidden shadow-md">
                            <div className="relative h-40">
                                <img
                                    className="w-full h-full object-cover"
                                    src={`${avatarBaseUrl}${userInfo.background}`}
                                    alt="Cover Photo"
                                />
                            </div>
                            <div className="text-center border-gray-200 border-t relative">
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-20">
                                    <div className="flex justify-center items-center w-44 h-36">
                                        <label className="cursor-pointer">
                                            <img
                                                className="w-40 h-40 object-cover rounded-full shadow-lg"
                                                src={`${avatarBaseUrl}${userInfo.avatar}`}
                                                alt="Avatar"
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="pt-4 w-full mt-16">
                                    <div className=" justify-between items-center ">
                                        <div>
                                            <h2 className="font-semibold text-xl">{userInfo.firstName} {userInfo.lastName}</h2>
                                            <p className="text-gray-700 text-l">@{userInfo.username}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center relative">
                                    <div className="flex justify-between w-full pt-2 relative">
                                        <p className="text-gray-700 text-sm w-full px-2 py-1 pt-2 pb-2 relative border-t-2 border-gray-400">{`Posts: ${postCount}`}</p>
                                        <p className="text-gray-700 text-sm w-full px-2 py-1 pt-2 pb-2 relative border-t-2 border-l-2 border-gray-400">{`Followers: ${followerCount}`}</p>
                                        <p className="text-gray-700 text-sm w-full px-2 py-1 pt-2 pb-2 relative border-t-2 border-l-2 border-gray-400">{`Following: ${followingCount}`}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

}

export default Profile;
