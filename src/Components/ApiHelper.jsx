import {useContext} from 'react'
import { LandingContext } from '../App';
import axios from 'axios';
import cheerio from "cheerio";

export const ApiHelper = () => {
    const {userData} = useContext(LandingContext);

    // Endpoints used in apiCall
    const getRoundImageURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getRoundImage/"
    const postRoundImageURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/postRoundImage"

    // 3rd Party API Url's
    const clevelandURL = "https://openaccess-api.clevelandart.org/api/artworks/"
    const chicagoURL = "https://api.artic.edu/api/v1/artworks?fields=id,title,image_id"
    const giphyURL = "https://api.giphy.com/v1/gifs/trending?api_key=Fo9QcAQLMFI8V6pdWWHWl9qmW91ZBjoK&"
    const harvardURL= "https://api.harvardartmuseums.org/image?apikey=c10d3ea9-27b1-45b4-853a-3872440d9782"
    const searchGooglePhotosURL = 'https://photoslibrary.googleapis.com/v1/mediaItems:search'
    const cnnURL = "https://www.cnn.com/2022/11/17/world/gallery/photos-this-week-november-10-november-17"

    // FUNCTION: apiCall()
    // DESCRIPTION: Gets a list of previously used images, then list of images from API. 
    // Selects/returns a unique url not in previously used images.
        // Step 1: Get used images from past rounds
        // Step 2: Get API images
        // Step 3: Subtract out used and undefined images
        // Step 4: Select random image that hasn't been used
    const apiCall = async (nextRound) => {
        let usedUrls = []
        let allImageUrls = []
        let nextRoundUrl = ""


        // FUNCTION: getCnnImgURLs
        // DESCRIPTION: Gets a list of img URLs from web scraping script tags of the page source
        async function getCnnImgURLs(URL){
            const htmlString = await axios.get(URL).then(response => response.data)
            const $ = cheerio.load(htmlString)
            const scriptString = $("script")
            const scriptObj = JSON.parse($(scriptString[3]).text())
            const imgItems = scriptObj.hasPart.mainEntity.itemListElement
            let imgURLs = []
            for (let i = 0; i < imgItems.length; i++){
                imgURLs.push(imgItems[i].item.url)
            }
            return imgURLs
        }

        // Step 1: GET /getRoundImage gets previously used images
        await axios.get(getRoundImageURL + userData.code + ",0").then(res => {
            const result = res.data.result
            console.log("getRoundImage Result", result)
            for(let i = 0; i < result.length; i++) {
                usedUrls.push(result[i].round_image_uid)
            }
            console.log("usedUrlSet", usedUrls)
        })


        // Step 2: Get set of photos from API's
        if(userData.deckSelected === "500-000005"){
            // Google Photos API Call
            const body = {
                "pageSize": "50",
                "albumId":  userData.googlePhotos.albumId
            }
            const headers = {
                Accept: 'application/json',
                Authorization: 'Bearer ' + userData.googlePhotos.accessToken ,
            }
    
            await axios.post(searchGooglePhotosURL, body, {headers: headers})
            .then(res => {
                // Store all google image urls in allImageUrls
                allImageUrls = res.data.mediaItems.map(picture => {
                    return picture.baseUrl
                })
            })

        } else if (userData.deckSelected === "500-000006") {
            // Cleveland API Call
            await axios.get(clevelandURL + "?limit=100").then( res => {
                console.log("Cleveland res", res)

                allImageUrls = res.data.data.map(image => {
                    if(image.images !== null && image.images.web !== null)
                        return image.images.web.url
                    return undefined
                })
                console.log("CLEVELAND all images: ", allImageUrls)

            })
        } else if (userData.deckSelected === "500-000007") {
            // Chicago API Call
            await axios.get(chicagoURL + "&limit=100").then( res => {
                console.log("Chicago Res", res)

                allImageUrls = res.data.data.map(image => {
                    // console.log("Image: ", image)
                    // console.log("image.image_id: ", image.image_id, " type: ", typeof image.image_id)

                    if(image !== null && image.image_id !== null )
                        return res.data.config.iiif_url + "/" + image.image_id + "/full/843,/0/default.jpg"
                    return undefined
                })
                console.log("Chicago all images: ", allImageUrls)
            })
        } else if (userData.deckSelected === "500-000008") {
            // Giphy API Call
            await axios.get(giphyURL + "&limit=50").then( res => {
                console.log("Giphy Response", res)

                allImageUrls = res.data.data.map( imageObj => {
                    if(imageObj.images.original.url !== undefined)
                        return imageObj.images.original.url
                    return undefined
                })

                console.log("GIPHY all images: ", allImageUrls)
            })
        } else if (userData.deckSelected === "500-000009") {
            // Harvard API Call
            await axios.get(harvardURL + "&size=100").then( res => {
                console.log("Harvard Response", res)

                allImageUrls = res.data.records.map( imageObj => {
                    if(imageObj.baseimageurl !== undefined)
                        return imageObj.baseimageurl
                    return undefined
                })

                console.log("HARVARD all images: ", allImageUrls)
            })
        } else if (userData.deckSelected === "500-000010") {
            // CNN API Call
            allImageUrls = await getCnnImgURLs(cnnURL)
            console.log("CNN all images: " + allImageUrls)
        }

        // 3. Subtract out used and undefined images
        let uniqueUrls = allImageUrls.filter(image => !usedUrls.includes(image) && image !== undefined)
        console.log("unique urls after array subtraction: ", uniqueUrls)

        // 4. Select random image that hasn't been used for next round
        nextRoundUrl = uniqueUrls[Math.floor(Math.random() * uniqueUrls.length)]


        console.log("Round number before post round image: ", userData.roundNumber)

        // POST /postRoundImage saves the current url we are using in the database
        let payload = {
            "game_code": userData.code,
            // "round_number": userData.roundNumber.toString(),
            "round_number": nextRound === undefined ? userData.roundNumber.toString() : nextRound.toString(),
            "image": nextRoundUrl
        }
        await axios.post(postRoundImageURL, payload).then(res => {
            console.log("postRoundImage", res)
        })

        return nextRoundUrl
    }
    


    return {apiCall}
}



