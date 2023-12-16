// Intruction.js
import '../css/p1_2instruction.css';
import React from 'react';

function Instruction() {
  const instructions_data = [
    {
      title: 'Image Gallery',
      description: 'Use other people\'s images to create your own work.'
    },
    {
      title: 'My Images',
      description: 'You can upload your own images and use them to create your own work.'
    },
    {
      title: 'My Works',
      description: 'You can see the works you have created here.'
    }
  ];

  return (
    <div id="instruction" className="container p-3 mt-5">
      <h1 className="featurette-heading text-center mb-4">How to use?</h1>
      <hr className="featurette-divider"/>
      <div className='container'>
        <div className='row'>
          {instructions_data.map((item, index) => (
            <div className='col-md-4' key={index}>
              <div className='mb-4 p-4 bg-white rounded shadow'>
                {/* <div className='text-center mb-3'>
                  <img src={item.img} alt={`Instruction ${index + 1}`} className='img-fluid img-thumbnail' />
                </div> */}
                <h3 className='text-center'>{item.title}</h3>
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
