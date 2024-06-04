// NavbarLogic.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { avatarBaseUrl , Url } from '../Constants';
const NavbarService = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [token, setToken] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            setToken(accessToken);
        }
        // else{
        //     window.location.href = '/login';
        // }
    }, []);

    useEffect(() => {
        if (token) {
            fetchUserProfile(token);
        }
    }, [token]);

    const handleSearch = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await axios.get(`${Url}/auth/search?fullName=${searchQuery}`, config);
            localStorage.setItem('searchResult', JSON.stringify(response.data));
            window.location.href = '/search-results';
        } catch (error) {
            console.error('Error during search:', error);
        }
    };

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const fetchUserProfile = async (accessToken) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };

            const response = await axios.get('http://localhost:8083/auth/profile', config);
            const { firstName, lastName, avatar } = response.data;
            setFirstName(firstName);
            setLastName(lastName);

            const formattedAvatar = avatar.startsWith(avatarBaseUrl) ? avatar : `${avatarBaseUrl}${avatar}`;
            setAvatarUrl(formattedAvatar);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const handleFollowersClick = () => {
        window.location.href = '/followers-page';
    };

    const handleProfileClick = (event) => {
        event.preventDefault();
        window.location.href = "/profile-page";
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setToken('');
        window.location.href = '/login';
    };

    return { searchQuery, setSearchQuery, token, firstName, lastName, avatarUrl, isDropdownOpen, handleSearch, handleChange, handleKeyPress, toggleDropdown, handleFollowersClick, handleProfileClick, handleLogout };
};

export default NavbarService;
