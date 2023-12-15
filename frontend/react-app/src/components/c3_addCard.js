// AddCard.js
import '../css/c3_addCard.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddNewItemCard = () => {
  let navigate = useNavigate();

  const addNewStory = async () => {
    let createStoryURL = 'http://localhost:4000/stories'
    try {
        const response = await fetch(createStoryURL)
        const data = await response.json();
        console.log(data)
        navigate('/editPage')

    } catch (err) {console.error(err.message);}
  }
  return (
    <div className="addCard">
      <div className="card text-center">
      <div className="card-body">
        <h5 className="card-title" onClick={addNewStory}>+</h5>
        <p className="card-text">Add New Image</p>
      </div>
      </div>
    </div>
  );
};

export default AddNewItemCard;
