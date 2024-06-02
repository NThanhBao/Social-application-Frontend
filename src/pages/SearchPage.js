import React from 'react';
import Navbar from '../components/Home/Navbar';
import Search from '../components/SearchResult';

function SearchPage() {
  return (
    <div className='searchPage'>
      <Navbar />
      <div className="">
        <div className=''>
          <Search/>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
