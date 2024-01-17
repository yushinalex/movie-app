import React from 'react';

import SearchForm from '../search-form';

function Header() {
  return (
    <section className="header">
      <div>
        <button type="button">Search</button>
        <button type="button">Rated</button>
      </div>
      <SearchForm />
    </section>
  );
}

export default Header;
