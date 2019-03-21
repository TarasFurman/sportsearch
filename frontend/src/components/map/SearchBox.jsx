import React from 'react';
// import './index.css';

const SearchBox = () => (
  <div className="search-box">
    <input type="text" className="search-txt" placeholder="Search on the map" />
    <a className="search-btn" href="#top">
      <i className="fas fa-search" />
    </a>
  </div>
);

export default SearchBox;
