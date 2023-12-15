import React, {useState, useRef} from "react";
import './CreateStory.css'
import { useNavigate } from "react-router-dom";

const CreateStory = () => {

    // upload image
    const inputRef = useRef(null);

    const [image, setImage] = useState("https://t4.ftcdn.net/jpg/05/65/22/41/360_F_565224180_QNRiRQkf9Fw0dKRoZGwUknmmfk51SuSS.jpg");

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
    };

    // create new story
    const navigate = useNavigate();

    const createNewStory = () => {

        // step 1: send data to backend
        const title = document.getElementById('inputTitle').value;
        const description = document.getElementById('inputDescription').value;

        const data = {
            "title": title,
            //TODO "categoryId": 1,
            "coverImage": image,
            "description": description
        }
        console.log(data);
        //TODO send data to backend

        // setp 2: go to upload images slide TODO
        navigate("/uploadImages");
    }

    return(

        <div className="createStoryDiv">
            <div className="imageDiv">
                <img className="coverImg" src={image} onClick={handleImageClick}/>
                <input
                    type="file"
                    className='inputFileRight'
                    ref={inputRef}
                    onChange={handleImageChange}
                    style={{ display: "none"}}
                />
            </div>

            <div className="inputDiv">
                <input id="inputTitle" type="text" placeholder="title"/>
                <input id="inputDescription" type="text" placeholder="description"/>
                <button onClick={createNewStory}>create</button>
            </div>
            
            
        </div>
    );


}
export default CreateStory;