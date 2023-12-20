// WorkImages.js
import React, { useState } from 'react';
import '../css/c4_workImages.css';
import DesignPage from './edit/DesignPage.js';

const WorkImage = (props) => {
  const { data } = props;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const nextSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % data.images.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex === 0 ? data.images.length - 1 : prevIndex - 1));
  };

  return (
    <div className="read-container">
      {data.images.map((image, index) => (
        <div className="designPage" key={index} style={{ display: index === currentSlideIndex ? 'block' : 'none' }}>
          <DesignPage
            key={image.id} 
            imageId={image.id} 
            storyId={data.id}
            pageId={index}
            imageFile={image.imageFile ? `http://localhost:4000/${image.imageFile}` : ''}
            caption={image.caption || ''} 
            fontFamily={image.style && image.style.length > 0 ? image.style[0] : "Arial, Helvetica, sans-serif"} 
            size={image.style && image.style.length > 1 ? image.style[1] : "16px"} 
            color={image.style && image.style.length > 2 ? image.style[2] : "#000000"}
            style={image.style && image.style.length > 3 ? image.style[3] : "img text"}
            editText={false}
          />
        </div>
      ))}
      <div className="controls mt-3 d-flex justify-content-between">
        <button className="btn btn-outline-secondary" onClick={prevSlide}>
          Back
        </button>
        <span className="pageIndicator">
          {currentSlideIndex + 1} / {data.images.length}
        </span>
        <button className="btn btn-outline-secondary" onClick={nextSlide}>
          Next
        </button>
      </div>
    </div>
  );
}

export default WorkImage;
