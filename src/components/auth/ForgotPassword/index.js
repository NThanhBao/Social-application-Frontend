import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/ForgotPassword.css';
import { sendEmail, confirmOtp } from '../../../services/auth/ForgotPasswordService';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [otp, setOtp] = useState('');
    const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Bắt đầu loading
        try {
            await sendEmail(email);
            setShowOtpForm(true);
        } catch (error) {
            console.error('Error sending email:', error);
        } finally {
            setIsLoading(false); // Kết thúc loading sau khi hoàn thành xử lý yêu cầu
        }
    };
    const handleSubmitOtp = async (e) => {
        e.preventDefault();
        try {
            setShowOtpForm(false);
            setShowNewPasswordForm(true);
        } catch (error) {
            console.error(error); // Xử lý lỗi
        }
    };
    const handleSubmitNewPassword = async (e) => {
        e.preventDefault();
        try {
            await confirmOtp(email, otp, newPassword);
            setShowModal(true);
        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 3000);
        }
    };
    const closeModal = () => {
        setShowModal(false);
        window.location.href = '/login';
    };
    const handleGoBackToEmail = () => {
        setShowOtpForm(false);
        setEmail('');
    };
    const handleGoBackToOtp = () => {
        setShowNewPasswordForm(false);
        setOtp('');
    };
    return (
        <div>
            <div className="forgot-password-container" style={{ marginTop: '10%' }}>
                {!showOtpForm && !showNewPasswordForm && (
                    <form className="max-w-sm mx-auto" style={{ padding: '1rem' }} onSubmit={handleSubmitEmail}>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="name@flowbite.com"
                            required
                        />
                        <button
                            type="submit"
                            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-20 py-3 text-center me-2 mb-2"
                            style={{ width: '100%', marginTop: '20px' }}
                            disabled={isLoading} // Disable nút khi đang loading
                        >
                            {isLoading ? ( // Hiển thị nội dung "Loading" khi isLoading true
                                <>
                                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                    </svg>
                                    Loading...
                                </>
                            ) : (
                                'Send email'
                            )}
                        </button>
                    </form>
                )}

                {showOtpForm && (
                    <form className="max-w-sm mx-auto" style={{ padding: '1rem' }} onSubmit={handleSubmitOtp}>
                        <h2 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Forgot Password</h2>
                        <p>Enter the otp code sent to your email.</p>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Enter OTP"
                            required
                        />
                        <button
                            type="submit"
                            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-20 py-3 text-center me-2 mb-2"
                            style={{ width: '100%', marginTop: '20px' }}>
                            Submit OTP
                        </button>
                        <button
                            type="button"
                            onClick={handleGoBackToEmail}
                            className="text-gray-700 border border-gray-300 hover:bg-gray-100 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-300 focus:ring-opacity-50 font-medium rounded-lg text-sm px-20 py-3 text-center mt-2">
                            Go back
                        </button>
                    </form>
                )}

                {showNewPasswordForm && (
                    <form className="max-w-sm mx-auto" style={{ padding: '1rem' }} onSubmit={handleSubmitNewPassword}>
                        <h2 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Forgot Password</h2>
                        <p>Enter your new password.</p>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Enter New Password"
                            required
                        />
                        <button
                            type="submit"
                            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-20 py-3 text-center me-2 mb-2"
                            style={{ width: '100%', marginTop: '20px' }}
                            disabled={isLoading} // Disable nút khi đang loading
                        >
                            {isLoading ? ( // Hiển thị nội dung "Loading" khi isLoading true
                                <>
                                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                    </svg>
                                    Loading...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={handleGoBackToOtp}
                            className="text-gray-700 border border-gray-300 hover:bg-gray-100 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-300 focus:ring-opacity-50 font-medium rounded-lg text-sm px-20 py-3 text-center mt-2">
                            Go back
                        </button>
                    </form>
                )}
                {showModal && (
                    <div id="popup-modal" tabIndex="-1" className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg max-w-md w-full p-10">
                            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center">
                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    {/* Thay đổi mã SVG thành dấu tick */}
                                    <path fillRule="evenodd" d="M5 10l3 3 7-7" clipRule="evenodd" />
                                </svg>
                            </button>
                            <div className="text-center">
                                <svg style={{ color: '#5c6370' }} className="mx-auto mb-4 text-green-500 w-12 h-12 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg>
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Successfully</h3>
                                <button onClick={closeModal} className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <p className="back-to-login">
                    Remember your password? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
}

export default ForgotPassword;
