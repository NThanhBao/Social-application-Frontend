import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { avatarBaseUrl } from '../../../services/Constants';

const UserImages = ({ userId }) => { // Không nhận token từ props
    const [userImages, setUserImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchUserImages = async () => {
            try {
                const response = await axios.get(`/media/user/${userId}/images`);
                setUserImages(response.data);

                // Log dữ liệu nhận được từ API
                console.log("User images data:", response.data);
            } catch (error) {
                console.error('Error fetching user images:', error);
            }
        };

        // Fetch dữ liệu ngay khi component được render
        fetchUserImages();
    }, [userId]); // Chỉ cần userId trong dependency array

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    };

    const handleOutsideClick = (event) => {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {userImages.map((image) => (
                    <div key={image.id} className="h-fit overflow-hidden rounded-lg shadow-lg">
                        <img
                            src={`${avatarBaseUrl}${image.publicUrl}`}
                            alt={image.baseName}
                            className="w-full h-auto cursor-pointer"
                            onClick={() => handleImageClick(`${avatarBaseUrl}${image.publicUrl}`)}
                        />
                        <div className="p-4">
                            <p className="text-sm text-center text-gray-500">Created at: {new Date(image.createAt).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleOutsideClick}>
                    <div className="max-w-3xl mx-auto overflow-hidden" onKeyDown={handleKeyDown} tabIndex={0}>
                        <img src={selectedImage} alt="Selected Image" />
                        <button className="absolute top-0 right-0 text-white" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserImages;
