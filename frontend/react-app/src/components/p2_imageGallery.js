import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ImageCard from './c2_imageCard'; 
import Spinner from 'react-bootstrap/Spinner';
import '../css/p2_imageGallery.css';

const ImageGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('All'); // 可以改為 const [selectedCategory, setSelectedCategory] = useState(0);
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStories = async () => {
    try {
      const response = await fetch('http://localhost:4000/stories',{
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      // Validate the response structure
      const stories = data && data.stories ? data.stories : [];
      return stories;
    } catch (error) {
      console.error('Error fetching stories:', error);
      return [];
    }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:4000/categories', {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      // Validate the response structure
      const categories = data && data.categories ? data.categories : [];
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  };

  const fetchCateStories = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:4000/stories/categories/${categoryId}`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      // Validate the response structure
      const stories = data && data.stories ? data.stories : [];
      return stories;
    } catch (error) {
      console.error('Error fetching stories:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let storiesData = [];
        const categoriesData = await fetchCategories();
        if (selectedCategory === 'All') {
          storiesData = await fetchStories();
        } else {
          const selectedCategoryObject = categoriesData.find(category => category.id === parseInt(selectedCategory, 10));
          const categoryId = selectedCategoryObject ? selectedCategoryObject.id : '';
          storiesData = await fetchCateStories(categoryId);
        }
        setStories(storiesData);
        setCategories(categoriesData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory]);
  
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const renderImages = () => {
    const filteredData = stories.reduce((result, story) => ({
      images: result.images.concat(story.coverImage),
      ids: result.ids.concat(story.id),
      title: result.title.concat(story.title),
      categories: result.categories.concat(story.category ? story.category.name : ''),
    }), { images: [], ids: [] , title: [], categories: []});

    const filteredImages = filteredData.images;
    const filteredIDs = filteredData.ids;
    const filteredTitles = filteredData.title;
    const filteredCategories = filteredData.categories;
    if (loading) {
      return <span><Spinner animation="border" />Loading...</span>;
    }

    if (filteredImages.length === 0) {
      return <p>No images found.</p>;
    }

    return (
      <div className="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-3">
        {filteredImages.map((img, imgIndex) => (
        <div key={imgIndex} className="col">
          <Link to={`/read/story/${filteredIDs[imgIndex]}`} className="navbar-brand">
            <ImageCard
              src={`http://localhost:4000/${img}`}
              alt={filteredIDs[imgIndex]}
              title={filteredTitles[imgIndex]}
              category={filteredCategories[imgIndex]}
            />
          </Link>
        </div>
      ))}
      </div>
    );
  };

  return (
    <div id="imageGallery" className="mt-5 container">
      <h1 className="featurette-heading text-center mb-4">Image Gallery</h1>
      <hr className="featurette-divider" />
      <div className="container filter-container">
        <label htmlFor="categorySelect">Category：</label>
        <select
          id="categorySelect"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="All">ALL</option>
          {categories.map((category, index) => (
            <option key={index} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="image-list container">
        {renderImages()}
      </div>
    </div>
  );
};

export default ImageGallery;
