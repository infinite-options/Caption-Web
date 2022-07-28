import React, {useContext} from "react";
import "../Styles/Deck.css";
import { useHistory } from "react-router-dom";
import {Link} from "react-router-dom";

import axios from "axios";
import {LandingContext} from "../App";
import { useEffect } from "react";

export default function DeckCard(props) {
    const history = useHistory()
    let nextPage = "/waiting"
    const {code, roundNumber, setDeckSelected, photosFromAPI, setPhotosFromAPI} = useContext(LandingContext);
    const clevelandURL = "https://openaccess-api.clevelandart.org/api/artworks"
    const chicagoURL = "https://api.artic.edu/api/v1/artworks?fields=id,title,image_id"
    const giphyURL = "https://api.giphy.com/v1/gifs/trending?api_key=Fo9QcAQLMFI8V6pdWWHWl9qmW91ZBjoK&"
    const harvardURL= "https://api.harvardartmuseums.org/image?apikey=c10d3ea9-27b1-45b4-853a-3872440d9782";
    const record = [];
    const image_url=[];
    let deck_uid = "500-000009"
    const params = {
    limit : "4"
}
    if(props.googlePhotos == true)
        nextPage = "/googleAuth"
    //Get Photos from APIs
        function getData(url){
            
            axios.get(url,{params}).then((res)=>{
                    //Cleveland
                    if(url == clevelandURL){
                        for(const image of res.data.data){
                            record.push(image.images.web.url);
                            console.log("Cleveland record",record)
                        }
                    console.log("Cleveland Record 2",record)
                    }
                    //Chicago
                    else if(url == chicagoURL){
                        for(const chicagoImage of res.data.data){
                            record.push(chicagoImage.image_id)
                          }
                            console.log("Chicago record", record)
                        // console.log("res", res.data.config.iiif_url)
                          for(var i=0;i<record.length;i++){
                              image_url.push(res.data.config.iiif_url + "/" + record[i] + "/full/843,/0/default.jpg")
                          }
                            console.log("Chicago Image URL",image_url)
                    }
                    //Giphy
                    else if(url == giphyURL){
                        console.log("Giphy Response",res.data.data);
                        for(const giphyImage of res.data.data){
                            record.push(giphyImage.images.original.url);
                    }
                            console.log("Giphy Image URL", record)
                }
                    //Harvard
                    else if(url == harvardURL){
                        console.log("Harvard Response",res.data);
                        console.log("Harvadf",res.data.records)
                            for(const harvardImage of res.data.records){
                                record.push(harvardImage.baseimageurl)
                            }
                            console.log("Harvard Image URL", record)
                    }
      
    })
    }
    
    function selectThisDeck() {
        if(props.googlePhotos === true){
            console.log("Switching to google photos page")
        }
        //Cleveland
        else if(props.cleveland == true){
            console.log("Switch to Cleveland page") 
            const payload = {
                game_code: code,
                deck_uid: deck_uid,
                round_number: roundNumber.toString(),
            }
            console.log('payload for deck = ', payload);
            const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/selectDeck";
            axios.post(postURL, payload);
                getData(clevelandURL)
                setPhotosFromAPI(record)
                setDeckSelected(true)
        }
        //Chicago
        else if(props.chicago == true){
            console.log("Switch to Chicago page") 
            const payload = {
                game_code: code,
                deck_uid: deck_uid,
                round_number: roundNumber.toString(),
            
        }
        console.log('payload for deck = ', payload);
            const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/selectDeck";
            axios.post(postURL, payload);
                getData(chicagoURL)
                setPhotosFromAPI(image_url)
                setDeckSelected(true)
    }
        //Giphy
        else if(props.giphy == true){
            console.log("Switch to Giphy page")
            const payload = {
                game_code: code,
                deck_uid: deck_uid,
                round_number : roundNumber.toString(),
            }
        console.log('payload for deck = ', payload);
            const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/selectDeck";
            axios.post(postURL, payload);
                getData(giphyURL)
                setPhotosFromAPI(record)
                setDeckSelected(true)
        }
        //Harvard
        else if(props.harvard == true){
            console.log("Switch to Harvard page")
            const payload = {
                game_code: code,
                deck_uid: deck_uid,
                round_number : roundNumber.toString(),
            }
            console.log('payload for deck = ', payload);
            const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/selectDeck";
            axios.post(postURL, payload);
                getData(harvardURL)
                setPhotosFromAPI(record)
                setDeckSelected(true)
        }
        else {
            const payload = {
                game_code: code,
                deck_uid: props.id,
                round_number: roundNumber.toString(),
            };

            console.log('payload for deck = ', payload);
            const postURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/selectDeck";
            axios.post(postURL, payload);
            setDeckSelected(true)
        }
    }
  
    return (
        <Link to={nextPage} className="btn-mobile" onClick = {selectThisDeck}>
            
            <div className="outer">
                <div className="imageBackground">
                    <img src={props.src} alt={props.alt} className="img1"/>
                    {/*<img src="https://iocaptions.s3.us-west-1.amazonaws.com/Amrita-Marino-NewYorkTimes-Worldnet-001-t.gif" alt={props.alt} className="img1"/>*/}
                </div>

                {props.title === "" ? <></> :
                    <div>
                        <div className="deckText">
                            {props.title} ({props.price})
                        </div>
                        <Link to="/deckinfo" className="linkText">
                            Learn More
                        </Link>
                    </div>
                }
            </div>
        </Link>

    );
}
