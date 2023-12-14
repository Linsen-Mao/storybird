// MyGallery.js
import '../css/p3_1myGallery.css';
import ImageCard from './c2_imageCard';
import AddNewItemCard from './c3_addCard';
import React, {useState} from 'react';
import { Link } from 'react-router-dom';

function MyGallery({stories, image}) {
    // images to myImage
    const myImage = [
        {
            id: 1,
            src: require('../img/bg_school_room.jpg'),
            title: 'My Image 1',
            alt: 'My Image 1',
            category: 'School'
        },
        // 其他 myImage 的項目
    ];
    // stories to mywork
    const myWork = [
        {
            id: 1,
            src: require('../img/bg_school_room.jpg'),
            title: 'My Work 1',
            alt: 'My Work 1',
            category: 'School'
        },
        // 其他 myWork 的項目
    ];

    const [activeTab, setActiveTab] = useState('myImage');

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
                                我的照片
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeTab === 'myWork' ? 'active' : ''}`}
                                onClick={() => setActiveTab('myWork')}
                            >
                                我的作品
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="card-body">
                    {activeTab === 'myImage' && (
                        <>
                            <h2 className="card-title">我的照片</h2>
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
                            <h2 className="card-title">我的作品</h2>
                            <div className='row row-cols-1 row-cols-md-3 row-cols-lg-4 g-3'>
                                {myWork.map((item) => (
                                    <Link to={`/read/${item.id}`} className="navbar-brand">
                                        <ImageCard key={item.id} src={item.src} alt={item.alt} title={item.title} category={item.category} />
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
