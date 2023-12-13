// ImageCard.js
import '../css/c2_imageCard.css';
import React from 'react';

const ImageCard = ({ key, src, alt, title, category }) => {
  // const editStory = () => {
  //     let editStoryURL = ''
  //     try {
  //         const response = await fetch(editStoryURL)
  //         const data = await response.json();
  //         console.log(data)

  //     } catch (err) {console.error(err.message);}
  // }
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
