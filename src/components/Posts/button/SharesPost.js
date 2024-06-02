import React from 'react';
import axios from 'axios';

const SharePost = ({ postId, token, onShare }) => {
    const handleShareButtonClick = async () => {
        try {
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            await axios.post(`/shares/post/${postId}`, {}, config);
            onShare(postId); // Gọi hàm onShare khi chia sẻ thành công
        } catch (error) {
            console.error('Error sharing post:', error);
        }
    };

    return (
        <button className='text-gray-500 hover:text-gray-700 flex hover:scale-105 transition-transform duration-300' onClick={handleShareButtonClick}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
            </svg>
            <p>Share</p>
        </button>
    );
};

export default SharePost;
