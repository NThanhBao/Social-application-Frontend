import React from 'react';
import NavbarService from '../../../services/Home/NavbarLeftService';
import logoImage from '../../../assets/images/Logo192.png';
import '../../../styles/style.css';

function Navbar() {
    const { firstName, lastName, avatarUrl, isDropdownOpen, toggleDropdown, handleFollowersClick, handleProfileClick, handleLogout } = NavbarService();

    return (
        <div className="w-full">
            <nav className="fixed top-0 z-50 w-full bg-gray-100 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex justify-between items-center p-4 mx-auto">
                    <a href="/Dashboard" className="flex items-center space-x-3 ml-20">
                        <div className="w-16 h-16 flex items-center justify-center">
                            <img src={logoImage} alt="Logo" className="w-full h-full" />
                        </div>
                        <span className="text-4xl font-semibold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text hidden md:block">Adminator</span>
                    </a>
                    <div className="relative flex items-center space-x-4">
                        <button type="button" className="md:hidden p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700">
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="pl-8 relative" >
                            <div className='flex ml-4 mr-20' onClick={toggleDropdown}>
                                <div className="pl-8 flex items-center space-x-4">
                                    <img src={avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full shadow-lg" />
                                    <div>
                                        <button className="font-medium ">{`${firstName} ${lastName}`}</button>
                                    </div>
                                </div>
                            </div>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    <button onClick={handleProfileClick} className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none">
                                        View profile
                                    </button>
                                    <button onClick={handleLogout} className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <aside id="logo-sidebar" className="hidden lg:block fixed top-0 left-0 z-40 w-64 h-full pt-20 bg-gray-100 dark:bg-gray-800">
                <div className="space-y-6">
                    <ul className="space-y-2 mt-8">
                        <li>
                            <a href="/Dashboard" className="hover:scale-105 transition-transform duration-300 flex items-center p-4 space-x-4 text-gray-700 rounded-lg hover:bg-blue-600 hover:text-white dark:text-gray-400 dark:hover:bg-blue-700">
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512">
                                    <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
                                </svg>
                                <span className='text-xl'>Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="/email" className="hover:scale-105 transition-transform duration-300 flex items-center p-4 space-x-4 text-gray-700 rounded-lg hover:bg-blue-600 hover:text-white dark:text-gray-400 dark:hover:bg-blue-700">
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                                    <path d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z" />
                                </svg>
                                <span className='text-xl'>Email</span>
                            </a>
                        </li>
                        <li>
                            <a href="/charts" className="hover:scale-105 transition-transform duration-300 flex items-center p-4 space-x-4 text-gray-700 rounded-lg hover:bg-blue-600 hover:text-white dark:text-gray-400 dark:hover:bg-blue-700">
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512">
                                    <path d="M304 240V16.6c0-9 7-16.6 16-16.6C443.7 0 544 100.3 544 224c0 9-7.6 16-16.6 16H304zM32 272C32 150.7 122.1 50.3 239 34.3c9.2-1.3 17 6.1 17 15.4V288L412.5 444.5c6.7 6.7 6.2 17.7-1.5 23.1C371.8 495.6 323.8 512 272 512C139.5 512 32 404.6 32 272zm526.4 16c9.3 0 16.6 7.8 15.4 17c-7.7 55.9-34.6 105.6-73.9 142.3c-6 5.6-15.4 5.2-21.2-.7L320 288H558.4z" />
                                </svg>
                                <span className='text-xl'>Charts</span>
                            </a>
                        </li>
                        <li>
                            <a href="/listUser" onClick={handleFollowersClick} className="hover:scale-105 transition-transform duration-300 flex items-center p-4 space-x-4 text-gray-700 rounded-lg hover:bg-blue-600 hover:text-white dark:text-gray-400 dark:hover:bg-blue-700">
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 640 512">
                                    <path d="M96 96a96 96 0 1 1 0 192 96 96 0 1 1 0-192zM496 256a112 112 0 1 0 0-224 112 112 0 1 0 0 224zM320 352a96 96 0 1 1 0-192 96 96 0 1 1 0 192zM32 416a64 64 0 0 1 64-64H288a64 64 0 0 1 64 64v16c0 17.7-14.3 32-32 32H64c-17.7 0-32-14.3-32-32v-16zM368 464v-16c0-24.2-6.4-46.9-17.7-66.7c21.6-8.8 45.4-13.3 70.7-13.3H528c25.3 0 49.1 4.6 70.7 13.3C657.6 401.1 664 423.8 664 448v16c0 17.7-14.3 32-32 32H400c-17.7 0-32-14.3-32-32z" />
                                </svg>
                                <span className='text-xl'>List Users</span>
                            </a>
                        </li>
                        <li>
                            <a href="/error@404" className="hover:scale-105 transition-transform duration-300 flex items-center p-4 space-x-4 text-gray-700 rounded-lg hover:bg-blue-600 hover:text-white dark:text-gray-400 dark:hover:bg-blue-700">
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                                    <path d="M495.9 166.6l-42.7-7.1c-4.1-14.8-9.9-28.8-16.8-41.8l22.9-35.8c3.1-4.9 2.5-11.3-1.3-15.5c-9.6-11.2-19.7-21.7-30.9-31.2c-4.2-3.7-10.6-4.4-15.5-1.3L394.3 59.6c-13.1-6.8-27-12.5-41.8-16.6L345.5 .9c-2.2-5.8-7.8-8.8-13.5-8.8h-152c-5.8 0-11.3 3-13.5 8.8l-7.1 42.7c-14.8 4.1-28.8 9.8-41.8 16.6L62.4 35.2c-4.9-3.1-11.3-2.5-15.5 1.3c-11.2 9.6-21.7 19.7-31.2 30.9c-3.7 4.2-4.4 10.6-1.3 15.5l22.9 35.8c-6.8 13.1-12.6 27-16.8 41.8L.9 166.6c-5.8 2.2-8.8 7.8-8.8 13.5v152c0 5.8 3 11.3 8.8 13.5l42.7 7.1c4.1 14.8 9.9 28.8 16.8 41.8l-22.9 35.8c-3.1 4.9-2.5 11.3 1.3 15.5c9.6 11.2 19.7 21.7 30.9 31.2c4.2 3.7 10.6 4.4 15.5 1.3l35.8-22.9c13.1 6.8 27 12.5 41.8 16.6l7.1 42.7c2.2 5.8 7.8 8.8 13.5 8.8h152c5.8 0 11.3-3 13.5-8.8l7.1-42.7c14.8-4.1 28.8-9.8 41.8-16.6l35.8 22.9c4.9 3.1 11.3 2.5 15.5-1.3c11.2-9.6 21.7-19.7 31.2-30.9c3.7-4.2 4.4-10.6 1.3-15.5l-22.9-35.8c6.8-13.1 12.6-27 16.8-41.8l42.7-7.1c5.8-2.2 8.8-7.8 8.8-13.5v-152c0-5.7-3-11.3-8.8-13.5zM256 352c-53 0-96-43-96-96s43-96 96-96s96 43 96 96s-43 96-96 96z" />
                                </svg>
                                <span className='text-xl'>Settings</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    );
}

export default Navbar;
