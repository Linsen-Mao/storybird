import React, { useState, useEffect } from "react";
import Design from "./Design";
import "./DesignList.css";
import { useParams } from 'react-router-dom';


const DesignList = () => {
  // Assuming storyID is passed as a prop
  //const { preview, storyID } = props;
  const { storyId } = useParams();
  const preview = false; 

  const writer = true;
  //const [slideList, setSlideList] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Function to fetch images
  /*const fetchImages = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/stories/${storyId}/images`,{
          method: 'GET',
          credentials: 'include'
        });
      const data = await response.json();
      console.log(data);
      if (data && data.images && data.images.length > 0) {
        console.log("here");
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
  };*/
  

  const startData = [
    {
      "id": 1,
      "imageFile": "https://uxwing.com/wp-content/themes/uxwing/download/video-photography-multimedia/upload-image-icon.png",
      "caption": "HAAAALLLOOOO",
      "style": ["Arial, Helvetica, sans-serif", "16px", "#000000", "img text"]
    },
    {
      "id": 2,
      "imageFile": "https://uxwing.com/wp-content/themes/uxwing/download/video-photography-multimedia/upload-image-icon.png",
      "caption": "PUPS",
      "style": ["Arial, Helvetica, sans-serif", "16px", "#000000", "text img"]
    }

  ]


  const prepareStartData = () => {
    let initialSlide = [];

    startData.forEach(element => {
      const newSlide = 
      {
        id: element.id,
        slide: <Design 
                key={element.id} 
                id={element.id} 
                /*sendDataToParent={handleDesignData}
                ref={el => {
                    designComponentsRef.current[1] = el; // Store Design component references
                  }}*/
                imageFile={element.imageFile}
                caption={element.caption} 
                fontFamily={element.style[0]} 
                size={element.style[1]} 
                color={element.style[2]}
                style={element.style[3]}
                editText={writer}
                />
      }

      initialSlide = initialSlide.concat(newSlide);
    })

    return initialSlide;
  }

  const [slideList, setSlideList] = useState(prepareStartData());

  
  const fetchImages = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/stories/${storyId}/images`, {
          method: 'GET',
          credentials: 'include'
        });
      const data = await response.json();
      console.log(data);
  
      /*
      if (data && Array.isArray(data.images)) {
        const slides = data.images.map((item) => {
          // Ensure all necessary properties are defined
          const imageFile = item.imageFile ? `http://localhost:4000/${item.imageFile}` : '';
          const caption = item.caption || '';
          const fontFamily = item.style && item.style.length > 0 ? item.style[0] : "Arial, Helvetica, sans-serif";
          const size = item.style && item.style.length > 1 ? item.style[1] : "16px";
          const color = item.style && item.style.length > 2 ? item.style[2] : "#000000";
          const style = item.style && item.style.length > 3 ? item.style[3] : "img text";

          console.log("item.id: ",item.id);
          console.log("imagefile: ",imageFile);
          console.log("caption: ",caption);
          console.log("fontFamily: ",fontFamily);
          console.log("size: ",size);
          console.log("color: ",style);



  
          return {
            id: item.id,
            slide: (
              <Design
                key={item.id}
                id={item.id}
                imageFile={imageFile}
                caption={caption}
                fontFamily={fontFamily}
                size={size}
                color={color}
                style={style}
                editText={writer}
                preview={preview}
              />
            ),
          };
        });
        setSlideList(slides);
      } else {
        console.log("No images found or data format is incorrect");
      }
      */
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };



  useEffect(() => {
    fetchImages();
  }, [storyId]); // Dependency on storyID

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
        `http://localhost:4000/stories/${storyId}/images/${imageID}/captions`,
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
