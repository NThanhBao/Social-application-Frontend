import React from 'react';
import Navbar from '../components/Home/Navbar';
import PostForm from '../components/Home/PostHome';
import SuggestionList from '../components/Home/NavbarRight';
import ListFriend from '../components/Home/NavbarRight/ListFriend';

function HomePage() {
  return (
    <div className='homePage'>
      <Navbar />
      <div className="homePageContent flex">
        <PostForm />
        <SuggestionList />
      </div>
      <div className="homePageContentRight">

      </div>
    </div>
  );
}

export default HomePage;
