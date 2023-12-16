import React, { useState, useEffect } from "react";
import Design from "./Design";
import "./DesignList.css";

const DesignList = (props) => {
  // Assuming storyID is passed as a prop
  const { preview, storyID } = props;

  const writer = true;
  const [slideList, setSlideList] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Function to fetch images
  const fetchImages = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/stories/${storyID}/images`
      );
      const data = await response.json();
      if (data && data.images && data.images.length > 0) {
        const slides = data.images.map((item) => ({
          id: item.id,
          slide: (
            <Design
              key={item.id}
              id={item.id}
              imageFile={`http://localhost:4000/${item.imageFile}`} // Assuming you need the full URL
              caption={item.caption}
              fontFamily={
                item.style.length > 0
                  ? item.style[0]
                  : "Arial, Helvetica, sans-serif"
              }
              size={item.style.length > 1 ? item.style[1] : "16px"}
              color={item.style.length > 2 ? item.style[2] : "#000000"}
              style={item.style.length > 3 ? item.style[3] : "img text"}
              editText={writer}
              preview={preview}
            />
          ),
        }));
        setSlideList(slides);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [storyID]); // Dependency on storyID

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

  const saveCaption = async (imageID, caption) => {
    try {
      const response = await fetch(
        `http://localhost:4000/stories/${storyID}/images/${imageID}/captions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ caption }),
        }
      );
      if (response.ok) {
        console.log("Caption saved successfully");
      } else {
        console.error("Failed to save caption");
      }
    } catch (error) {
      console.error("Error saving caption:", error);
    }
  };

  // Add button handler to save the caption for the current slide
  const handleSave = () => {
    const currentSlide = slideList[currentSlideIndex];
    if (currentSlide && currentSlide.slide.props.editText) {
      saveCaption(currentSlide.id, currentSlide.slide.props.caption);
    }
  };

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
                   <button className="addSlideBtn">+</button>
                  </div>
                </div>
                
        </div>

        <div className="foot">
          <label className="pageNumber">{currentSlideIndex+1}/{slideList.length}</label>
        </div>
        
    </div>
);
};

export default DesignList;
