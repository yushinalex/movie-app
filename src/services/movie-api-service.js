export default class MovieAppService {
  apiKey = '1dbd845bc08a0176a18d6dd476294975';

  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZGJkODQ1YmMwOGEwMTc2YTE4ZDZkZDQ3NjI5NDk3NSIsInN1YiI6IjY1YTNlYWYwN2Q1ZjRiMDBjZWI3ZWNhMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._hIqoLLk_SYWzmmgcG4WnSk4h8i4QAd6KoOMN20pg6w',
    },
  };

  getMovies = async (query, page = 1) => {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`,
      this.options
    );

    if (!response.ok) {
      throw new Error(`Could not fetch, received ${response.status}`);
    }

    const result = await response.json();
    const data = {
      movies: result.results,
      currentPage: result.page,
      totalResults: result.total_results,
    };
    return data;
  };

  getGenres = async () => {
    const response = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', this.options);

    if (!response.ok) {
      throw new Error(`Could not fetch, received ${response.status}`);
    }

    const result = await response.json();
    return result.genres;
  };

  createGuestSession = async () => {
    const response = await fetch('https://api.themoviedb.org/3/authentication/guest_session/new', this.options);

    if (!response.ok) {
      throw new Error(`Could not fetch, received ${response.status}`);
    }

    const result = await response.json();
    return result.guest_session_id;
  };

  addRating = async (id, sessionId, rating) => {
    const ratingOptions = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        value: rating,
      }),
    };

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/rating?api_key=${this.apiKey}&guest_session_id=${sessionId}`,
      ratingOptions
    );

    if (!response.ok) {
      throw new Error(`Could not fetch, received ${response.status}`);
    }
    return response.json();
  };

  getRatedMovies = async (sessionId, page = 1) => {
    const getRatedOptions = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    };

    const response = await fetch(
      `https://api.themoviedb.org/3/guest_session/${sessionId}/rated/movies?api_key=${this.apiKey}&language=en-US&page=${page}&sort_by=created_at.asc`,
      getRatedOptions
    );

    if (!response.ok) {
      throw new Error(`Could not fetch, received ${response.status}`);
    }

    const result = await response.json();
    const data = {
      movies: result.results,
      currentPage: result.page,
      totalResults: result.total_results,
      totalPages: result.total_pages,
    };
    return data;
  };
}
