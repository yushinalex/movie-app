import React from 'react';
import { format } from 'date-fns';
import { Rate } from 'antd';
import PropTypes from 'prop-types';

import './card.css';
import notFound from '../../assets/no-poster.png';
import { GenresConsumer } from '../../services/genres-context';
import MovieAppService from '../../services/movie-api-service';

function Card(props) {
  const {
    title,
    vote_average: rate,
    release_date: releaseDate,
    poster_path: posterPath,
    overview,
    genre_ids: genreIds,
    id,
    sessionId,
    rating,
    savedRating,
    editRatings,
  } = props;

  const movieAppService = new MovieAppService();

  const date = releaseDate ? format(new Date(releaseDate), 'MMMM dd, yyyy') : 'Release date: n/a.';

  const roundedRate = rate ? Math.round(rate * 10) / 10 : 'n/a';

  const rateStyle = () => {
    if (roundedRate === 'n/a') {
      return 'card-rated--grey';
    }
    if (roundedRate >= 7) {
      return 'card-rated--green';
    }
    if (roundedRate >= 5) {
      return 'card-rated--yellow';
    }
    if (roundedRate >= 3) {
      return 'card-rated--orange';
    }
    return 'card-rated--red';
  };

  const genreList = (genres) => {
    const array = [];
    genreIds.forEach((item) => {
      genres.forEach((el) => {
        if (el.id === item) {
          array.push(el.name);
        }
      });
    });

    return array.slice(0, 3).map((item) => (
      <span className="card-tag" key={item}>
        {item}
      </span>
    ));
  };

  const onRatingChange = async (value) => {
    if (!value) {
      return;
    }

    const res = await movieAppService.addRating(id, sessionId, value);

    if (res.success) {
      setTimeout(() => editRatings(), 1200);
    }
  };

  return (
    <div className="card">
      <div className="card-poster">
        <img
          className="card-image"
          src={posterPath ? `https://image.tmdb.org/t/p/original${posterPath}` : notFound}
          alt="Poster"
        />
      </div>
      <div className="card-description">
        <div className="card-top">
          <h2 className="card-title">{title}</h2>
          <div className="card-vote">
            <span className={`card-rated ${rateStyle()}`}>{roundedRate}</span>
          </div>
        </div>
        <div className="card-info">
          <div className="card-date">{date}</div>
          <div className="card-tags">
            <GenresConsumer>{(genres) => genreList(genres)}</GenresConsumer>
          </div>
        </div>
        <div className="card-about">
          <p className="card-text">{overview || 'No overview available.'}</p>
        </div>
        <Rate
          className="card-rating"
          allowHalf
          allowClear="false"
          count={10}
          defaultValue={rating || savedRating}
          onChange={(value) => {
            onRatingChange(value);
          }}
        />
      </div>
    </div>
  );
}

export default Card;

Card.defaultProps = {
  title: '',
  vote_average: 0,
  release_date: 'n/a',
  poster_path: '',
  overview: 'n/a',
  genre_ids: [],
  sessionId: '',
  rating: 0,
  savedRating: 0,
  editRatings: () => {},
};

Card.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string,
  vote_average: PropTypes.number,
  release_date: PropTypes.string,
  poster_path: PropTypes.string,
  overview: PropTypes.string,
  genre_ids: PropTypes.array,
  sessionId: PropTypes.string,
  rating: PropTypes.number,
  savedRating: PropTypes.number,
  editRatings: PropTypes.func,
};
