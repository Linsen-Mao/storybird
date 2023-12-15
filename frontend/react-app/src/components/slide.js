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
            <h3>綠色能源的未來之旅</h3>
            <p>先進科技，開啟可持續的全新時代</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="slides d-block w-100"
            src={slide2}
            alt="Second slide"
          />
          <Carousel.Caption className="carousel-caption">
            <h3>藍色夢幻 逐夢而飛</h3>
            <p>女孩將夢想注入藍天之巔，編織出美麗的時光</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="slides d-block w-100"
            src={slide3}
            alt="Third slide"
          />
          <Carousel.Caption className="carousel-caption">
            <h3>孤獨島嶼的寧靜之美</h3>
            <p>一座孤獨的島嶼，卻有著無限的寧靜之美</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    );
}

export default Slide;
