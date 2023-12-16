// WorkImages.js
// 渲染作品圖片
import React, { useRef, useState, useEffect } from 'react';
import '../css/c4_workImages.css';

const WorkImages = ({ imageData }) => {
  const designComponentsRef = useRef([]); // Ref to store Design component references
  const [slideList, setSlideList] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Design component
  const Image = ({ id, image, caption }) => {
    return (
      <div className="image-container">
        <img className="image" src={`http://localhost:4000/${image}`} alt={`Image ${id}`} />
        {caption && <div className="caption">{caption}</div>}
      </div>
    );
  };

  useEffect(() => {
    const formattedData = imageData.images.map((image) => ({
      id: image.id,
      slide: (
        <Image
          key={image.id}
          id={image.id}
          image={image.imageFile}
          caption={image.caption}
          // 樣式
          // style={image.style[0]}
          // fontFamily={image.style[1]}
          // size={image.style[2]}
          // color={image.style[3]}
        />
      ),
    }));
    setSlideList(formattedData);
  }, [imageData]);

  const nextSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slideList.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === 0 ? slideList.length - 1 : prevIndex - 1
    );
  };

  return (
    <div id="workImages" className='container mt-5 mb-5'>
      {slideList.map((slide, index) => (
        <div
          className="designPage"
          key={index}
          style={{ display: index === currentSlideIndex ? "block" : "none" }}
        >
          {slide.slide}
        </div>
      ))}
      <div className="controls mt-3">
        <button className="btn btn-outline-secondary" onClick={prevSlide}>Back</button>
        <span className="pageIndicator">
          {currentSlideIndex + 1} / {slideList.length}
        </span>
        <button className="btn btn-outline-secondary" onClick={nextSlide}>Next</button>
      </div>
    </div>
  );
};

export default WorkImages;
