import React, {useState} from 'react'

import { Button } from "../Components/Button.jsx";
import background from "../Assets/landing.png";
import rectangle from '../Assets/rectangle.png';
import "../Styles/Error.css";
import axios from "axios";
import ImageUploading from 'react-images-uploading';

import Dropzone from 'react-dropzone'


/*
File to Byte Array code: https://dilshankelsen.com/convert-file-to-byte-array/
 */

export default function UploadPage() {
    const [images,setImages] = useState();
    const [file, setFile] = useState("");
    const maxNumber = 69;

    // async function handleUpload(e) {
    //     //Just the file?
    //     let file = e.target.files[0];
    //     setImage(file);
    //     console.log("Uploading " + file.name);
    //
    //
    //     //Try Byte Array?
    //     const byteFile = await getAsByteArray(file);
    //     console.log("File converted to byteArray " + byteFile);
    //     //setImage(byteFile);
    // }
    // async function getAsByteArray(file) {
    //     return new Uint8Array(await readFile(file))
    // }
    //
    // function readFile(file) {
    //     return new Promise((resolve, reject) => {
    //         // Create file reader
    //         let reader = new FileReader()
    //
    //         // Register event listeners
    //         reader.addEventListener("loadend", e => resolve(e.target.result))
    //         reader.addEventListener("error", reject)
    //
    //         // Read file
    //         reader.readAsArrayBuffer(file)
    //     })
    // }
    // function upload() {
    //     const payload = {
    //         image_title: "testUpload",
    //         image_description: "mickey's test image upload",
    //         image_cost: "",
    //         image_file: images[0].file
    //     };
    //
    //     console.log('payload for upload = ', payload);
    //     const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/uploadImage";
    //     axios.post(postURL, payload).then((res) => console.log(res));
    // }

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
        // data for submit

        console.log("below is the image list", imageList, addUpdateIndex);
        setImages(imageList);
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