import { useState, useEffect } from 'react';
import axios from 'axios';
import { Url } from '../Constants';

const FollowService = () => {
    const [users, setUsers] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage] = useState(9);
    const [showFollowing, setShowFollowing] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) {
                    console.error('Access token not found');
                    return;
                }

                const followingResponse = await axios.get(`${Url}/auth/ListUsers/following`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setUsers(followingResponse.data);

                const followersResponse = await axios.get(`${Url}/auth/ListUsers/follower`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setFollowers(followersResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleUnfollow = async (id) => {
        try {
            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                console.error('Access token not found');
                return;
            }

            await axios.delete(`${Url}/auth/unfollow/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setShowModal(false);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleConfirm = () => {
        if (selectedUserId !== null) {
            handleUnfollow(selectedUserId);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    const handleUnfollowClick = (id) => {
        setSelectedUserId(id);
        setShowModal(true);
    };

    const handlePageClick = ({ selected: selectedPage }) => {
        setCurrentPage(selectedPage);
    };

    const toggleShow = () => {
        setShowFollowing((prevShowFollowing) => !prevShowFollowing);
        setCurrentPage(0);
    };

    return { users, followers, currentPage, perPage, showFollowing, showModal, selectedUserId, handleUnfollow, closeModal, handleConfirm, handleCancel, handleUnfollowClick, handlePageClick, toggleShow };
};

export default FollowService;
