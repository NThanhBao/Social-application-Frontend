import React, { useState, useEffect } from 'react';
import NavbarService from '../../../services/Home/NavbarLeftService';
import logoImage from '../../../assets/images/Logo192.png';
import Notifications from '../Notifications';
import ListRepository from './Repository'
import Profile from './Proflie';
import '../../../styles/style.css';

function NavbarLeft() {
  const { searchQuery, firstName, lastName, avatarUrl, isDropdownOpen, handleChange, handleKeyPress, toggleDropdown, handleProfileClick, handleLogout } = NavbarService();
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isRepositoryModalOpen, setIsRepositoryModalOpen] = useState(false);
  const toggleNotificationModal = () => {
    setIsNotificationModalOpen(!isNotificationModalOpen);
  };

  const toggleRepositoryModal = () => {
    setIsRepositoryModalOpen(!isRepositoryModalOpen);
  };

  return (
    <div className="w-full">
      <nav style={{ backgroundColor: 'rgb(240, 242, 245)' }} className="fixed top-0 z-50 w-full border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className=" flex flex-wrap items-center  p-4 justify-between ml-24">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <a href="/home" className="flex items-center space-x-3">
              <div style={{ width: '60px' }} className="h-8 w-8 flex items-center justify-center bg-gradient-to-r">
                <img src={logoImage} alt="Logo" />
              </div>
              <span className="hidden md:block self-center text-2xl font-semibold whitespace-nowrap dark:text-white bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">SocialMedia</span>
            </a>
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input style={{ borderRadius: '60px' }} type="text" id="search-navbar" value={searchQuery} onChange={handleChange} onKeyPress={handleKeyPress} className=" block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." />
            </div>
          </div>
          <div className="relative flex items-center justify-between w-full md:w-auto">
            <ul style={{ backgroundColor: 'rgb(240, 242, 245)' }} className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-10 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 justify-between">
              <li className="hidden md:block">
                <a href="/home" className=" py-2 px-3 bg-blue-700 rounded md:bg-transparent md:text-blue-600 md:p-0 md:dark:text-blue-500 flex items-center" aria-current="page">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="flex-shrink-0 w-7 h-7  transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" fill="currentColor">
                    <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
                  </svg>
                </a>
              </li>
              <li className="hidden md:block">
                <a href="/followers-page" className="block py-2 px-3  bg-blue-700 rounded md:bg-transparent md:text-blue-600 md:p-0 md:dark:text-blue-500" aria-current="page">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-7 h-7 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" fill="currentColor">
                    <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z" />                  </svg>
                </a>
              </li>
              <li className="hidden md:block">
                <a href="#" className="block py-2 px-3  bg-blue-700 rounded md:bg-transparent md:text-blue-600 md:p-0 md:dark:text-blue-500" aria-current="page">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-7 h-7 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" fill="currentColor">
                    <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z" />
                  </svg>
                </a>
              </li>
              <li className="hidden md:block">
                <a href="#" className="block py-2 px-3  bg-blue-700 rounded md:bg-transparent md:text-blue-600 md:p-0 md:dark:text-blue-500" aria-current="page">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-7 h-7 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" fill="currentColor">
                    <path fill="#1a56db" d="M448 80c8.8 0 16 7.2 16 16V415.8l-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />                </svg>
                </a>
              </li>
            </ul>
          </div>
          <div className="flex items-center md:order-2">
            <button type="button" data-collapse-toggle="navbar-search" aria-controls="navbar-search" aria-expanded="false" className="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1">
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
              <span className="sr-only">Search</span>
            </button>
            <button data-collapse-toggle="navbar-search" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-search" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
          </div>
          <div className=" mr-0 relative flex " >
            <ul style={{ backgroundColor: 'rgb(240, 242, 245)' }} className="flex flex-col p-4 md:p-0 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-10 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 justify-between">
              <li className="hidden md:block">
                <a href="#" className="block py-2 px-3  bg-blue-700 rounded md:bg-transparent md:text-blue-600 md:p-0 md:dark:text-blue-500" aria-current="page">
                  <svg className="w-7 h-7 mt-2 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M256.6 8C116.5 8 8 110.3 8 248.6c0 72.3 29.7 134.8 78.1 177.9 8.4 7.5 6.6 11.9 8.1 58.2A19.9 19.9 0 0 0 122 502.3c52.9-23.3 53.6-25.1 62.6-22.7C337.9 521.8 504 423.7 504 248.6 504 110.3 396.6 8 256.6 8zm149.2 185.1l-73 115.6a37.4 37.4 0 0 1 -53.9 9.9l-58.1-43.5a15 15 0 0 0 -18 0l-78.4 59.4c-10.5 7.9-24.2-4.6-17.1-15.7l73-115.6a37.4 37.4 0 0 1 53.9-9.9l58.1 43.5a15 15 0 0 0 18 0l78.4-59.4c10.4-8 24.1 4.5 17.1 15.6z" />
                  </svg>
                </a>
              </li>
              <li className="hidden md:block">
                <a href="#" className="block py-2 px-3  bg-blue-700 rounded md:bg-transparent md:text-blue-600 md:p-0 md:dark:text-blue-500" aria-current="page" onClick={toggleNotificationModal}>
                  <svg className="w-7 h-7 mt-2 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v25.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112v25.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V208c0-61.9 50.1-112 112-112zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z" />
                  </svg>
                </a>
              </li>
              {isNotificationModalOpen && (
                <div style={{ width: '25rem' }} className="absolute right-0 mt-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <Notifications />
                </div>
              )}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button onClick={handleProfileClick} className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none">
                    View profile
                  </button>
                  <button onClick={handleLogout} className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none">
                    Logout
                  </button>
                </div>
              )}
            </ul>
            <div className='flex ' onClick={toggleDropdown}>
              <div className="pl-8 flex items-center space-x-4">
                <img src={avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full shadow-lg" />
                <div>
                  <button className="font-medium ">{`${firstName} ${lastName}`}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside id="logo-sidebar" style={{ width: '25%', backgroundColor: 'rgb(240, 242, 245)', paddingLeft: '20px', paddingRight: '10px', fontSize: 'large', height: '100%' }} className={`hidden lg:block fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`} aria-label="Sidebar">
        <Profile />
      </aside>
    </div>
  );
};

export default NavbarLeft;
