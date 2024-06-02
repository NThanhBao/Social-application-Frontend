import React from 'react';
import LoginService from '../../../services/auth/LoginService';
import { FaGooglePlusG, FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import './styleLogin.css';

function LoginForm() {
    const { formData, errorMessage, showModal, handleChange, handleSubmit, handleRegisterClick, closeModal } = LoginService();
    return (
        <div style={{ alignItems: 'center', paddingTop: '10%' }}>
            <div style={{ backgroundColor: '#f0f2f5', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }} className="w-full max-w-4xl bg-white border border-gray-200 rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700 mx-auto flex flex-col md:flex-row ">

                <div className="relative hidden md:block md:order-2 md:ml-4">
                    <div style={{ borderBottomRightRadius: '50%', borderTopLeftRadius: '50%', WebkitBorderTopRightRadius: '0.5rem' }} className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg">
                        <div className="flex justify-center items-center h-full">
                            <div className="toggle-container text-center">
                                <div className="toggle">
                                    <div className="toggle-panel">
                                        <h1 className='font-bold text-2xl text-white'>Hello, Friend!</h1>
                                        <p className=' text-white'>Register with your personal details to use all of site features</p>
                                        <button
                                            className="text-white mt-6 bg-gradient-to-br from-white to-blue-700 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-700 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-20 py-3 text-center me-2 mb-2"
                                            onClick={handleRegisterClick} >Sign Up</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ paddingRight: '500px' }}></div>
                </div>

                <div className="w-full p-10">
                    <form className="space-y-6" action="#">
                        <h5 className="text-center font-bold text-xl text-gray-900 dark:text-white">Sign in to our platform</h5>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                            <input
                                type="text"
                                className="password bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange} />

                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password"
                                className="password bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange} />

                        </div>
                        <div className="flex items-start">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                                </div>
                                <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                            </div>
                            <a href="/forgotpassword" className="ms-auto text-sm text-blue-700 hover:underline dark:text-blue-500">Forgot Password?</a>
                        </div>
                        {showModal && (
                            <div id="popup-modal" tabIndex="-1" className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg max-w-md w-full p-10">
                                    <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center">
                                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 10l3 3 7-7" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <div className="text-center">
                                        <svg style={{ color: '#5c6370' }} className="mx-auto mb-4 text-green-500 w-12 h-12 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg>
                                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Login successful!</h3>
                                        <button onClick={closeModal} className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                            OK
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {errorMessage && <p className="text-sm text-red-500" style={{ textAlign: 'center' }}>{errorMessage}</p>} {/* Hiển thị thông báo lỗi nếu có */}
                        <button
                            type="submit"
                            className="text-white w-full bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-20 py-3 text-center me-2 mb-2"
                            onClick={handleSubmit}>SIGN IN
                        </button>

                        <div className="social-icons">
                            <span>Or Sign in with social platform</span>
                            <div>
                                <a href="#" className="icon"><FaGooglePlusG /></a>
                                <a href="#" className="icon"><FaFacebookF /></a>
                                <a href="#" className="icon"><FaGithub /></a>
                                <a href="#" className="icon"><FaLinkedinIn /></a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default LoginForm;
