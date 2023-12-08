// ImageGallery.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ImageCard from './c2_imageCard'; 
import '../css/p2_imageGallery.css';

const ImageGallery = () => {
  const image_data = [
    { category: 'Monster', src: require('../img/monster01.png'), alt: 'Monster Image 1' },
    { category: 'Monster', src: require('../img/monster01.png'), alt: 'Monster Image 2' },
    // Add more images with different categories
    // ...
    { category: 'School', src: require('../img/bg_school_room.jpg'), alt: 'School Image 1' },
    { category: 'School', src: require('../img/bg_school_room.jpg'), alt: 'School Image 2' },
  ];

  const categories = [...new Set(image_data.map((img) => img.category))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const filteredImages = image_data.filter(
    (img) => selectedCategory === 'All' || img.category === selectedCategory
  );

  return (
    <div id="imageGallery" className="mt-5 container">
      <h1 className="featurette-heading text-center mb-4">圖片庫</h1>
      <hr className="featurette-divider" />
      <div className="container filter-container">
        <label htmlFor="categorySelect">類別：</label>
        <select
          id="categorySelect"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="All">全部</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="image-list container">
        <div className="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-3">
          {filteredImages.map((img, imgIndex) => (
            // Add Link to ImageCard 
            <div key={imgIndex} className="col">
              <Link to={'/read'} className="navbar-brand">
              <ImageCard src={img.src} alt={img.alt} title={img.alt} category={img.category} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;