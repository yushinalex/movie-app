import React from 'react';
import { Pagination } from 'antd';
import PropTypes from 'prop-types';

import './pagination.css';

function MoviePagination({ currentPage, totalResults, onPageChange }) {
  return (
    <div className="movie-pagination">
      <Pagination
        defaultCurrent={1}
        current={currentPage}
        total={totalResults}
        showSizeChanger={false}
        pageSize={20}
        onChange={(page) => onPageChange(page)}
      />
    </div>
  );
}

export default MoviePagination;

MoviePagination.defaultProps = {
  currentPage: 1,
  totalResults: 20,
  onPageChange: () => {},
};

MoviePagination.propTypes = {
  currentPage: PropTypes.number,
  totalResults: PropTypes.number,
  onPageChange: PropTypes.func,
};
