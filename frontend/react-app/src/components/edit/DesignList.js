import React, { useRef, useState, useEffect } from "react";
import Design from "./Design";
import './DesignList.css'

const DesignList = (props) => {

    // Initial slide passed by prop
    const { startData } = props;

    //const [slideList, setSlideList] = useState(initialSlides);

    // Save Button Click
    const designComponentsRef = useRef([]); // Ref to store Design component references

    //const [dataList, setDataList] = useState([]);
    var dataList = [];

    const handleDesignData = (designId, designData) => {
        // TODO: process received data -> send data to backend (JSON file list)
        console.log("received data from id " + designId + ": " + designData);

        dataList = dataList.concat(designData);
        //setDataList(prevDataList => [...prevDataList, designData]);
        console.log("--------------");
        console.log(dataList);
    }

    // Function to trigger sending data from all Design components
    const sendAllDesignDataToParent = () => {
        designComponentsRef.current.forEach(designRef => {
        designRef.sendDataToParent();
        });
        console.log("SEND");
        console.log(dataList);
        //const jsonData = JSON.stringify(dataList)
        //console.log(jsonData);
        //dataList = [];
        //setDataList([]);
    };


    const prepareStartData = () => {
      let initialSlide = [];

      const fontFamilyList = ["'Times New Roman', Times, serif", "Georgia, serif", "Garamond, serif", "Arial, Helvetica, sans-serif" ,"Tahoma, Verdana, sans-serif", "'Trebuchet MS', Helvetica, sans-serif", "Geneva, Verdana, sans-serif", "'Courier New', Courier, monospace", "'Brush Script MT', cursive", "Copperplate, Papyrus, fantasy"];

      startData.forEach(element => {

        const font = fontFamilyList[element.font];
        const size = element.size+"px";

        const newSlide = 
        {
          id: element.padeId,
          slide: <Design 
                  key={element.pageId} 
                  id={element.pageId} 
                  sendDataToParent={handleDesignData}
                  ref={el => {
                      designComponentsRef.current[1] = el; // Store Design component references
                    }}
                  textLeft={element.textLeft} 
                  textRight={element.textRight} 
                  fontFamily={font} 
                  size={size} 
                  color={element.color}
                  style={element.style}/>
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
                    sendDataToParent={handleDesignData}
                    ref={el => {
                        designComponentsRef.current[newID] = el; 
                      }}
                    textLeft={""} 
                    textRight={""} 
                    fontFamily="Arial, Helvetica, sans-serif" 
                    size="16px" 
                    color="#000000"
                    style="img text"/>}

        const newSlideList = [...slideList, newSlide];
        setSlideList(newSlideList);
        setCurrentSlideIndex(newID-1);
    }


    return(        
        <div className="container">
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
                      <div className="space"/>
                    </div>
                    
            </div>

            <div className="foot">
              <div className="boxPageNumber">
                <label className="pageNumber">{currentSlideIndex+1}/{slideList.length}</label>
              </div>
                
              <div className="boxBtnRight">
                <button className="btnRight" onClick={addSlide}>+</button>
                <button className="btnRight" onClick={sendAllDesignDataToParent}>save</button>
                <div className="space2"/>
              </div>
  
              
            </div>
            
        </div>
    );
}

export default DesignList;