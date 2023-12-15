// Image.js
// 渲染作品圖片

import React from 'react';
import '../css/c5_image.css';

const Image = ({ id, image, caption }) => {
  return (
    <div className="image-container">
      <img className="image" src={`http://localhost:4000/${image}`} alt={`Image ${id}`} />
      {caption && <div className="caption">{caption}</div>}
    </div>
  );
}

export default Image;

