import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/read.css';
import DesignList from './edit/DesignList'; 
import Spinner from 'react-bootstrap/Spinner';

const Read = () => {
  const { storyID } = useParams();
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

  // 抓取故事資訊
  const fetchInfo = async () => {
    try {
      const response = await fetch(`http://localhost:4000/stories/${storyID}`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching information:', error);
      return {};
    }
  };

  // 抓取故事圖片資料
  const fetchImages = async () => {
    try {
      const response = await fetch(`http://localhost:4000/stories/${storyID}/images`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      const imagesData = data?.images || [];
      return imagesData;
    } catch (error) {
      console.error('Error fetching images:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAndSetData = async () => {
      try {
        // 同時抓取故事資訊和圖片資料
        const [infoData, imagesData] = await Promise.all([fetchInfo(), fetchImages()]);
        setInfo(infoData);
        setImages(imagesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        // 在這裡處理錯誤，例如顯示一個錯誤消息給用戶
      }
    };

    fetchAndSetData();
  }, [storyID]);

  if (loading) {
    return <span><Spinner animation="border" />Loading...</span>;
  } else {
    return (
      <div id="read" className="mt-5 p-5">
        <h2 className="featurette-heading text-center mb-4">{info.title}</h2>
        <hr className="featurette-divider" />
        <div className="container mt-5 mb-5">
          <div className="row">
            <div className="col-12 col-lg-8">
              {/* 直接将DesignList组件放在这里 */}
              <DesignList preview={true} />
            </div>
            <div className="col-12 col-lg-4">
              <div id="workInfo" className="featurette">
                <h4>Story information</h4>
                <hr className="featurette-divider" />
                <p>{info.description}</p>
                <p>
                  {info.category.name}: {info.category.description}
                </p>
                <p>Creator: {info.creator.username}</p>
                <button type="button" className="btn btn-outline-secondary">
                    Create My Own Story
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Read;
