// WorkInfo.js
import '../css/p2_1_2workinfo.css';
import React from 'react';

const WorkInfo = () => {
  const work_data = [
    { category: 'Monster', author: '王小明', description: '這是一隻可愛的怪獸', alt: 'Monster Image 1' }
    ];
  const other_work_data = [
  { category: 'Monster', src: require('../img/monster01.png'), alt: 'Monster Image 1' }
  ];
  return (
    <div id="workInfo">
        <h1 className="featurette-heading text-center mb-4">作品資料</h1>
        <hr className="featurette-divider" />
        <div className="row featurette">
            <div>
                <h2 className="featurette-heading">{work_data[0].category}</h2>
                <p className="lead">作者：{work_data[0].author}</p>
                <p>{work_data[0].description}</p>
            </div>
        </div>
    </div>
  )
}

export default WorkInfo;