import React, {useState} from 'react'

import { Button } from "../Components/Button.jsx";
import background from "../Assets/landing.png";
import rectangle from '../Assets/rectangle.png';
import "../Styles/Error.css";
import axios from "axios";
import ImageUploading from 'react-images-uploading';
import Form from "../Components/Form.jsx";

export default function UploadPage() {
    const [images,setImages] = useState();
    const [file, setFile] = useState("");
    const maxNumber = 69;
    const[deckName, setDeckName] = useState("");

    const updateData = (index) => {
        let formData = new FormData();
        console.log("File",  images[index].file)
        formData.append('image_title',  images[index].file.name);
        formData.append('image_description', "upload from app");
        formData.append('image_cost', "");
        formData.append('image_file', images[index].file);

        axios.post("https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/uploadImage", formData)
            .then((response) => {
                console.log("image",response.data)
                setFile(response.data)
                //  history.push("/blog")
            });
    }

    const onChange = (imageList, addUpdateIndex) => {
        console.log(imageList, addUpdateIndex);
        setImages(imageList);
    };

    const handleDeckNameChange = (deckNameInput) => {
        setDeckName(deckNameInput);
    };

    return (
        // Background image
        <div class="backgroundimg"
        style={{
          maxWidth: "375px",
          height: "812px",
          backgroundImage: `url(${background})`,
        }}
      >
        <div
          className="testBlur"
          style={{
            backgroundImage: `url(${background})`,
          }}
        />
        <div>
            <img src={rectangle} alt="" class="rectangle"/>
            <div class="message">
                <Form
                    field="Your Name"
                    onHandleChange={handleDeckNameChange}
                    type="text"
                />

                <ImageUploading
                    multiple
                    value={images}
                    onChange={onChange}
                    maxNumber={maxNumber}
                    dataURLKey="data_url"
                >
                    {({
                          imageList,
                          onImageUpload,
                          onImageRemoveAll,
                          onImageUpdate,
                          onImageRemove,
                          isDragging,
                          dragProps,
                      }) => (
                        // write your building UI
                        <div className="upload__image-wrapper">
                            <button
                                style={isDragging ? { color: 'red' } : undefined}
                                onClick={onImageUpload}
                                {...dragProps}
                            >
                                Click or Drop here
                            </button>
                            &nbsp;
                            <button onClick={onImageRemoveAll}>Remove all images</button>
                            {imageList.map((image, index) => (
                                <div key={index} className="image-item">
                                    <img src={image['data_url']} alt="" width="100" />
                                    <div className="image-item__btn-wrapper">
                                        <button onClick={() => updateData(index)}>Upload</button>
                                        {/*<button onClick={() => onImageUpdate(index)}>Update</button>*/}
                                        <button onClick={() => onImageRemove(index)}>Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ImageUploading>

                {/*<button onClick={upload} children="upload to database" />*/}

            </div>
        </div>

        <Button className="landing2" destination="/" children="Back"/>
      </div>
    )
}