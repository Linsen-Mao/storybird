import '../css/p3_1myGallery.css';
import ImageCard from './c2_imageCard';
import AddNewItemCard from './c3_addCard';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MyGallery({ authUserID }) {
  const [myImage, setMyImage] = useState([]);
  const [myWork, setMyWork] = useState([]);
  const [activeTab, setActiveTab] = useState('myImage');

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/users/${authUserID}/stories`, {
          method: 'GET',
          credentials: 'include'
        });
        const data = await response.json();
        // Validate the response structure
        const myImageData = data && data.createdStories ? data.createdStories : [];
        const myWorkData = data && data.writtenStories ? data.writtenStories : [];
        setMyImage(myImageData);
        setMyWork(myWorkData);
      } catch (error) {
        console.error('Error fetching stories:', error);
        // Handle error if needed
      }
    };

    fetchMyData();
  }, [authUserID]);

  return (
    <div className='container'>
      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'myImage' ? 'active' : ''}`}
                onClick={() => setActiveTab('myImage')}
              >
                My Image
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'myWork' ? 'active' : ''}`}
                onClick={() => setActiveTab('myWork')}
              >
                My Work
              </a>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {activeTab === 'myImage' && (
            <>
              <h2 className="card-title">My Image</h2>
              <div className='row row-cols-1 row-cols-md-3 row-cols-lg-4 g-3'>
                <AddNewItemCard />
                {myImage.map((item) => (
                  <ImageCard key={item.id} src={item.src} alt={item.alt} title={item.title} category={item.category} />
                ))}
              </div>
            </>
          )}
          {activeTab === 'myWork' && (
            <>
              <h2 className="card-title">My Work</h2>
              <div className='row row-cols-1 row-cols-md-3 row-cols-lg-4 g-3'>
                <Link to="/imageGallery" className="navbar-brand">
                  <div className="addCard">
                  <div className="card text-center">
                    <div className="card-body">
                      <h5 className="card-title">Image MyGallery</h5>
                      <p className="card-text">Add New Story</p>
                    </div>
                  </div>
                  </div>
                </Link>
                {myWork.map((item) => (
                  <Link to={`/read/story/${item.id}`} className="navbar-brand">
                    <ImageCard key={item.id} src={item.coverImage} alt={item.id} title={item.title} />
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyGallery;
