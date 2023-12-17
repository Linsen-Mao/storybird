import React, { useRef, useState, useEffect } from 'react';
import './Design.css';

const DesignPage = (props) => {

    //editText = boolean, True->edit text/disable upload img, False->upload img/diable edit text
    const { key, id, pageId, imageFile, caption, fontFamily, size, color, style, editText} = props; 

    const [selectedColor, setSelectedColor] = useState(color);

    const handleColorChange = (e) => {
        setSelectedColor(e.target.value);

        const elementID = parseInt(pageId)
        const isSaved = document.getElementsByClassName('isSaved')[elementID];
        isSaved.style.backgroundColor = "rgb(71, 113, 115)";
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

        const elementID = parseInt(pageId)
        const isSaved = document.getElementsByClassName('isSaved')[elementID];
        isSaved.style.backgroundColor = "rgb(71, 113, 115)";
    }

    const [selectedSize, setSelectedSize] = useState(size);

    const handleSizeChange = (event) => {
        const fontSize = event.target.value + "px"
        setSelectedSize(fontSize);

        const elementID = parseInt(pageId)
        const isSaved = document.getElementsByClassName('isSaved')[elementID];
        isSaved.style.backgroundColor = "rgb(71, 113, 115)";
    }


    const handleStyleChange = (event) => {
        const elementID = parseInt(pageId)


        switch (event.target.value) {
            case "text img": 
                document.getElementsByClassName("textInputLeft")[elementID].style.display = "flex";
                document.getElementsByClassName("textInputRight")[elementID].style.display = "none";
                document.getElementsByClassName("imgContainerLeft")[elementID].style.display = "none";
                document.getElementsByClassName("imgContainerRight")[elementID].style.display = "flex";
                break;
            case "img text": 
                document.getElementsByClassName("textInputLeft")[elementID].style.display = "none";
                document.getElementsByClassName("textInputRight")[elementID].style.display = "flex";
                document.getElementsByClassName("imgContainerLeft")[elementID].style.display = "flex";
                document.getElementsByClassName("imgContainerRight")[elementID].style.display = "none";
                break;
            default: 
                document.getElementsByClassName("textInputLeft")[elementID].style.display = "flex";
                document.getElementsByClassName("textInputRight")[elementID].style.display = "none";
                document.getElementsByClassName("imgContainerLeft")[elementID].style.display = "none";
                document.getElementsByClassName("imgContainerRight")[elementID].style.display = "flex";
                break;
        }

        const isSaved = document.getElementsByClassName('isSaved')[elementID];
        isSaved.style.backgroundColor = "rgb(71, 113, 115)";
    }

    // set select-tag option at first render
    useEffect(() => {
        // This function will be called when the component is first rendered
        const elementID = parseInt(pageId)

        if(style!=null) {
            const selectStyle= document.getElementsByClassName('selectStyle')[elementID];

            // Set the selected option by setting the value
            const selectedOptionValue = style; // Change this to the value you want to select
            selectStyle.value = selectedOptionValue;
            selectStyle.dispatchEvent(new Event('change', { bubbles: true }));
        }

        if(!editText) {
            const selectFont = document.getElementsByClassName('selectFont')[elementID];
            selectFont.disabled = true;

            const selectSize = document.getElementsByClassName('selectSize')[elementID];
            selectSize.disabled = true;

            const selectColor = document.getElementsByClassName('selectColor')[elementID];
            selectColor.disabled = true;

            const textLeft = document.getElementsByClassName('textInputLeft')[elementID];
            textLeft.readOnly = true;

            const textRight = document.getElementsByClassName('textInputRight')[elementID];
            textRight.readOnly = true;

            const imgLeft = document.getElementsByClassName('inputFileLeft')[elementID];
            imgLeft.disabled = false;

            const imgRight = document.getElementsByClassName('inputFileRight')[elementID];
            imgRight.disabled = false;
        } 
        else {
            const selectFont = document.getElementsByClassName('selectFont')[elementID];
            selectFont.disabled = false;

            const selectSize = document.getElementsByClassName('selectSize')[elementID];
            selectSize.disabled = false;

            const selectColor = document.getElementsByClassName('selectColor')[elementID];
            selectColor.disabled = false;

            const textLeft = document.getElementsByClassName('textInputLeft')[elementID];
            textLeft.readOnly = false;

            const textRight = document.getElementsByClassName('textInputRight')[elementID];
            textRight.readOnly = false;

            const imgLeft = document.getElementsByClassName('inputFileLeft')[elementID];
            imgLeft.disabled = true;

            const imgRight = document.getElementsByClassName('inputFileRight')[elementID];
            imgRight.disabled = true;
        }
      }, []);


    // TextArea

    //update value of textArea
    const [captionValue, setCaptionValue] = useState(caption);

    const handleInputChange = (event) => {
        setCaptionValue(event.target.value);

        const elementID = parseInt(pageId) 
        const isSaved = document.getElementsByClassName('isSaved')[elementID];
        isSaved.style.backgroundColor = "rgb(71, 113, 115)";
    };
    
    const handleFocus = (event) => {
        event.target.style.outline = "dashed 1px black";
    }

    const handleBlur = (event) =>  {
        event.target.style.outline = "dashed 0.5px grey";
        
        //if you want the outline if the textarea to disappear, once somethig is written into the textarea
        if(event.target.value === "") {
            event.target.style.outline = "dashed 0.5px grey";
        } else {
            event.target.style.outline = "none";
        }      
    }


    // Upload Images
    const inputRef = useRef(null);

    const [image, setImage] = useState(imageFile);

    const handleImageClick = () => {
        inputRef.current.click();
    }

    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        const reader = new FileReader();
    
        reader.onloadend = () => {
          setImage(reader.result); // Set the image in state to display on the frontend
        };
    
        if (selectedFile) {
          reader.readAsDataURL(selectedFile); // Convert the file to a data URL
        }

        const elementID = parseInt(pageId) 
        const isSaved = document.getElementsByClassName('isSaved')[elementID];
        isSaved.style.backgroundColor = "rgb(71, 113, 115)";
    };



    const saveData = () => {
        const elementID = parseInt(pageId) 
        const selectStyle= document.getElementsByClassName('selectStyle')[elementID].value;

        // create data
        const data = {
            "id": id, 
            "imagefile": image,
            "caption": captionValue,
            "style": [selectedFontFamily, selectedSize, selectedColor, selectStyle]
        }
   
        const jsonData = JSON.stringify(data)
        console.log(jsonData);
        //TODO: send data to backend


        const isSaved = document.getElementsByClassName('isSaved')[elementID];
        isSaved.style.backgroundColor = "rgb(128, 204, 207)";
        return jsonData;
    }


    return(
        
        <div className="containerDesign">

            <div className="style">

                <select className="selectStyle" onChange={handleStyleChange}>
                    <option selected disabled>style</option>
                    <option value="text img">text img</option>
                    <option value="img text">img text</option>
                </select>

                <select className="selectFont" text='font' onChange={handleFontChange}>
                    <option selected disabled>font</option>
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
                    <option value="" selected disabled>size</option>
                    <option>8</option>
                    <option>9</option>
                    <option>10</option>
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


                <label htmlFor="colorPicker">color</label>
                <input
                    className="selectColor"
                    type="color"
                    id="colorPicker"
                    value={selectedColor}
                    onChange={handleColorChange}
                />
                <div className='isSaved'/>
                <button className="saveBtn" onClick={saveData}>save</button>

            </div>

            <div className="design">

                <div className='contentLeft'>
                    <textarea
                        className="textarea textInputLeft"
                        value={captionValue}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChange={handleInputChange}
                        placeholder="Type here..."
                        style={{color: selectedColor, fontSize: selectedSize, fontFamily: selectedFontFamily}}
                    />

                    <div className="imgContainer imgContainerLeft" onClick={handleImageClick}>
                        {<img className="uploadPictureLeft" src={image}/>}
                        <input
                            type="file"
                            className='inputFileLeft'
                            ref={inputRef}
                            onChange={handleImageChange}
                            style={{ display: "none"}}
                        />
                    </div>
                </div>
                
            
                <div className='contentRight'>
                    <textarea
                        readOnly
                        className="textarea textInputRight"
                        value={captionValue}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChange={handleInputChange}
                        placeholder="Type here..."
                        style={{color: selectedColor, fontSize: selectedSize, fontFamily: selectedFontFamily}}
                    />

                    
                    <div className="imgContainer imgContainerRight" onClick={handleImageClick}>

                        <img className="uploadPictureRight" src={image}/>
                        <input
                            type="file"
                            className='inputFileRight'
                            ref={inputRef}
                            onChange={handleImageChange}
                            style={{ display: "none"}}
                        />
                    </div>
                </div>

                
            </div>
        </div>
        
        
    );
}

export default DesignPage;
