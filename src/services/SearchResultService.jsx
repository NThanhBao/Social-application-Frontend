import axios from 'axios';

export const fetchFollowingUsers = async () => {
    try {
        // Thêm thông tin xác thực vào tiêu đề của yêu cầu
        const headers = {
            Authorization: 'Bearer ' + localStorage.getItem('accessToken') 
        };

        const response = await axios.get('/auth/ListUsers/following', { headers });
        const followingUsers = response.data.map(user => user.id);
        const status = {};
        followingUsers.forEach(id => {
            status[id] = true;
        });
        return status;
    } catch (error) {
        console.error('Error fetching following users:', error);
        throw error;
    }
};

export const toggleFollow = async (id, followingStatus) => {
    try {
        if (followingStatus[id]) {
            // Nếu đã theo dõi, thì gửi yêu cầu unfollow
            await axios.delete(`/auth/unfollow/${id}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
                }
            });
            return { ...followingStatus, [id]: false };
        } else {
            // Nếu chưa theo dõi, thì gửi yêu cầu follow
            await axios.post(`/auth/follow/${id}`, null, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken') // Thay đổi tùy thuộc vào cách xác thực của bạn
                }
            });
            return { ...followingStatus, [id]: true };
        }
    } catch (error) {
        console.error('Error toggling follow status:', error);
        throw error;
    }
};
