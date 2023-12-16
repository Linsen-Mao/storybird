import React, { useRef, useState, useEffect } from "react";
import Design from "./Design";
import './DesignList.css'

const DesignList = () => {

    // Initial slide passed by prop
    //const { startData, writer } = props;
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

    const writer = true;

    // Save Button Click
    const designComponentsRef = useRef([]); // Ref to store Design component references

    //var dataList = [];

    /*const handleDesignData = (designId, designData) => {
        // TODO: process received data -> send data to backend (JSON file list)
        console.log("received data from id " + designId + ": " + designData);

        dataList = dataList.concat(designData);
        //setDataList(prevDataList => [...prevDataList, designData]);
        console.log("--------------");
        console.log(dataList);
    }*/

    // Function to trigger sending data from all Design components
    /*const sendAllDesignDataToParent = () => {
        designComponentsRef.current.forEach(designRef => {
        designRef.sendDataToParent();
        });
        console.log("SEND");
        console.log(dataList);
        dataList = [];
        //const jsonData = JSON.stringify(dataList)
        //console.log(jsonData);
        //dataList = [];
        //setDataList([]);
    };*/


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
    
    //actual code
    const [slideList, setSlideList] = useState(prepareStartData());   
    

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
        const newID = slideList.length + 1;
        const newSlide = 
            {id: newID, 
            slide: <Design 
                    key={""+newID} 
                    id={""+newID} 
                    /*sendDataToParent={handleDesignData}
                    ref={el => {
                        designComponentsRef.current[newID] = el; 
                      }}*/
                    imageFile="https://uxwing.com/wp-content/themes/uxwing/download/video-photography-multimedia/upload-image-icon.png"
                    caption="" 
                    fontFamily="Arial, Helvetica, sans-serif" 
                    size="16px" 
                    color="#000000"
                    style="img text"
                    editText={writer}/>}

        const newSlideList = [...slideList, newSlide];
        setSlideList(newSlideList);
        setCurrentSlideIndex(newID-1);
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

export default DesignList;