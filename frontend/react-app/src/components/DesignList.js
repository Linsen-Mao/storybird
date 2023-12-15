import React, { useRef, useState, useEffect } from "react";
import Design from "./Design";
import '../css/DesignList.css'

const DesignList = () => {




    // Save Button Click
    const designComponentsRef = useRef([]); // Ref to store Design component references

    //const [dataList, setDataList] = useState([]);
    let dataList = [];

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
        dataList = [];
        //setDataList([]);
    };




    // Initial Slide List
    const [slideList, setSlideList] = useState([
        {
            id: 1,
            slide: <Design 
                    key="1" 
                    id="1" 
                    sendDataToParent={handleDesignData}
                    ref={el => {
                        designComponentsRef.current[1] = el; // Store Design component references
                      }}
                    textLeft="left1" 
                    textRight="right1" 
                    fontFamily="Arial, Helvetica, sans-serif" 
                    size="16px" 
                    color="#000000"/>
        },
        {
            id: 2,
            slide: <Design 
                    key="2" 
                    id="2"
                    sendDataToParent={handleDesignData}
                    ref={el => {
                        designComponentsRef.current[2] = el; 
                      }} 
                    textLeft="left2" 
                    textRight="right2" 
                    fontFamily="Arial, Helvetica, sans-serif" 
                    size="16px" 
                    color="#000000"/>
        },
        {
            id: 3,
            slide: <Design 
                    key="3" 
                    id="3" 
                    sendDataToParent={handleDesignData}
                    ref={el => {
                        designComponentsRef.current[3] = el; 
                      }}
                    textLeft="left3" 
                    textRight="right3" 
                    fontFamily="Arial, Helvetica, sans-serif" 
                    size="16px" 
                    color="#000000"/>
        },
      ]);


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
                    textLeft={"textLeft"+newID} 
                    textRight={"textRight"+newID} 
                    fontFamily="Arial, Helvetica, sans-serif" 
                    size="16px" 
                    color="#000000"/>}

        const newSlideList = [...slideList, newSlide];
        setSlideList(newSlideList);
        setCurrentSlideIndex(newID-1);
    }



    // Attempt to insert a new Slide after current Slide
    // TODO: not working
    const insertNewSlide = (newId) => {
        setSlideList(prevSlides => {
          return prevSlides.map(slide => {
            if (slide.id >= newId) {
              return {
                ...slide,
                id: slide.id + 1,
              };
            }
            return slide;
          }).concat({
            id: newId,
            slide: <Design id={newId} textLeft={`leftText${newId}`} textRight={`rightText${newId}`} fontFamliy="Arial, Helvetica, sans-serif" size="16px" color="#000000" />,
          });
        });
      };

      const handleNewSlideClick = () => {
        insertNewSlide(currentSlideIndex+1);
      }


    return(
        <div className="container">
            <div className="createPage">
                    <button onClick={showPreviousSlide}>-</button>

                    {slideList.map((slide, index) => (
                        <div className="designPage" key={index} style={{ display: index === currentSlideIndex ? 'block' : 'none' }}>
                        {slide.slide}
                        </div>
                    ))}

                    
                    <button onClick={showNextSlide}>+</button>
                    <button onClick={addSlide}>add</button>
            </div>

            <h1>{currentSlideIndex}</h1>
            <button onClick={sendAllDesignDataToParent}>Send Data!</button>
        </div>
    );
}

export default DesignList;