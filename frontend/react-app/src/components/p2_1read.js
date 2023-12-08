// Read.js
import '../css/p2_1read.css';
import P2_1_1WorkCarousel from './p2_1_1workCarousel.js';
import P2_1_2WorkInfo from './p2_1_2workinfo.js';
import React from 'react';

const Read = () => {
   return (
    <div id="read">
        <div className='container mt-5 mb-5'>
            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-6 g-3">
            <div id="workCarousel" className="col-9 col-sm-6 col-md-3">
                <P2_1_1WorkCarousel />
            </div>
            <div id="workInfo" className="col-3 col-sm-6 col-md-3">
                <P2_1_2WorkInfo />
            </div>
            </div>
        </div>
    </div>
    )
}

export default Read;