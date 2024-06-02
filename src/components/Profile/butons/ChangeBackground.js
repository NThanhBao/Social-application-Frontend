import React, { useState } from 'react';
import axios from 'axios';

const ChangeBackground = ({ token, setUserInfo, handleReloadProfile  }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const handleChangeBackground = () => {
        setIsModalOpen(true);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            console.error('No file selected.');
            return;
        }
    
        const formData = new FormData();
        formData.append('file', selectedFile);
    
        try {
            const response = await axios.post('/background/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
            setIsModalOpen(false);
            setSelectedFile(null);
            setImagePreview(null);
            // Mở modal thành công
            setIsSuccessModalOpen(true);
            // Cập nhật đường dẫn ảnh bìa mới vào state userInfo
            setUserInfo(userInfo => ({
                ...userInfo,
                background: response.data.newBackgroundUrl
            }));
    
            // Gọi hàm callback để cập nhật thông tin người dùng và load lại phần getprofile
            handleReloadProfile();
        } catch (error) {
            console.error('Error uploading background:', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFile(null);
        setImagePreview(null);
    };

    const closeSuccessModal = () => {
        setIsSuccessModalOpen(false);
    };

    return (
        <>
            <button
                className="bg-blue-100 text-black rounded-md px-4 py-2 text-sm"
                onClick={handleChangeBackground}
            >
                Change Background
            </button>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="max-w-3xl mx-auto bg-white p-8 rounded-md relative">
                        <button onClick={closeModal} className="absolute top-0 right-0 m-2 text-gray-600 hover:text-gray-800">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                        {imagePreview && <img src={imagePreview} alt="Selected Background" className="w-full h-auto mb-4" />}
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        <button className="bg-blue-500 text-white rounded-md px-4 py-2 mt-4 w-full" onClick={handleUpload}>Change</button>
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
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Background updated successfully!</h3>
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

export default ChangeBackground;
