import React, { useState } from "react";
import './UploadImages.css'
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';



const UploadImages = () => {

   
    const { storyId } = useParams();

    //const [selectedImages, setSelectedImages] = useState([]);
    const [imgFiles, setImgFiles] = useState([]);

    const onSelectFile = (event) => {
        const selectedFiles = event.target.files;
        const selectedFilesArray = Array.from(selectedFiles);

        /*const imagesArray = selectedFilesArray.map((file) => {
        return URL.createObjectURL(file);
        });

        setSelectedImages((previousImages) => previousImages.concat(imagesArray));*/
        setImgFiles((previousImgFiles) => previousImgFiles.concat(selectedFilesArray));

        // FOR BUG IN CHROME
        event.target.value = "";
    };

    function deleteHandler(image) {
        //setSelectedImages(selectedImages.filter((e) => e !== image));
        setImgFiles(imgFiles.filter((e) => e !== image))
        URL.revokeObjectURL(image);
    }

    const navigate = useNavigate();

    const uploadImages = async () => {

        //console.log(selectedImages);
        console.log(imgFiles);

        for (let i = 0; i < imgFiles.length; i++) {
            const formData = new FormData();
            formData.append("imageFile", imgFiles[i]);
            formData.append("order", i);

            let url = `http://localhost:4000/stories/${storyId}/images`; 
            try {
                const response = await fetch(url, {
                    method: "POST",
                    credentials: "include",
                    body: formData, // 发送FormData对象
                });
                if (!response.ok) {
                    alert("image couldnt be send to backend", response.status);
                    console.error("Request failed:", response.status);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }

        navigate(`/editPage/${storyId}`);
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
                {/*{selectedImages &&
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
                })}*/}

                {imgFiles &&
                imgFiles.map((image, index) => {
                    return (
                    <div key={URL.createObjectURL(image)} className="image">
                        <button onClick={() => deleteHandler(image)}>
                        x
                        </button>
                        <img className="uploadedImg" src={URL.createObjectURL(image)} alt="upload" />
                        
                        <p>{index + 1}</p>
                    </div>
                    );
                })}
            </div>

            {/*{selectedImages.length > 0 ? */}
            {imgFiles.length > 0 ?
                (
                <button
                    className="upload-btn"
                    onClick={uploadImages}
                >
                    {/*UPLOAD {selectedImages.length} IMAGE
                    {selectedImages.length === 1 ? "" : "S"}*/}
                    UPLOAD {imgFiles.length} IMAGE
                    {imgFiles.length === 1 ? "" : "S"}
                </button>    
                ) : 
                <br/>
            }   

        </div>
    );    
}

export default UploadImages;