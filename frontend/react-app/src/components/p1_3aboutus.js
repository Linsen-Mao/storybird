// AboutUs.js
import '../css/p1_3aboutus.css';
import React from 'react';

function AboutUs() {
  const aboutus_data = [
    {
      title: '專案經理',
      name: '王小明',
      img: require('../img/monster02.png'),
      description: '...'
    },
    {
      title: '前端',
      name: '王小明',
      img: require('../img/monster03.png'),
      description: '...'
    },
    {
      title: '前端',
      name: '王小明',
      img: require('../img/monster03.png'),
      description: '...'
    },
    {
      title: '前端',
      name: '王小明',
      img: require('../img/monster03.png'),
      description: '...'
    },
    {
      title: '後端',
      name: '王小明',
      img: require('../img/monster04.png'),
      description: '...'
    },
    {
      title: '後端',
      name: '王小明',
      img: require('../img/monster04.png'),
      description: '...'
    }
  ];
  
  return (
    <div id="aboutUs" className="bg-light p-5">
      <h1 className="featurette-heading text-center mb-4">我們的團隊</h1>
      <hr className="featurette-divider"/>
      <div className="container">
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-6 g-3">
          {aboutus_data.map((item, index) => (
            <div className="col" key={index}>
              <div className="card shadow-sm">
                <img src={item.img} />
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">{item.name}</p>
                  <p className="card-text">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AboutUs;
