import React, { useState, useRef, useEffect } from "react";
import "./CreateStory.css";
import { useNavigate } from "react-router-dom";

const CreateStory = () => {
  // upload image
  const inputRef = useRef(null);

  const [imageFile, setImageFile] = useState(null); // 存储文件而不是文件的DataURL
  const [imagePreview, setImagePreview] = useState(
    "https://t4.ftcdn.net/jpg/05/65/22/41/360_F_565224180_QNRiRQkf9Fw0dKRoZGwUknmmfk51SuSS.jpg"
  );

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setImageFile(selectedFile); // 存储文件

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // 设置预览图
    };
    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
  };

  // get category id
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:4000/categories", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        // Validate the response structure
        const categories = data && data.categories ? data.categories : [];
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
    };

    fetchCategories();
  }, []);

  // create new story
  const navigate = useNavigate();

  const createNewStory = async () => {
    const title = document.getElementById("inputTitle").value;
    const description = document.getElementById("inputDescription").value;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("categoryId", selectedCategory);
    formData.append("coverImage", imageFile); // 使用文件而不是DataURL
    formData.append("description", description);

    let url = "http://localhost:4000/stories";
    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        body: formData, // 发送FormData对象
      });
      if (response.ok) {
        const responseData = await response.json();
        const storyId = responseData.story.id;
        // setp 2: go to upload images slide TODO
        navigate(`/uploadImages/${storyId}`);
      } else {
        // Handle error response
        alert("Something's wrong! Please try again.", response.status);
        console.error("Request failed:", response.status);
      }
      // 响应处理...
    } catch (error) {
      // 错误处理...
      console.error("Error:", error);
    }
  };

  return (
    <div className="createStoryDiv mt-5 p-5">
      <h1 className="featurette-heading text-center mb-4">Create a new story</h1>
      <hr className="featurette-divider" />
      <div className="row justify-content-center">
        {/* Step 1: Upload a Cover Image */}
      <div className="col-md-5 mt-5 mt-sm-3">
        <p className="lead text-center mb-4">Step 1: Upload a Cover Image</p>
      <div className="imageDiv">
        <img
          className="coverImg"
          src={imagePreview}
          onClick={handleImageClick}
        />
        <input
          type="file"
          className="inputFileRight"
          ref={inputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </div>
      </div>

      {/* Step 2: Fill in the Information */}
      <div className="col-md-7 mt-5 mt-sm-3">
        <p className="lead text-center mb-4">Step 2: Fill in the Information</p>
      <div className="inputDiv">
        <input id="inputTitle" type="text" className="form-control mb-3" placeholder="title (at most 20 letters)" />
        <input id="inputDescription" type="text" className="form-control mb-3" placeholder="description" />
        <select
          id="categorySelect"
          value={selectedCategory}
          className="form-select mb-3"
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          {categories.map((category, index) => (
            <option key={index} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={createNewStory}
        >
          Create
        </button>
      </div>
      </div>
      </div>
    </div>
    
  );
};
export default CreateStory;
