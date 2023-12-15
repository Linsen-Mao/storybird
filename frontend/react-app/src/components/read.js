import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/read.css';
import C4_WorkImage from './c4_workImages.js';

const Read = () => {
    const { storyID } = useParams();
    const [images, setImages] = useState([]);
    const [info, setInfo] = useState({});
    const [loading, setLoading] = useState(true);

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
        return <div className="loading-spinner">Loading...</div>;
    } else {
        return (
            <div id="read" className='mt-5 p-5'>
                <h2 className="featurette-heading text-center mb-4">{info.title}</h2>
                <div className="d-flex justify-content-center">
                    <button type="button" className="btn btn-outline-secondary">Create My Own Story</button>
                </div>
                <hr className="featurette-divider" />
                {/* 渲染的故事圖片 */}
                <C4_WorkImage imageData={{ images }} />
                <div className='container mt-5 mb-5'>
                    <div id="workInfo" className="row featurette">
                        <h4 className="col-sm-12">Story information</h4>
                        <hr className="featurette-divider" />
                        <p className="col-sm-12">{info.description}</p>
                        <p className="col-12">{info.category.name}: {info.category.description}</p>
                        <p className="col-12">creator: {info.creator.username}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Read;
