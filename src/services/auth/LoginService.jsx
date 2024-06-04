import { useState } from 'react';
import axios from 'axios';
import { Url } from '../Constants';

const LoginService = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username) {
            setErrorMessage('Vui lòng nhập tên người dùng ');
            return;
        }
        if (!formData.password) {
            setErrorMessage('Vui lòng nhập mật khẩu.');
            return;
        }

        try {
            const response = await axios.post(`${Url}/auth/login`, formData);
            const { token, userInfo } = response.data;
            const { role } = userInfo;

            // Lưu token và role vào localStorage
            localStorage.setItem('accessToken', token);
            localStorage.setItem('userRole', role);

            setShowModal(true);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage('Sai tài khoản hoặc mật khẩu.');
            } else if (error.response && error.response.status === 404) {
                setErrorMessage('Tài khoản không tồn tại.');
            } else if (error.response && error.response.status === 403) {
                setErrorMessage('Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ với quản trị viên để biết thêm chi tiết.');
            }
        }
    };

    const handleRegisterClick = () => {
        window.location.href = '/register';
    };

    const closeModal = () => {
        setShowModal(false);
        const role = localStorage.getItem('userRole');
        if (role === 'ADMIN') {
            window.location.href = '/Dashboard';
        } else {
            window.location.href = '/home';
        }
    };

    return { formData, errorMessage, showModal, handleChange, handleSubmit, handleRegisterClick, closeModal };
};

export default LoginService;
