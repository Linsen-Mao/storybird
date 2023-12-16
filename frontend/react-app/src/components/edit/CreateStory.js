import React, {useState, useRef, useEffect} from "react";
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


    // get category id
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState([]);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    useEffect(() => {   
        const fetchCategories = async () => {
            try {
              const response = await fetch('http://localhost:4000/categories', {
                method: 'GET',
                credentials: 'include'
              });
              const data = await response.json();
              // Validate the response structure
              const categories = data && data.categories ? data.categories : [];
              setCategories(categories);
            } catch (error) {
              console.error('Error fetching categories:', error);
              return [];
            }
        };

        fetchCategories();
    })




    // create new story
    const navigate = useNavigate();

    const createNewStory = async () => {

        // step 1: send data to backend
        const title = document.getElementById('inputTitle').value;
        const description = document.getElementById('inputDescription').value;

        const data = {
            "title": title,
            "categoryId": selectedCategory,
            "coverImage": image,
            "description": description
        }
        console.log(data);
        //TODO send data to backend

        let url = 'http://localhost:4000/stories';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // 告訴後端是json形式
                    },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            if(response.ok) {
                console.log("story was created successfully!!");
                // setp 2: go to upload images slide TODO
                navigate("/uploadImages");
                
            } else {
                // Handle error response
                alert("Something's wrong! Please try again.", response.status);
                console.error('Request failed:', response.status);
            }
        } catch (error) {
            // Handle fetch error
            alert("Fetch error", error);
            console.error('Error:', error);
        }
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
                <select
                id="categorySelect"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                >
                    <option value="All">ALL</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category.id}>
                        {category.name}
                        </option>
                    ))}
                </select>
                <button onClick={createNewStory}>create</button>
            </div>
            
            
        </div>
    );


}
export default CreateStory;