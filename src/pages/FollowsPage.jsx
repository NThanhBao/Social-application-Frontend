import React from 'react';
import Follow from '../components/Home/Follows';
import Navbar from '../components/Home/Navbar';
import '../styles/style.css';

function FolowsPage() {
    return (
        <div className='followPage-container'>
            <Navbar/>
            <div className='follow-container'> {/* Đặt class follow-container cho phần Follow */}
              <Follow />
            </div>
        </div>
    );
}

export default FolowsPage;
