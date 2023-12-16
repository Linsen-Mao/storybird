// import './App.css';

import Carousel from 'react-bootstrap/Carousel';
import slide1 from '../img/electric-car-2545290_1280.png';
import slide2 from '../img/girl-8435340_1280.png';
import slide3 from '../img/homes-8194751_1280.png';
import React from 'react';


const Slide = () => {
    return (
      <Carousel controls={false} >
        <Carousel.Item>
          <img
            className="slides d-block w-100"
            src={slide1}
            alt="First slide"
          />
          <Carousel.Caption className="carousel-caption">
            <h3>Future Journey</h3>
            <p>Advanced technology opens the door to a sustainable new era.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="slides d-block w-100"
            src={slide2}
            alt="Second slide"
          />
          <Carousel.Caption className="carousel-caption">
            <h3>Blue Dreams - Sky of Memories</h3>
            <p>A girl injects her dreams into the sky, weaving a tapestry of beautiful moments.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="slides d-block w-100"
            src={slide3}
            alt="Third slide"
          />
          <Carousel.Caption className="carousel-caption">
            <h3>The Lonely Island</h3>
            <p>A solitary island, yet adorned with boundless tranquility and beauty.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    );
}

export default Slide;
