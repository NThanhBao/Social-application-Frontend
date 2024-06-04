import axios from 'axios';

export const fetchLikeComments = async (accessToken, setLikeComments) => {
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
        const likeCommentsIds = response.data.map(reaction => reaction.objectId);
        setLikeComments(likeCommentsIds);
    } catch (error) {
        console.error('Error fetching liked posts:', error);
    }
};

export const handleLikeComments = async (id, objectId, accessToken, likeComments, setLikeComments, setComments) => {
    try {
        const isLiked = likeComments.includes(objectId);
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        if (isLiked) {
            await axios.delete(`/reactions/${objectId}`, config);
            console.log('Bạn đã hủy tương tác bình luận: ', objectId);
        } else {
            await axios.post(`/reactions/Comments/${objectId}`, { type: 'LOVE' }, config);
            console.log('Bạn đã tương tác binh fluaanj: ', objectId);
        }

        setLikeComments(prevLikePosts => {
            const updatedLikeComments = isLiked
                ? prevLikePosts.filter(id => id !== objectId)
                : [...prevLikePosts, objectId];
            return updatedLikeComments;
        });

        setComments(prevPosts =>
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