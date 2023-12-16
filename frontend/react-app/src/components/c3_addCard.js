// AddCard.js
import '../css/c3_addCard.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddNewItemCard = () => {

  return (
    <div className="addCard">
      <div className="card text-center">
      <div className="card-body">
        <h5 className="card-title">+</h5>
        <p className="card-text">Add New Image</p>
      </div>
      </div>
    </div>
  );
};

export default AddNewItemCard;
