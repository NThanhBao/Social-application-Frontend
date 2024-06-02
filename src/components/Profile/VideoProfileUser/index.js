import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { avatarBaseUrl } from '../../../services/Constants';

const UserVideos = ({ token }) => {
    const [userVideos, setUserVideos] = useState([]);

    useEffect(() => {
        const fetchUserVideos = async () => {
            try {
                const response = await axios.get('/media/videos', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserVideos(response.data);
            } catch (error) {
                console.error('Error fetching user videos:', error);
            }
        };

        if (token) { // Kiểm tra xem token có tồn tại không trước khi gọi API
            fetchUserVideos();
        }
    }, [token]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {userVideos.map((video) => (
                    <div key={video.id} className=" overflow-hidden rounded-lg shadow-lg">
                        <video controls src={`${avatarBaseUrl}${video.publicUrl}`} alt={video.baseName} className="w-full h-auto" />
                        <div className="p-4">
                            <p className="text-sm text-center text-gray-500">Created at: {new Date(video.createAt).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserVideos;
