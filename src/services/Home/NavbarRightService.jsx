import axios from 'axios';
import { Url } from '../Constants';

// Hàm xử lý khi người dùng click vào nút Follow
export const handleFollowUser = async (followingUserId, setIsLoading, fetchUnfollowedUsers, setUnfollowedUsers) => {
    try {
        setIsLoading(true); // Bắt đầu loading
        const token = localStorage.getItem('accessToken');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        await axios.post(`${Url}/auth/follow/${followingUserId}`, {}, config);
        // Sau khi gửi yêu cầu theo dõi thành công, cập nhật lại danh sách người dùng
        await fetchUnfollowedUsers(setUnfollowedUsers); // Đảm bảo bạn đã truyền hàm setUnfollowedUsers vào đây
    } catch (error) {
        console.error('Error following user:', error);
    } finally {
        setIsLoading(false); // Kết thúc loading
    }
};

// Hàm fetch danh sách người dùng chưa được theo dõi
export const fetchUnfollowedUsers = async (setUnfollowedUsers) => {
    try {
        const token = localStorage.getItem('accessToken'); // Lấy token từ local storage
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const response = await axios.get(`${Url}/auth/ListUsers/unfollowed`, config);
        setUnfollowedUsers(response.data);
    } catch (error) {
        console.error('Error fetching unfollowed users:', error);
    }
};