import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/style.css';
import { avatarBaseUrl } from '../../services/Constants';
import { fetchFollowingUsers, toggleFollow } from '../../services/SearchResultService';

function SearchResult() {
  // Lấy dữ liệu từ localStorage
  const searchResult = JSON.parse(localStorage.getItem('searchResult')) || [];

  const [followingStatus, setFollowingStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFollowingUsers = async () => {
      try {
        const status = await fetchFollowingUsers();
        setFollowingStatus(status);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    loadFollowingUsers();
  }, []);

  const handleToggleFollow = async (id) => {
    try {
      const updatedStatus = await toggleFollow(id, followingStatus);
      setFollowingStatus(updatedStatus);
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  return (
    <div style={{ width: '80%', marginLeft: '24%' }} className={` py-8 px-4 p-4 flex-col flex container mx-auto`}>
      <div className="pl-16 pr-16 pt-8 rounded-lg overflow-hidden justify-between items-center mt-8 mb-4">
        <div className='flex items-center justify-between mb-4'>
          <h1 style={{ fontWeight: 'bold' }} className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Search Results
          </h1>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            searchResult.map((item) => (
              <div key={item.id} style={{ backgroundColor: 'rgb(240, 242, 245)', position: 'relative' }} className="hover:scale-105 transition-transform duration-300 w-full max-w-sm  border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ">
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}>
                  <Link to={`/profile/${item.id}`}>
                    <img className="w-full h-32 object-cover rounded-t-lg" src={`${avatarBaseUrl}${item.background}`} alt={`${item.firstName}'s background`} />
                  </Link>
                </div>
                <div className="flex flex-col items-center pb-10 pt-20">
                  <Link to={`/profile/${item.id}`}>
                    <img className="w-40 h-40 mb-3 items-center rounded-full border-4 border-white shadow-lg" src={`${avatarBaseUrl}${item.avatar}`} alt={`${item.firstName}'s profile`} style={{ position: 'relative', zIndex: 2 }} />
                  </Link>
                  <Link to={`/profile/${item.id}`}>
                    <h5 className="mb-1 text-xl font-medium items-center  ">{item.firstName} {item.lastName}</h5>
                  </Link>
                  <Link to={`/profile/${item.id}`}>
                    <span className="text-sm text-gray-700 ">{item.mail}</span>
                  </Link>
                  <div className="flex mt-4 md:mt-6">
                    <button
                      onClick={() => handleToggleFollow(item.id)}
                      className={`button ${followingStatus[item.id] ? 'button-red' : 'button-blue'}`}>
                      {followingStatus[item.id] ? 'Unfollow' : 'Follow'}
                    </button>
                    <button href="#" className="py-2 px-4 ms-2 text-m font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Message</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResult;
