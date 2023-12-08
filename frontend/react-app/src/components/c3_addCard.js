// AddCard.js
import '../css/c3_addCard.css';
import React from 'react';

const AddNewItemCard = () => {
  return (
    <div className="addCard">
      <div className="card text-center">
      <div className="card-body">
        <h5 className="card-title">新增項目</h5>
        <p className="card-text">點擊此處新增項目</p>
      </div>
      </div>
    </div>
  );
};

export default AddNewItemCard;
