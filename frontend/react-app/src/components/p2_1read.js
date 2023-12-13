// Read.js
import '../css/p2_1read.css';
import P2_1_1WorkCarousel from './p2_1_1workCarousel.js';
// import P2_1_2WorkInfo from './p2_1_2workinfo.js';
import React from 'react';

const Read = () => {
   return (
    <div id="read">
        <div className='container mt-5 mb-5'>
            <P2_1_1WorkCarousel />
        </div>
    </div>
    )
}

export default Read;