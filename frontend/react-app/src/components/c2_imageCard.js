// ImageCard.js
import '../css/c2_imageCard.css';
import React from 'react';

const ImageCard = ({ src, alt, title, category }) => {
  return (
    <div className="imageCard">
      <div className="card">
        <img src={src} className="card-img-top" alt={alt} />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{category}</p>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
