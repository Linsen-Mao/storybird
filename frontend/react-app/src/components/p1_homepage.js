//p1_homepage.js
import React from 'react';
import HomeCarousel from './p1_1homeCarousel.js';
import Instruction from './p1_2instruction.js';
import AboutUs from './p1_3aboutus.js';

function Homepage() {
  return (
    <div id='homepage'>
      <HomeCarousel />
      <Instruction />
      <AboutUs />
    </div>
  )
}
export default Homepage;
