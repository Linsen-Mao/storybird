import React, { useState, useEffect } from "react";
import DesignPage from "./DesignPage";
import './EditPage.css'
import { useParams } from 'react-router-dom';


const EditPage = (props) => {

    const { storyId } = useParams();
    const { storyId: storyIdFromProps, preview } = props;

    const resolvedStoryId = storyId || storyIdFromProps;

    const writer = true;

    // Initial slide passed by prop
    //const { startData, writer } = props;

    // Save Button Click
    //const designComponentsRef = useRef([]); // Ref to store Design component references

    const [slideList, setSlideList] = useState([]);

    const getInitialData = async() => {
        try {
            const response = await fetch(
              `http://localhost:4000/stories/${resolvedStoryId}/images`, {
                method: 'GET',
                credentials: 'include'
              });
            const data = await response.json();
            console.log("data:\n",data);

            let initialSlide = [];

            for(let i = 0; i < data.images.length; i++) {
              const element = data.images[i];
              const newSlide = 
              {
                pageId: i,
                slide: <DesignPage 
                        key={element.id} 
                        id={element.id} 
                        pageId={i}
                        imageFile={element.imageFile ? `http://localhost:4000/${element.imageFile}` : ''}
                        caption={element.caption || ''} 
                        fontFamily={element.style && element.style.length > 0 ? element.style[0] : "Arial, Helvetica, sans-serif"} 
                        size={element.style && element.style.length > 1 ? element.style[1] : "16px"} 
                        color={element.style && element.style.length > 2 ? element.style[2] : "#000000"}
                        style={element.style && element.style.length > 3 ? element.style[3] : "img text"}
                        editText={writer}
                        />
              }

              initialSlide = initialSlide.concat(newSlide);
            }
            
            console.log("initialSlide: \n", initialSlide)
            setSlideList(initialSlide);

        } catch (error) {
            console.error("Error fetching images:", error);
        }
    }
    
    //actual code
    
    useEffect(() => {
      getInitialData();
    }, [resolvedStoryId]);
    

    // Slide through slides 
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const showPreviousSlide = () => {
        if (currentSlideIndex > 0) {
        setCurrentSlideIndex(currentSlideIndex - 1);
        }
    };

    const showNextSlide = () => {
        if (currentSlideIndex < slideList.length - 1) {
        setCurrentSlideIndex(currentSlideIndex + 1);
        }
    };

    const addSlide = () => {
        const newID = slideList.length;
        const newSlide = 
            {pageId: newID, 
            slide: <DesignPage 
                    key={newID} //??
                    id={newID} //??
                    pageId={newID}
                    imageFile="https://uxwing.com/wp-content/themes/uxwing/download/video-photography-multimedia/upload-image-icon.png"
                    caption="" 
                    fontFamily="Arial, Helvetica, sans-serif" 
                    size="16px" 
                    color="#000000"
                    style="img text"
                    editText={writer}/>}

        const newSlideList = [...slideList, newSlide];
        setSlideList(newSlideList);
        setCurrentSlideIndex(newID);
    }


    return(        
        <div className="designList-container">
            <div className="createPage">
                    <div className="divContainer">
                      <div className="space"/>
                      <button className="slideBtn" onClick={showPreviousSlide}>&lt;</button>
                      <div className="space"/>
                    </div>

                    {slideList.map((slide, index) => (
                        <div className="designPage" key={index} style={{ display: index === currentSlideIndex ? 'block' : 'none' }}>
                        {slide.slide}
                        </div>
                    ))}

                    <div className="divContainer">
                      <div className="space"/>
                      <button className="slideBtn" onClick={showNextSlide}>&gt;</button>
                      <div className="space">
                       <button className="addSlideBtn" onClick={addSlide}>+</button>
                      </div>
                    </div>
                    
            </div>

            <div className="foot">
              <label className="pageNumber">{currentSlideIndex+1}/{slideList.length}</label>
            </div>
            
        </div>
    );
}

export default EditPage;