import axios from 'axios';
import { Url } from '../Constants';

export const sendEmail = async (email) => {
    try {
        const formData = new FormData();
        formData.append('email', email);

        const response = await axios.post(`${Url}/reset-password/send-mail`, formData);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Error sending email:', response.statusText);
        }
    } catch (error) {
        throw error;
    }
};

export const confirmOtp = async (email, otp, newPassword) => {
    try {
        const formData = new FormData();
        formData.append('mail', email);
        formData.append('otp', otp);
        formData.append('newPassword', newPassword);

        const response = await axios.post('/reset-password/confirm-password', formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
