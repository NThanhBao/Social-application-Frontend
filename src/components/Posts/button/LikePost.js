import axios from 'axios';

export const fetchLikePosts = async (accessToken, setLikePosts) => {
    try {
        if (!accessToken) {
            throw new Error('Access token is missing.');
        }

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const response = await axios.get('/reactions/all-posts&comments', config);
        const likePostsIds = response.data.map(reaction => reaction.objectId);
        setLikePosts(likePostsIds);
    } catch (error) {
        console.error('Error fetching liked posts:', error);
    }
};

export const handleLikePost = async (id, objectId, accessToken, likePosts, setLikePosts, setPosts) => {
    try {
        const isLiked = likePosts.includes(objectId);
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        if (isLiked) {
            await axios.delete(`/reactions/${objectId}`, config);
            console.log('Bạn đã hủy tương tác bài viết: ', objectId);
        } else {
            await axios.post(`/reactions/Posts/${objectId}`, { type: 'LOVE' }, config);
            console.log('Bạn đã tương tác bài viết: ', objectId);
        }

        setLikePosts(prevLikePosts => {
            const updatedLikePosts = isLiked
                ? prevLikePosts.filter(id => id !== objectId)
                : [...prevLikePosts, objectId];
            return updatedLikePosts;
        });

        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post.id === objectId) {
                    const updatedLikes = isLiked ? post.totalLike - 1 : post.totalLike + 1;
                    return { ...post, totalLike: updatedLikes };
                }
                return post;
            })
        );

    } catch (error) {
        console.error('Error toggling like status:', error);
    }
};