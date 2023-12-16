// Intruction.js
import '../css/p1_2instruction.css';
import React from 'react';

function Instruction() {
  const instructions_data = [
    {
      img: require('../img/monster02.png'),
      description: '登入後，點擊右上角的「新增書本」按鈕，即可新增書本。'
    },
    {
      img: require('../img/monster03.png'),
      description: '查看書本詳細資訊，點擊書本封面即可。'
    },
    {
      img: require('../img/monster04.png'),
      description: '點擊書本詳細資訊頁面的「編輯」按鈕，即可編輯書本資訊。'
    }
  ];

  return (
    <div id="instruction" className="p-5">
      <h1 className="featurette-heading text-center mb-4">如何使用</h1>
      <hr className="featurette-divider"/>
      <div className='container'>
        <div className='row'>
          {instructions_data.map((item, index) => (
            <div className='col-md-4' key={index}>
              <div className='mb-4 p-4 bg-white rounded shadow'>
                <div className='text-center mb-3'>
                  <img src={item.img} alt={`Instruction ${index + 1}`} className='img-fluid img-thumbnail' />
                </div>
                <p className='font-size-large text-center'>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Instruction;
