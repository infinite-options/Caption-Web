import React, {useContext} from "react";
import "../Styles/Deck.css";
import { useHistory } from "react-router-dom";
import {Link} from "react-router-dom";

import axios from "axios";
import {LandingContext} from "../App";
import { useEffect } from "react";

export default function DeckCard(props) {
    const history = useHistory()
    const {code, roundNumber, setDeckSelected, photosFromAPI, setPhotosFromAPI, deckTitle, setDeckTitle, cookies, setCookie} = useContext(LandingContext);

    const clevelandURL = "https://openaccess-api.clevelandart.org/api/artworks"
    const chicagoURL = "https://api.artic.edu/api/v1/artworks?fields=id,title,image_id"
    const giphyURL = "https://api.giphy.com/v1/gifs/trending?api_key=Fo9QcAQLMFI8V6pdWWHWl9qmW91ZBjoK&"
    const harvardURL= "https://api.harvardartmuseums.org/image?apikey=c10d3ea9-27b1-45b4-853a-3872440d9782";
    const selectDeckURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/selectDeck";


    const record = [];
    const image_url=[];

    let nextPage = "/waiting"

    let api_deck_uid = "500-000009"
    let payload =  {
        game_code: code,
        deck_uid: api_deck_uid,
        round_number: roundNumber.toString(),
    }
    const params = {
        limit : "20"
    }

    // Change next page to 
    if(props.googlePhotos === true)
        nextPage = "/googleAuth"

    //Get Photos from APIs (Each API has own response format)
    async function getData(url){
        await axios.get(url,{params}).then((res)=>{
            //Cleveland
            if(url === clevelandURL){
                for(const image of res.data.data){
                    record.push(image.images.web.url);
                }
                console.log("Cleveland Records After pushing",record)
            }
            //Chicago
            else if(url === chicagoURL){
                for(const chicagoImage of res.data.data){
                    record.push(chicagoImage.image_id)
                }
                console.log("Chicago record", record)
                for(var i=0;i<record.length;i++){
                    image_url.push(res.data.config.iiif_url + "/" + record[i] + "/full/843,/0/default.jpg")
                }
                console.log("Chicago Image URL",image_url)
            }
            //Giphy
            else if(url === giphyURL){
                console.log("Giphy Response",res.data.data);
                for(const giphyImage of res.data.data){
                    record.push(giphyImage.images.original.url);
                }
                    console.log("Giphy Image URL", record)
            }
            //Harvard
            else if(url === harvardURL){
                console.log("Harvard Response",res.data);
                console.log("Harvard",res.data.records)
                for(const harvardImage of res.data.records){
                    record.push(harvardImage.baseimageurl)
                }
                console.log("Harvard Image URL", record)
            }
        })
    }
    

    async function selectThisDeck() {
        if(props.googlePhotos === true){
            console.log("Google Photos API selected. Switching to Google Sign-in Page.")
            setDeckSelected(api_deck_uid)
            setCookie("deckSelected", api_deck_uid)
            return
        }
        else if(props.cleveland){
            console.log("Cleveland API Selected") 
            getData(clevelandURL).then(() => {
                setPhotosFromAPI(record)
                setDeckSelected(api_deck_uid)

                setCookie("photosFromAPI", record)
                setCookie("deckSelected", api_deck_uid)
            })
            
        }
        //Chicago
        else if(props.chicago){
            console.log("Chicago API Selected") 
            getData(chicagoURL).then(() => {
                setPhotosFromAPI(image_url)
                setDeckSelected(api_deck_uid)

                setCookie("photosFromAPI", image_url)
                setCookie("deckSelected", api_deck_uid)
            })
            
        }
        //Giphy
        else if(props.giphy){
            console.log("Giphy API selected")
            getData(giphyURL).then(() => {
                setPhotosFromAPI(record)
                setDeckSelected(api_deck_uid)

                console.log("RECORD", record)
                setCookie("photosFromAPI", record)
                setCookie("deckSelected", api_deck_uid)
            })
            
        }
        //Harvard
        else if(props.harvard){
            console.log("Harvard API selected")
            getData(harvardURL).then(() => {
                setPhotosFromAPI(record)
                setDeckSelected(api_deck_uid)

                setCookie("photosFromAPI", record)
                setCookie("deckSelected", api_deck_uid)
            })
            
        }
        // Decks from Database
        else {
            payload = {
                game_code: code,
                deck_uid: props.id,
                round_number: roundNumber.toString(),
            };

            setDeckTitle(props.title)
            setCookie("deckSelected", props.id)
        }

        console.log('payload for deck = ', payload);
        await axios.post(selectDeckURL, payload).then(res => console.log(res))

        setCookie("deckTitle", props.title)
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
