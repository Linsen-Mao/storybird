// HomeCarousel.js
import '../css/p1_1homeCarousel.css';
import React from 'react';

const HomeCarousel = () => {
  const carousel_data = [
    {
      cover: require('../img/electric-car-2545290_1280.png'),
      title: 'Future Journey',
      description: 'Advanced technology opens the door to a sustainable new era.'
    },
    {
      cover: require('../img/girl-8435340_1280.png'),
      title: 'Blue Dreams - Sky of Memories',
      description: 'Girl injects her dreams into the sky, weaving a tapestry of beautiful moments.'
    },
    {
      cover: require('../img/homes-8194751_1280.png'),
      title: 'The Lonely Island',
      description: 'A solitary island, yet adorned with boundless tranquility and beauty.'
    }
  ]
   return (
    <div id="homeCarousel">
      <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          
        {carousel_data.map((item, index) => (
          <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
            <img className="d-block w-100" src={item.cover} alt={`Slide ${index + 1}`} />
            <div className="carousel-caption d-none d-md-block">
              <h3 className="carousel-title">{item.title}</h3>
              <p className="carousel-description">{item.description}</p>
            </div>
          </div>
        ))}

        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>
    </div>
    )
}

export default HomeCarousel;
