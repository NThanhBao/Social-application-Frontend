import React from 'react';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import '../../../styles/style.css';
import { avatarBaseUrl } from '../../../services/Constants';
import FollowService from '../../../services/Home/FollowService';

function Follow() {
  const { users, followers, currentPage, perPage, showFollowing, showModal, closeModal, handleConfirm, handleCancel, handleUnfollowClick, handlePageClick, toggleShow } = FollowService();
  const offset = currentPage * perPage;
  const data = showFollowing ? users : followers;
  const pageCount = Math.ceil(data.length / perPage);

  return (
    <div style={{ marginLeft: '18%' }} className={`sm:ml-0 ${showFollowing ? 'sm:pl-32' : 'lg:pl-32'} py-8 px-4 flex-col flex container `}>
      <div className="pl-16 pr-16 pt-8 rounded-lg overflow-hidden justify-between items-center mt-8 mb-4">
        <div className='flex items-center justify-between mb-4'>
          <h1 style={{ fontWeight: 'bold' }} className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            {showFollowing ? 'Following' : 'Followers'}
          </h1>
          <button onClick={toggleShow} className="text-blue-500 font-semibold hover:text-blue-700 focus:outline-none">
            {showFollowing ? 'Show Followers' : 'Show Following'}
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.slice(offset, offset + perPage).map((item, index) => (
            <div key={item.id} style={{ backgroundColor: 'rgb(240, 242, 245)', position: 'relative' }} className="hover:scale-105 transition-transform duration-300 w-full max-w-sm  border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
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
                  <h5 className="mb-1 text-xl font-medium dark:text-white">{item.firstName} {item.lastName}</h5>
                </Link>
                <span className="text-sm text-gray-700 dark:text-gray">{item.mail}</span>
                <div className="flex mt-4 md:mt-6">
                  <a href="#" className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Message</a>
                  {showFollowing && (
                    <button onClick={() => handleUnfollowClick(item.id)} className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Unfollow</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"pagination flex justify-center mt-4"}
          previousLinkClassName={"pagination__link"}
          nextLinkClassName={"pagination__link"}
          disabledClassName={"pagination__link--disabled"}
          activeClassName={"pagination__link--active"}
        />
      </div>
      {/* Modal xác nhận */}
      {showModal && (
        <div id="popup-modal" tabIndex="-1" className="fixed top-0 right-0 bottom-0 left-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow">
              <button type="button" onClick={closeModal} className="absolute top-3 right-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-4 md:p-5 text-center">
                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500">Are you sure you want to unfollow this user?</h3>
                <button onClick={handleConfirm} type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                  Yes, I'm sure
                </button>
                <button onClick={handleCancel} type="button" className="ml-3 py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}

export default Follow;
