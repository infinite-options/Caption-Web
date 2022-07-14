import axios from "axios"

const listAlbumsURL = "https://photoslibrary.googleapis.com/v1/albums"
const CLIENT_ID = "546875584099-k947e5rnocuqj2e9bqcq94ul82km4j5d.apps.googleusercontent.com"
const CLIENT_SECRET = "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"

const GooglePhotos = () => {
    axios.get(listAlbumsURL).then((res) => {
        console.log(res)
    })
    return (
        <div>GooglePhotos</div>
    )
}

export default GooglePhotos