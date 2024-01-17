import React from 'react';

function Card() {
  return (
    <div className="card">
      <img alt="" src="" />
      <div className="description">
        <div className="top">
          <h2>Name</h2>
          <span>Rate</span>
        </div>
        <div className="info">
          <div className="date">Date</div>
          <div className="tags">Tags</div>
        </div>
        <div className="about">
          <p>Something</p>
        </div>
        <div className="rating">Stars</div>
      </div>
    </div>
  );
}

export default Card;
