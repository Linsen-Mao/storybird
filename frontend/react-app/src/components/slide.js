// import './App.css';

import Carousel from 'react-bootstrap/Carousel';
import slide1 from '../img/slide1.png';
import slide2 from '../img/slide2.png';
import slide3 from '../img/slide3.png';
import React from 'react';


const Slide = () => {
    return (
      <Carousel controls={false} >
        <Carousel.Item>
          <img
            className="slides"
            src={slide1}
            alt="First slide"
          />
          <Carousel.Caption className="carousel-caption">
            <h3>First Slide</h3>
            <p>Your text here</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="slides"
            src={slide2}
            alt="Second slide"
          />
          <Carousel.Caption className="carousel-caption">
            <h3>Second Slide</h3>
            <p>Your text here</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="slides"
            src={slide3}
            alt="Third slide"
          />
          <Carousel.Caption className="carousel-caption">
            <h3>Third Slide</h3>
            <p>Your text here</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    );
}

export default Slide;