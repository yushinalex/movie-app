import React, { Component } from 'react';

import Header from '../header';
import SearchForm from '../search-form';
import MovieList from '../movie-list';

export default class App extends Component {
  state = {
    array: [],
  };

  render() {
    return (
      <section className="movie-app">
        <Header />
        <SearchForm />
        <MovieList moves={this.state.array} />
      </section>
    );
  }
}
