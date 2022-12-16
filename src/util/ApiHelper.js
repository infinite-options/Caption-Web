import axios from "axios"
import cheerio from "cheerio"

const clevelandURL = "https://openaccess-api.clevelandart.org/api/artworks/"
const chicagoURL = "https://api.artic.edu/api/v1/artworks?fields=id,title,image_id"
const giphyURL = "https://api.giphy.com/v1/gifs/trending?api_key=Fo9QcAQLMFI8V6pdWWHWl9qmW91ZBjoK&"
const harvardURL= "https://api.harvardartmuseums.org/image?apikey=c10d3ea9-27b1-45b4-853a-3872440d9782"
const searchGooglePhotosURL = 'https://photoslibrary.googleapis.com/v1/mediaItems:search'

async function getApiImagesHelper(deckUID, numOfRounds){
    if(deckUID === "500-000005"){
        // Google Photos API Call
        // const body = {
        //     "pageSize": "50",
        //     "albumId":  userData.googlePhotos.albumId
        // }
        // const headers = {
        //     Accept: 'application/json',
        //     Authorization: 'Bearer ' + userData.googlePhotos.accessToken ,
        // }
        // await axios.post(searchGooglePhotosURL, body, {headers: headers})
        //     .then(res => {
        //         // Store all google image urls in allImageUrls
        //         imageURLs = res.data.mediaItems.map(picture => {
        //             return picture.baseUrl
        //         })
        //     })
    }
    else if (deckUID === "500-000006") {
        const imagesInfo = await axios.get(clevelandURL + "?limit=100").then(response => response.data.data)
        let clevelandImages = []
        for(let i = 0; i < imagesInfo.length; i++){
            if(imagesInfo[i].images !== null && imagesInfo[i].images.web !== undefined)
                clevelandImages.push(imagesInfo[i].images.web.url)
        }
        clevelandImages = randomize(clevelandImages, numOfRounds)
        return clevelandImages
    }
    else if (deckUID === "500-000007") {
        const path_begin = "https://www.artic.edu/iiif/2/"
        const path_end = "/full/843,/0/default.jpg"
        const imagesInfo = await axios.get(chicagoURL + "&limit=100").then(response => response.data.data)
        let chicagoImages = []
        for(let i = 0; i < imagesInfo.length; i++){
            if(imagesInfo[i].image_id !== null){
                const imageURL = path_begin + imagesInfo[i].image_id + path_end
                chicagoImages.push(imageURL)
            }
        }
        chicagoImages = randomize(chicagoImages, numOfRounds)
        return chicagoImages
    }
    else if (deckUID === "500-000008") {
        const imagesInfo = await axios.get(giphyURL + "&limit=50").then(response => response.data.data)
        let giphyImages = []
        for(let i = 0; i < imagesInfo.length; i++){
            if(imagesInfo[i].images.original.url !== null)
                giphyImages.push(imagesInfo[i].images.original.url)
        }
        giphyImages = randomize(giphyImages, numOfRounds)
        return giphyImages
    }
    else if (deckUID === "500-000009") {
        const imagesInfo = await axios.get(harvardURL + "&size=100").then(response => response.data.records)
        let harvardImages = []
        for(let i = 0; i < imagesInfo.length; i++){
            if(imagesInfo[i].baseimageurl !== null)
                harvardImages.push(imagesInfo[i].baseimageurl)
        }
        harvardImages = randomize(harvardImages, numOfRounds)
        return harvardImages
    }
    else if (deckUID === "500-000010") {
        let cnnImages = await getCurrentCnnURL()
        cnnImages = randomize(cnnImages, numOfRounds)
        return cnnImages
    }
}

function randomize(inputArray, numOfRounds){
    let tempArray = []
    for(let i = 0; i < numOfRounds; i++){
        const randomIndex = Math.floor(Math.random() * inputArray.length)
        const imageURL = inputArray.splice(randomIndex, 1)
        tempArray.push(imageURL[0])
    }
    return tempArray
}

// FUNCTION: getCnnImgURLs
// DESCRIPTION: Web scrapes the URL page source for <script> tag then adds img URLs to list
async function getCnnImgURLs(URL){
    const htmlString = await axios.get(URL).then(response => response.data)
    const $ = cheerio.load(htmlString)
    const scriptString = $("script")
    const scriptObj = JSON.parse($(scriptString[2]).text())
    const imgItems = scriptObj.hasPart.mainEntity.itemListElement
    let imgURLs = []
    for (let i = 0; i < imgItems.length; i++){
        imgURLs.push(imgItems[i].item.url)
    }
    return imgURLs
}

// FUNCTION: getCurrentCnnURL
// DESCRIPTION: Starting from today, iterates through the past 365 days for the most current valid CNN URL
async function getCurrentCnnURL() {
    const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
    let cnnURL = ""
    let beginDate = new Date()
    let endDate = new Date()
    beginDate.setDate(endDate.getDate() - 7)
    for (let i = 0; i <= 365; i++) {
        let beginDay = beginDate.getDate(), beginMonth = beginDate.getMonth()
        let endDay = endDate.getDate(), endMonth = endDate.getMonth(), endYear = endDate.getFullYear()
        let potentialCnnURL = ""
        if(endDay < 10)
            potentialCnnURL = `https://www.cnn.com/${endYear}/${endMonth + 1}/0${endDay}/world/gallery/photos-this-week-${months[beginMonth]}-${beginDay}-${months[endMonth]}-${endDay}/index.html`
        else
            potentialCnnURL = `https://www.cnn.com/${endYear}/${endMonth + 1}/${endDay}/world/gallery/photos-this-week-${months[beginMonth]}-${beginDay}-${months[endMonth]}-${endDay}/index.html`
        try {
            cnnURL = await axios.get(potentialCnnURL).then(response => response.config.url)
            break
        }
        catch (error) {
            beginDate.setDate(beginDate.getDate() - 1)
            endDate.setDate(endDate.getDate() - 1)
        }
    }
    return getCnnImgURLs(cnnURL)
}

export { getApiImagesHelper }