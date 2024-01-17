import React from 'react';

import Card from '../card';

function MovieList({ array }) {
  const elements = array.map((item) => {
    const { id, ...props } = item;

    return <Card {...props} key={id} />;
  });

  return <ul className="movie-list">{elements}</ul>;
}

export default MovieList;
