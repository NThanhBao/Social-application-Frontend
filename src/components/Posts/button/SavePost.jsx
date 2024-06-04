import axios from 'axios';

export const fetchSavedPosts = async (accessToken, setSavedPosts) => {
    try {
        if (!accessToken) {
            throw new Error('Access token is missing.');
        }

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const response = await axios.get('/favorites/all-posts', config);
        const savedPostsIds = response.data.map(post => post.postsID);
        setSavedPosts(savedPostsIds);
    } catch (error) {
        console.error('Error fetching saved posts:', error);
    }
};

export const handleSavePost = async (postId, accessToken, savedPosts, setSavedPosts) => {
    try {
        // Kiểm tra xem bài viết đã được lưu hay chưa
        const isSaved = savedPosts.includes(postId);
        if (isSaved) {
            // Nếu đã lưu, thì gọi API để hủy lưu bài viết
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };
            await axios.delete(`/favorites/delete/${postId}`, config);
        } else {
            // Nếu chưa lưu, thì gọi API để lưu bài viết
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };
            await axios.post(`/favorites/${postId}`, null, config);
        }

        // Cập nhật lại danh sách bài viết đã lưu sau khi thay đổi
        setSavedPosts(prevSavedPosts => {
            const updatedSavedPosts = isSaved
                ? prevSavedPosts.filter(id => id !== postId)
                : [...prevSavedPosts, postId];
            return updatedSavedPosts;
        });
    } catch (error) {
        console.error('Error toggling save status:', error);
    }
};
