import React, { Component } from 'react';
import { Spin, Alert } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import Card from '../card';
import MovieAppService from '../../services/movie-api-service';
import MoviePagination from '../pagination';

import './movie-list.css';

export default class MovieList extends Component {
  movieAppService = new MovieAppService();

  state = {
    movies: [],
    currentPage: 1,
    totalResults: null,
    loading: false,
    error: false,
  };

  static defaultProps = {
    searchRequest: '',
    currentTab: 'search',
    sessionId: '',
    rated: [{}],
    editRatings: () => {},
  };

  static propTypes = {
    searchRequest: PropTypes.string,
    currentTab: PropTypes.string,
    sessionId: PropTypes.string,
    rated: PropTypes.arrayOf(PropTypes.object),
    editRatings: PropTypes.func,
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.searchRequest !== this.props.searchRequest) {
      this.updateSearchList();
    }

    if (prevProps.currentTab !== this.props.currentTab) {
      if (this.props.currentTab === 'search') {
        this.updateSearchList();
      }

      if (this.props.currentTab === 'rated') {
        this.updateRatedList();
      }
    }

    if (prevState.currentPage !== this.state.currentPage) {
      if (this.props.currentTab === 'search') {
        this.updateSearchList(this.state.currentPage);
      }

      if (this.props.currentTab === 'rated') {
        this.updateRatedList(this.state.currentPage);
      }
    }
  }

  onLoaded = ({ movies, currentPage, totalResults }) => {
    this.setState({
      movies,
      currentPage,
      totalResults,
      loading: false,
    });
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  updateSearchList(page = 1) {
    const { searchRequest } = this.props;

    if (!searchRequest) {
      this.setState({ movies: [] });
    }

    this.setState({ loading: true, error: false });

    this.movieAppService.getMovies(searchRequest, page).then(this.onLoaded).catch(this.onError);
  }

  updateRatedList(page = 1) {
    const { sessionId } = this.props;

    this.setState({ loading: true, error: false });

    this.movieAppService.getRatedMovies(sessionId, page).then(this.onLoaded).catch(this.onError);
  }

  onPageChange = (currentPage) => {
    this.setState({ currentPage });
  };

  render() {
    const { movies, currentPage, totalResults, loading, error } = this.state;

    const spin = (
      <Spin
        indicator={
          <LoadingOutlined
            style={{
              fontSize: 84,
            }}
            spin
          />
        }
      />
    );
    const spinner = loading ? spin : null;

    const errorMessage = error ? (
      <Alert
        message="OOPS! Something has gone wrong! Failed to load resource, try a little bit later!"
        type="error"
        showIcon
      />
    ) : null;

    const hasData = !(loading || error);

    const noResultMessage = <Alert message="Nothing found." type="info" showIcon />;

    const elements = movies.map((item) => {
      const { id, ...props } = item;

      const savedRating = this.props.rated.find((el) => el.id === id)
        ? this.props.rated.find((el) => el.id === id).rating
        : 0;

      return (
        <li key={id}>
          <Card
            {...props}
            id={id}
            editRatings={this.props.editRatings}
            savedRating={savedRating}
            sessionId={this.props.sessionId}
          />
        </li>
      );
    });

    const list = () => {
      if (elements.length) {
        return (
          <>
            <ul className="movie-list">{elements}</ul>
            <MoviePagination currentPage={currentPage} totalResults={totalResults} onPageChange={this.onPageChange} />
          </>
        );
      }

      if (!elements.length && !this.props.searchRequest && this.props.currentTab === 'rated') {
        return noResultMessage;
      }

      if (!elements.length && !this.props.searchRequest) {
        return <ul className="movie-list">{elements}</ul>;
      }

      return noResultMessage;
    };

    const content = hasData ? list() : null;

    return (
      <section className="movies">
        {spinner}
        {errorMessage}
        {content}
      </section>
    );
  }
}
