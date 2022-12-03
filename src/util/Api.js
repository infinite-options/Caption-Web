import { useNavigate, useLocation } from "react-router-dom"
import { useCookies } from 'react-cookie'
import axios from "axios";

const addUserURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/addUser"
const createGameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createGame"
const joinGameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/joinGame"
const decksURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/decks"
const selectDeckURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/selectDeck"
const postAssignDeckURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/assignDeck"
const getUniqueImageInRoundURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getUniqueImageInRound/"

async function getPlayerUID(userData) {
    const payload = {
        user_name: userData.name,
        user_email: userData.email,
        user_zip: userData.zipCode,
        user_alias: userData.alias
    }
    const playerUID = await axios.post(addUserURL, payload).then(response => response.data.user_uid)
    return playerUID
}

async function getGameCode(userData, numOfRounds, roundTime){
    const payload = {
        user_uid: userData.playerUID,
        rounds: numOfRounds,
        round_time: "00:00:" + roundTime,
        scoring_scheme: "V"
    }
    const gameInfo = await axios.post(createGameURL, payload).then(response => response.data)
    return gameInfo
}

async function joinGame(userData){
    const payload = {
        game_code: userData.gameCode,
        user_uid: userData.playerUID
    }
    await axios.post(joinGameURL, payload)
    return
}

async function getDecks(playerUID){
    const decksInfo = await axios.get(decksURL + "/" + playerUID + "," + "true").then(response => response.data.decks_info)
    return decksInfo
}

async function postDatabaseImages(userData){
    const payload = {
        deck_uid: userData.deckUID,
        game_code: userData.gameCode,
    }
    console.log("DECK UID: " + userData.deckUID)
    await axios.post(postAssignDeckURL, payload)
    await axios.get(getUniqueImageInRoundURL + userData.gameCode + "," + userData.roundNumber).then((res) => {
        console.log('GET Get Unique Image In Round', res)})

        // setUserData({
        //     ...userData,
        //     imageURL: res.data.image_url
        // })
        // console.log("cookies before setCookies waiting: 385 ", cookies.userData)
        // setCookie("userData", {
        //     ...cookies.userData,
        //     "imageURL": res.data.image_url
        // }, { path: '/' })
        // console.log("Set Cookies in waiting: 385", cookies.userData)
        //pub();
}

async function postApiImages(userData){
    const payload = {
        deck_uid: userData.deckUID,
        game_code: userData.gameCode
    }
    await axios.post(postAssignDeckURL, payload).then((res) => {console.log(res)})

    // // Load next round's image URL
    // let uniqueImage = await apiCall()
    //
    // setUserData({
    //     ...userData,
    //     imageURL: uniqueImage,
    // })
    // console.log("cookies before setCookies waiting: 219 ", cookies.userData)
    // setCookie("userData", {
    //     ...cookies.userData,
    //     "imageURL": uniqueImage
    // }, { path: '/' })
    // console.log("Set Cookies in waiting: 219", cookies.userData)
    // pub(uniqueImage)
}

async function ablyStartGame(){
    // if(userData.isApi){
    //     channel2.publish({data: {
    //             gameStarted: true,
    //             currentImage: apiURL,
    //             deckTitle: userData.deckTitle
    //         }});
    // }
    // else
    //     channel2.publish({data: {
    //             gameStarted: true,
    //             currentImage: "",
    //             deckTitle: userData.deckTitle
    //         }});
    //
    // history.push("/page");
}

export { getPlayerUID, getGameCode, joinGame, getDecks, postDatabaseImages, postApiImages }
