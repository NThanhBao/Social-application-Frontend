import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserAltSlash, FaUserCheck } from 'react-icons/fa';
import { avatarBaseUrl } from '../../../services/Constants';
import { useParams } from 'react-router-dom';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [postsCount, setPostsCount] = useState(0);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [userData, setUserData] = useState(null);
    const { userId } = useParams();

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`/admin/allUsers`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (userData) {
          const fetchFollowerCount = async () => {
            try {
              const accessToken = localStorage.getItem('accessToken');
              const username = userData.username;
              const response = await axios.get(`/admin/followerCount/${username}`, {
                headers: {
                  'Authorization': `Bearer ${accessToken}`
                }
              });
              setFollowerCount(response.data);
              console.log(response.data);
            } catch (error) {
              console.error('Error fetching follower count:', error);
            }
          };
    
          const fetchFollowingCount = async () => {
            try {
              const accessToken = localStorage.getItem('accessToken');
              const username = userData.username;
              const response = await axios.get(`/admin/followingCount/${username}`, {
                headers: {
                  'Authorization': `Bearer ${accessToken}`
                }
              });
              console.log(response.data);
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
        const fetchPostsCount = async () => {
          try {
            const response = await axios.get(`/admin/postsCount/${userId}`);
            setPostsCount(response.data);
          } catch (error) {
            console.error('Error fetching posts count:', error);
          }
        };
      
        fetchPostsCount();
      }, [userId]);
      

    const disableUser = async (userId) => {
        try {
            await axios.put(`/admin/${userId}/disable`);
            fetchUsers();
        } catch (error) {
            console.error('Error disabling user:', error);
        }
    };

    const enableUser = async (userId) => {
        try {
            await axios.put(`/admin/${userId}/enable`);
            fetchUsers();
        } catch (error) {
            console.error('Error enabling user:', error);
        }
    };

    const getUserInfo = async (userId) => {
        try {
            const response = await axios.get(`/admin/user/${userId}`);
            const userData = response.data;

            if (userData.avatar) {
                userData.avatarUrl = `${avatarBaseUrl}${userData.avatar}`;
            }

            setSelectedUser(userData);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };


    return (
        <div style={{ marginLeft: '16%' }} className="container mx-auto mt-28 mb-6">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mail</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posts</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Following</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Follower</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enable Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td onClick={() => getUserInfo(user.id)} className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                                <td onClick={() => getUserInfo(user.id)} className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                                <td onClick={() => getUserInfo(user.id)} className="px-6 py-4 whitespace-nowrap">{`${user.firstName} ${user.lastName}`}</td>
                                <td onClick={() => getUserInfo(user.id)} className="px-6 py-4 whitespace-nowrap">{user.mail}</td>
                                <td onClick={() => getUserInfo(user.id)} className="px-6 py-4 whitespace-nowrap">{user.roleType}</td>
                                <td onClick={() => getUserInfo(user.id)} className="px-6 py-4 whitespace-nowrap">{postsCount}</td>
                                <td onClick={() => getUserInfo(user.id)} className="px-6 py-4 whitespace-nowrap">{followerCount}</td>
                                <td onClick={() => getUserInfo(user.id)} className="px-6 py-4 whitespace-nowrap">{followingCount}</td>
                                <td onClick={() => getUserInfo(user.id)} className="px-6 py-4 whitespace-nowrap ">
                                    {user.enableType === 'TRUE' ? (
                                        <span className="flex items-center">
                                            <FaUserCheck className="w-4 h-4 mr-1 text-green-500" />
                                            Enabled
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <FaUserAltSlash className="w-4 h-4 mr-1 text-red-500 " />
                                            Disabled
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.enableType === 'TRUE' ? (
                                        <button onClick={() => disableUser(user.id)} className="text-red-600 hover:text-red-900 hover:scale-105 transition-transform duration-300">Disable</button>
                                    ) : (
                                        <button onClick={() => enableUser(user.id)} className="text-green-600 hover:text-green-900 hover:scale-105 transition-transform duration-300">Enable</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Modal */}
            {showModal && (
                <div className="mt-20 fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <div >
                                            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                                <div className="py-2">
                                                    <dt className="font-medium text-gray-500">ID:</dt>
                                                    <dd className="mt-1">{selectedUser.id}</dd>
                                                </div>
                                                <div className="py-2">
                                                    <dt className="font-medium text-gray-500">Username:</dt>
                                                    <dd className="mt-1">{selectedUser.username}</dd>
                                                </div>
                                                <div className="py-2">
                                                    <dt className="font-medium text-gray-500">Full Name:</dt>
                                                    <dd className="mt-1">{`${selectedUser.firstName} ${selectedUser.lastName}`}</dd>
                                                </div>
                                                <div className="py-2">
                                                    <dt className="font-medium text-gray-500">Mail:</dt>
                                                    <dd className="mt-1">{selectedUser.mail}</dd>
                                                </div>
                                                <div className="py-2">
                                                    <dt className="font-medium text-gray-500">Role Type:</dt>
                                                    <dd className="mt-1">{selectedUser.roleType}</dd>
                                                </div>
                                                <div className="py-2">
                                                    <dt className="font-medium text-gray-500">Enable Type:</dt>
                                                    <dd className="mt-1">{selectedUser.enableType}</dd>
                                                </div>
                                                <div className="py-2">
                                                    <dt className="font-medium text-gray-500">Gender:</dt>
                                                    <dd className="mt-1">{selectedUser.gender ? 'Male' : 'Female'}</dd>
                                                </div>
                                                <div className="py-2">
                                                    <dt className="font-medium text-gray-500">Phone Number:</dt>
                                                    <dd className="mt-1">{selectedUser.phoneNumber}</dd>
                                                </div>
                                                <div className="py-2">
                                                    <dt className="font-medium text-gray-500">Date of Birth:</dt>
                                                    <dd className="mt-1">{new Date(selectedUser.dateOfBirth).toLocaleDateString()}</dd>
                                                </div>
                                                <div className="py-2">
                                                    <dt className="font-medium text-gray-500">Address:</dt>
                                                    <dd className="mt-1">{selectedUser.address}</dd>
                                                </div>
                                                <div className="flex py-2 col-span-2">
                                                    <dt className="font-medium text-gray-500">Avatar:</dt>
                                                    <dd className="mt-1">
                                                        <img style={{borderRadius:'50%'}} className='h-20 w-20' src={`${avatarBaseUrl}${selectedUser.avatar}`} alt="Avatar" />
                                                    </dd>
                                                </div>
                                                <div className="py-2 col-span-2">
                                                    <dt className="font-medium text-gray-500">Background:</dt>
                                                    <dd className="mt-1 ">
                                                        <img className='h-40 w-full ' src={`${avatarBaseUrl}${selectedUser.background}`} alt="Background" />
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button onClick={() => setShowModal(false)} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UserList;