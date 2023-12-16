import React, { useState } from "react";
import './UploadImages.css'
import { useNavigate } from "react-router-dom";


const UploadImages = () => {
    const [selectedImages, setSelectedImages] = useState([]);

    const onSelectFile = (event) => {
        const selectedFiles = event.target.files;
        const selectedFilesArray = Array.from(selectedFiles);

        const imagesArray = selectedFilesArray.map((file) => {
        return URL.createObjectURL(file);
        });

        setSelectedImages((previousImages) => previousImages.concat(imagesArray));

        // FOR BUG IN CHROME
        event.target.value = "";
    };

    function deleteHandler(image) {
        setSelectedImages(selectedImages.filter((e) => e !== image));
        URL.revokeObjectURL(image);
    }

    const navigate = useNavigate();

    const uploadImages = async () => {

        //send data to backend
        const data = selectedImages.map((src, index) => ({
            id: index, //starting from 0 [or should it start from 1? then +1]
            imgSrc: src,
          }));

          let url = 'http://localhost:4000/images' //??

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
                console.log("images have been uploaded");

                // continue with text editing?
                const confirmation = window.confirm("Images uploaded. Do you want to continue edit the text?");
                
                if (confirmation) {
                  // Code to continue editing
                  console.log("Continue editing");
                  navigate("/editPage");
                } else {
                  // Code to finish editing
                  console.log("Finish editing");
                  navigate("/"); //to where???
                }
                
            } else {
                // Handle error response
                alert("Something's wrong! Please try again.", response.status);
                console.error('Request failed:', response.status);
            }
        } catch (error) {
            // Handle fetch error
            alert("Fetch error", response.status);
            console.error('Error:', error);
        }
    }

    return (
        <div className="container_uploadImages">
            <label className="labelAddImage">
                + Add Images
                <input
                className="inputUploadImage"
                type="file"
                name="images"
                onChange={onSelectFile}
                multiple
                accept="image/png , image/jpeg, image/webp"
                />
            </label>
            <br />

            <input className="inputUploadImage" type="file" multiple />

            <div className="images">
                {selectedImages &&
                selectedImages.map((image, index) => {
                    return (
                    <div key={image} className="image">
                        <button onClick={() => deleteHandler(image)}>
                        x
                        </button>
                        <img className="uploadedImg" src={image} alt="upload" />
                        
                        <p>{index + 1}</p>
                    </div>
                    );
                })}
            </div>

            {selectedImages.length > 0 ? 
                (
                <button
                    className="upload-btn"
                    onClick={uploadImages}
                >
                    UPLOAD {selectedImages.length} IMAGE
                    {selectedImages.length === 1 ? "" : "S"}
                </button>    
                ) : 
                <br/>
            }   

        </div>
    );    
}

export default UploadImages;