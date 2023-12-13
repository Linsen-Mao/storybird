import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import '../css/Design.css';

const Design = forwardRef((props, ref) => {

    const { id, textLeft, textRight, fontFamily, size, color, sendDataToParent } = props; 

    const [selectedColor, setSelectedColor] = useState(color); // Initial color: black

    const handleColorChange = (e) => {
        setSelectedColor(e.target.value);
    };

    const [selectedFontFamily, setSelectedFontFamily] = useState(fontFamily);

    const handleFontChange = (event) => {
        switch(event.target.value) {
            case "Times New Roman": setSelectedFontFamily("'Times New Roman', Times, serif"); break;
            case "Georgia": setSelectedFontFamily('Georgia, serif'); break;
            case "Garamond": setSelectedFontFamily("Garamond, serif"); break;
            case "Arial": setSelectedFontFamily("Arial, Helvetica, sans-serif"); break;
            case "Tahoma": setSelectedFontFamily("Tahoma, Verdana, sans-serif"); break;
            case "Trebuchet MS": setSelectedFontFamily("'Trebuchet MS', Helvetica, sans-serif"); break;
            case "Geneva": setSelectedFontFamily("Geneva, Verdana, sans-serif"); break;
            case "Courier New": setSelectedFontFamily("'Courier New', Courier, monospace"); break;
            case "Brush Script MT": setSelectedFontFamily("'Brush Script MT', cursive"); break;
            case "Copperplate": setSelectedFontFamily("Copperplate, Papyrus, fantasy");break;
            default: setSelectedFontFamily("Arial, Helvetica, sans-serif");
        }
    }

    const [selectedSize, setSelectedSize] = useState(size);

    const handleSizeChange = (event) => {
        const fontSize = event.target.value + "px"
        setSelectedSize(fontSize);
    }


    const handleStyleChange = (event) => {
        const elementID = parseInt(id) -1


        switch (event.target.value) {
            case "text text": 
                document.getElementsByClassName("textInputLeft")[elementID].style.display = "block";
                document.getElementsByClassName("textInputRight")[elementID].style.display = "block";
                document.getElementsByClassName("uploadPictureLeft")[elementID].style.display = "none";
                document.getElementsByClassName("uploadPictureRight")[elementID].style.display = "none";
                break;
            case "text img": 
                document.getElementsByClassName("textInputLeft")[elementID].style.display = "block";
                document.getElementsByClassName("textInputRight")[elementID].style.display = "none";
                document.getElementsByClassName("uploadPictureLeft")[elementID].style.display = "none";
                document.getElementsByClassName("uploadPictureRight")[elementID].style.display = "block";
                break;
            case "img text": 
                document.getElementsByClassName("textInputLeft")[elementID].style.display = "none";
                document.getElementsByClassName("textInputRight")[elementID].style.display = "block";
                document.getElementsByClassName("uploadPictureLeft")[elementID].style.display = "block";
                document.getElementsByClassName("uploadPictureRight")[elementID].style.display = "none";
                break;
            case "img img": 
                document.getElementsByClassName("textInputLeft")[elementID].style.display = "none";
                document.getElementsByClassName("textInputRight")[elementID].style.display = "none";
                document.getElementsByClassName("uploadPictureLeft")[elementID].style.display = "block";
                document.getElementsByClassName("uploadPictureRight")[elementID].style.display = "block";
                break;
            default: 
                document.getElementsByClassName("textInputLeft")[elementID].style.display = "block";
                document.getElementsByClassName("textInputRight")[elementID].style.display = "block";
                document.getElementsByClassName("uploadPictureLeft")[elementID].style.display = "none";
                document.getElementsByClassName("uploadPictureRight")[elementID].style.display = "none";
                break;
        }
    }


    // TextArea

    //update value of textArea on the left side
    const [textValueLeft, setTextValueLeft] = useState(textLeft);

    const handleInputChangeLeft = (event) => {
        setTextValueLeft(event.target.value);
    };

    //update value of textArea on the right side
    const [textValueRight, setTextValueRight] = useState(textRight);

    const handleInputChangeRight = (event) => {
        setTextValueRight(event.target.value);
    };
    
    const handleFocus = (event) => {
        event.target.style.outline = "dashed 1px black";
    }

    const handleBlur = (event) =>  {
        event.target.style.outline = "dashed 0.5px grey";
        
        //if you want the outline if the textarea to disappear, once somethig is written into the textarea
        /*if(event.target.value === "") {
            event.target.style.outline = "dashed 0.5px grey";
        } else {
            event.target.style.outline = "none";
        }*/      
    }


    // Upload Images
    const inputRefLeft = useRef(null);
    const inputRefRight = useRef(null);

    const [imageLeft, setImageLeft] = useState("");
    const [imageRight, setImageRight] = useState("");

    const handleImageLeftClick = () => {
        inputRefLeft.current.click();
    }

    const handleImageRightClick = () => {
        inputRefRight.current.click();
    }

    const handleImageLeftChange = (event) => {
        console.log(event.target.files[0]);
        setImageLeft(event.target.files[0]);
    }

    const handleImageRightChange = (event) => {
        console.log(event.target.files[0]);
        setImageRight(event.target.files[0])
    }



    // send data to parent  

    const prepareData = () => {

        // prepare fontfamily data
        const fontFamilyList = ["'Times New Roman', Times, serif", "Georgia, serif", "Garamond, serif", "Arial, Helvetica, sans-serif" ,"Tahoma, Verdana, sans-serif", "'Trebuchet MS', Helvetica, sans-serif", "Geneva, Verdana, sans-serif", "'Courier New', Courier, monospace", "'Brush Script MT', cursive", "Copperplate, Papyrus, fantasy"]

        const prepareFontData = {}; //object
        fontFamilyList.forEach((font, index) => {
            prepareFontData[font] = index;
        });

        const fontData = prepareFontData[selectedFontFamily];
        console.log("font: " + fontData)

        // prepare style data
        const styleList = ["text text", "text img", "img text", "img img"]

        const prepareStyleData = {};
        styleList.forEach((style, index) => {
            prepareStyleData[style] = index;
        });

        const elementID = parseInt(id) - 1
        const styleDescription = document.getElementsByClassName("selectStyle")[elementID];
        const styleData = styleDescription? 0 : prepareStyleData[styleDescription];
        console.log("style: " + styleData);

        // create data
        const data = {
            pageId: id, //number
            style: styleData, //number
            font: fontData, //number
            size: parseInt(selectedSize), //number
            color: selectedColor, //text (hex number)
            textLeft: textValueLeft, //text
            textRight: textValueRight, //text
            imageLeft: imageLeft, //image file
            imageRight: imageRight //image file
        }

        //TODO REMOVE 10.5 from size list!!!

        

        const jsonData = JSON.stringify(data)

        return jsonData;
    }

    const sendDesignDataToParent = () => {
        const jsonData = prepareData();
        sendDataToParent(id, jsonData);
    }

    // Expose function to send data to the parent using ref
    useImperativeHandle(ref, () => ({
        sendDataToParent: sendDesignDataToParent,
    }));



    return(
        
        <div className="design-container">

            <div className="style">

                <select className="selectStyle" onChange={handleStyleChange}>
                    <option selected disabled>style</option>
                    <option>text text</option>
                    <option>text img</option>
                    <option>img text</option>
                    <option>img img</option>
                </select>

                <select className="selectFont" text='font' onChange={handleFontChange}>
                    <option selected disabled>Select a font</option>
                    <option className="timesNewRoman">Times New Roman</option>
                    <option className='georgia'>Georgia</option>
                    <option className='garamond'>Garamond</option>
                    <option className="arial">Arial</option>
                    <option className='tahoma'>Tahoma</option>
                    <option className='trebuchetMS'>Trebuchet MS</option>
                    <option className='geneva'>Geneva</option>
                    <option className='courierNew'>Courier New</option>
                    <option className='brushScriptMT'>Brush Script MT</option>
                    <option className='copperplate'>Copperplate</option>

                </select>

                <select className="selectSize" text='size' onChange={handleSizeChange}>
                    <option value="" selected disabled>Select a size</option>
                    <option>8</option>
                    <option>9</option>
                    <option>10</option>
                    <option>10.5</option>
                    <option>11</option>
                    <option>12</option>
                    <option>14</option>
                    <option>16</option>
                    <option>18</option>
                    <option>20</option>
                    <option>22</option>
                    <option>24</option>
                    <option>26</option>
                    <option>28</option>
                    <option>36</option>
                    <option>48</option>
                    <option>72</option>
                </select>


                <label htmlFor="colorPicker">Choose a color:</label>
                <input
                    className="selectColor"
                    type="color"
                    id="colorPicker"
                    value={selectedColor}
                    onChange={handleColorChange}
                />

                <button>save</button>

            </div>

            <div className="designPage">
                <textarea
                    className="textarea textInputLeft"
                    value={textValueLeft}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleInputChangeLeft}
                    placeholder="Type here..."
                    style={{color: selectedColor, fontSize: selectedSize, fontFamily: selectedFontFamily}}
                />

                <div onClick={handleImageLeftClick}>
                    {imageLeft ? <img className="uploadPictureLeft" src={URL.createObjectURL(imageLeft)}/> : <img className="uploadPictureLeft" src="https://uxwing.com/wp-content/themes/uxwing/download/video-photography-multimedia/upload-image-icon.png"/>}
                    <input
                        type="file"
                        ref={inputRefLeft}
                        onChange={handleImageLeftChange}
                        style={{ display: "none"}}
                    />
                </div>
            

                <textarea
                    className="textarea textInputRight"
                    value={textValueRight}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleInputChangeRight}
                    placeholder="Type here..."
                    style={{color: selectedColor, fontSize: selectedSize, fontFamily: selectedFontFamily}}
                />

                
                <div onClick={handleImageRightClick}>
                    {imageRight ? <img className="uploadPictureRight" src={URL.createObjectURL(imageRight)}/> : <img className="uploadPictureRight" src="https://uxwing.com/wp-content/themes/uxwing/download/video-photography-multimedia/upload-image-icon.png"/>}
                    <input
                        type="file"
                        ref={inputRefRight}
                        onChange={handleImageRightChange}
                        style={{ display: "none"}}
                    />
                </div>

            </div>

            <p>size: {selectedSize}</p>
            <p>fontFamily: {selectedFontFamily}</p>
            <p>color: {selectedColor}</p>
        </div>
        
        
    );
})

export default Design;
