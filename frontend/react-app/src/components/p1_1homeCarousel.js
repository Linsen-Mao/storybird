// HomeCarousel.js
import '../css/p1_1homeCarousel.css';
import React from 'react';

const HomeCarousel = () => {
  const carousel_data = [
    {
      cover: require('../img/electric-car-2545290_1280.png'),
      title: '綠色能源的未來之旅',
      description: '先進科技，開啟可持續的全新時代。'
    },
    {
      cover: require('../img/girl-8435340_1280.png'),
      title: '藍色夢幻 逐夢而飛',
      description: '女孩將夢想注入藍天之巔，編織出美麗的時光。'
    },
    {
      cover: require('../img/homes-8194751_1280.png'),
      title: '孤獨島嶼的寧靜之美',
      description: '一座孤獨的島嶼，卻有著無限的寧靜之美。'
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
