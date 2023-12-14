// WorkCarousel.js

// 需串接API
import '../css/p2_1_1workCarousel.css';
import React from 'react';

const WorkCarousel = () => {
  const carousel_data = [
    {
      id: 1,
      picture: require('../img/bg_school_room.jpg')
    },
    {
      id: 2,
      picture: require('../img/monster01.png')
    },
    {
      id: 3,
      picture: require('../img/monster02.png')
    }];
  
   return (
    <div id="workCarousel" className='container mt-5 mb-5'>
      <div id="carouselWorkCaptions" className="carousel" data-bs-ride="carousel">
        <div className="carousel-inner">
        {carousel_data.map((item, index) => (
          <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
            <img className="d-block w-100" src={item.picture} alt={`Slide ${index + 1}`} />
          </div>
        ))}

        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselWorkCaptions" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselWorkCaptions" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>
    </div>
    )
}

export default WorkCarousel;