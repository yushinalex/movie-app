import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Input } from 'antd';
import { debounce } from 'lodash';

import './header.css';

function Header({ searchMovie, toggleMenu, currentTab, searchRequest }) {
  const items = [
    {
      label: 'Search',
      key: 'search',
    },
    {
      label: 'Rated',
      key: 'rated',
    },
  ];

  const searchChange = debounce((e) => {
    searchMovie(e.target.value);
  }, 1000);

  const searchInput =
    currentTab === 'search' ? (
      <div className="search-form">
        <Input onChange={searchChange} defaultValue={searchRequest} placeholder="Type to search..." />
      </div>
    ) : null;

  return (
    <section className="header">
      <div className="menu">
        <Menu
          onClick={({ key }) => {
            toggleMenu(key);
          }}
          defaultSelectedKeys={['search']}
          selectedKeys={[currentTab]}
          mode="horizontal"
          items={items}
        />
      </div>
      {searchInput}
    </section>
  );
}

export default Header;

Header.defaultProps = {
  searchMovie: () => {},
  toggleMenu: () => {},
  searchRequest: '',
  currentTab: 'search',
};

Header.propTypes = {
  searchMovie: PropTypes.func,
  toggleMenu: PropTypes.func,
  searchRequest: PropTypes.string,
  currentTab: PropTypes.string,
};
