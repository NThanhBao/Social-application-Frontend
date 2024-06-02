import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProfile = ({ handleReloadProfile, token, showModal }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // Thêm state mới
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        gender: true,
        phoneNumber: '',
        dateOfBirth: '',
        address: '',
        mail: ''
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const userProfile = response.data;
                setFormData({
                    firstName: userProfile.firstName || '',
                    lastName: userProfile.lastName || '',
                    gender: userProfile.gender || true,
                    phoneNumber: userProfile.phoneNumber || '',
                    dateOfBirth: userProfile.dateOfBirth || '',
                    address: userProfile.address || '',
                    mail: userProfile.mail || ''
                });
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
                setError('Failed to fetch user profile');
            }
        };

        fetchUserProfile();
    }, [token]);

    const handleEditProfile = () => {
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/auth/update`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                handleReloadProfile();
                closeModal();
                setIsSuccessModalOpen(true); // Hiển thị modal thành công
            } else {
                console.error('Failed to update user profile');
                setError('Failed to update user profile');
            }
        } catch (error) {
            console.error('Failed to update user profile:', error);
            setError('Failed to update user profile');
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const closeSuccessModal = () => {
        setIsSuccessModalOpen(false);
    };

    return (
        <>
            <button
                className="bg-blue-500 text-white rounded-md px-4 py-2 mr-2 text-sm"
                onClick={handleEditProfile}
            >
                Edit profile
            </button>
            {isModalOpen && (
                <div id="crud-modal" tabIndex="-1" aria-hidden="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-lg font-medium text-gray-900 mb-4 ">Edit User Information</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="col-span-2">
                                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                                                    <input type="text" name="firstName" id="firstName" autoComplete="given-name" value={formData.firstName} onChange={handleChange} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                                                </div>
                                                <div className="col-span-2">
                                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                                                    <input type="text" name="lastName" id="lastName" autoComplete="family-name" value={formData.lastName} onChange={handleChange} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                                                </div>
                                                <div className="col-span-2 sm:col-span-1">
                                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                                                    <select
                                                        id="gender"
                                                        name="gender"
                                                        value={formData.gender.toString()}
                                                        onChange={handleChange}
                                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                    >
                                                        <option value="true">Male</option>
                                                        <option value="false">Female</option>
                                                    </select>
                                                </div>
                                                <div className="col-span-2 sm:col-span-1">
                                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                                    <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                                                </div>
                                                <div className="col-span-2">
                                                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                                    <input type="date" name="dateOfBirth" id="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                                                </div>
                                                <div className="col-span-2">
                                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                                    <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows="3" className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"></textarea>
                                                </div>
                                                <div className="col-span-2">
                                                    <label htmlFor="mail" className="block text-sm font-medium text-gray-700">Email</label>
                                                    <input type="email" name="mail" id="mail" autoComplete="email" value={formData.mail} onChange={handleChange} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                                        Save
                                    </button>
                                    <button onClick={closeModal} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {isSuccessModalOpen && (
                <div id="popup-modal" tabIndex="-1" className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg max-w-md w-full p-10">
                        <button onClick={closeSuccessModal} className="absolute top-3 right-3 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center">
                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 10l3 3 7-7" clipRule="evenodd" />
                            </svg>
                        </button>
                        <div className="text-center">
                            <svg style={{ color: '#5c6370' }} className="mx-auto mb-4 text-green-500 w-12 h-12 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                            </svg>
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Profile updated successfully!</h3>
                            <button onClick={closeSuccessModal} className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditProfile;
