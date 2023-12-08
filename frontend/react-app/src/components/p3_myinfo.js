// Myinfo.js
import '../css/p3_myInfo.css';
import MyGallery from './p3_1myGallery.js';
import React from 'react';

function MyInfo() {
    const myInfo = ['王小明', 'example@email.com', require('../img/monster04.png')];
    return (
        <div id="myInfo" className="bg-light mt-5">
            <h1 className="featurette-heading text-center mb-4">我的資料</h1>
            <hr className="featurette-divider" />
            <div className="container">
                <div className="row align-items-stretch">
                    <div id='aboutMe' className='col-12 col-sm-4 col-md-3'>
                        <img src={myInfo[2]} alt='My Picture' className='img-fluid rounded-circle mb-5' />
                        <h5>姓名：{myInfo[0]}</h5>
                        <p>電子郵件：{myInfo[1]}</p>
                    </div>
                    <div id='myGallery' className='col-12 col-sm-8 col-md-9'>
                        <MyGallery />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyInfo;
