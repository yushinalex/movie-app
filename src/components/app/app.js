import React, { Component } from 'react';
import { Alert } from 'antd';

import Header from '../header';
import MovieList from '../movie-list';
import checkOnlineState from '../../services/online-check';
import MovieAppService from '../../services/movie-api-service';
import { GenresProvider } from '../../services/genres-context';

import './app.css';

export default class App extends Component {
  state = {
    searchRequest: '',
    currentTab: 'search',
    genres: [],
    sessionId: null,
    rated: [],
    fetchError: false,
  };

  MovieAppService = new MovieAppService();

  componentDidMount() {
    this.onAppMount();
  }

  onAppMount = async () => {
    try {
      const genres = await this.updateGenres();
      const sessionId = await this.updateGuestSession();
      const rated = await this.updateRated(sessionId);
      this.setState({ genres, sessionId, rated });
    } catch (err) {
      this.setState({ fetchError: true });
    }
  };

  updateGenres = async () => {
    const genres = await this.MovieAppService.getGenres();
    return genres;
  };

  updateGuestSession = async () => {
    const savedSessionId = localStorage.getItem('sessionId');

    if (!savedSessionId) {
      const newSessionId = await this.MovieAppService.createGuestSession();
      localStorage.setItem('sessionId', newSessionId);
      return newSessionId;
    }

    return savedSessionId;
  };

  updateRated = async (sessionId) => {
    const data = await this.MovieAppService.getRatedMovies(sessionId);
    let result = data.movies;

    if (data.totalPages > 1) {
      for (let i = 2; i <= data.totalPages; i++) {
        const obj = await this.MovieAppService.getRatedMovies(sessionId, i);
        result = [...result, ...obj.movies];
      }
    }
    return result;
  };

  searchMovie = (text) => {
    this.setState({ searchRequest: text });
  };

  toggleMenu = (currentTab) => {
    this.setState({ currentTab });
  };

  editRatings = async () => {
    const { sessionId } = this.state;
    const rated = await this.updateRated(sessionId);
    this.setState({ rated });
  };

  render() {
    const { searchRequest, currentTab, genres, fetchError, sessionId, rated } = this.state;

    if (fetchError) {
      return (
        <Alert
          className="fetchError"
          message="OOPS! Something has gone wrong! Failed to load resource, check your internet connection or try a little bit later!"
          type="error"
          showIcon
        />
      );
    }

    if (checkOnlineState()) {
      return (
        <GenresProvider value={genres}>
          <section className="movie-app">
            <Header
              searchMovie={this.searchMovie}
              toggleMenu={this.toggleMenu}
              currentTab={currentTab}
              searchRequest={searchRequest}
            />
            <MovieList
              searchRequest={searchRequest}
              currentTab={currentTab}
              sessionId={sessionId}
              rated={rated}
              editRatings={this.editRatings}
            />
          </section>
        </GenresProvider>
      );
    }

    return (
      <Alert
        className="offline"
        message="OOPS! No internet connection. Please check your network settings."
        type="error"
        showIcon
      />
    );
  }
}
