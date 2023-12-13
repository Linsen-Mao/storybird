// MyGallery.js
import '../css/p3_1myGallery.css';
import ImageCard from './c2_imageCard';
import AddNewItemCard from './c3_addCard';
import React from 'react';

function MyGallery({stories}) {
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

    return (
        <div className='container'>
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title">我的作品</h2>
                    <div className='row row-cols-1 row-cols-md-3 row-cols-lg-4 g-3'>
                        <AddNewItemCard />
                        <span className='cards' >
                           {myWork.map((item) => (
                            <ImageCard key={item.id} src={item.src} alt={item.alt} title={item.title} category={item.category} />
                            ))} 
                        </span>
                        
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export default MyGallery;