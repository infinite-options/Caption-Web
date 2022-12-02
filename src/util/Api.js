import axios from "axios";

const addUserURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/addUser"
const createGameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createGame"
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

async function getDecks(playerUID){
    const decksInfo = await axios.get(decksURL + "/" + playerUID + "," + "true").then(response => response.data.decks_info)
    return decksInfo
}

async function getDatabaseImages(deckUID, userData){
    const payload = {
        deck_uid: deckUID,
        game_code: userData.gameCode,
    }
    await axios.post(postAssignDeckURL, payload)
    await axios.get(getUniqueImageInRoundURL + userData.gameCode + "," + userData.roundNumber).then(res => {console.log(res)})
}

async function getApiImages(deckUID, userData){
    const payload = {
        deck_uid: deckUID,
        game_code: userData.gameCode
    }
    // await axios.post(postAssignDeckURL, payload).then((res) => {
    //     console.log(res)
    // })
    //
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
    //
    //
    // // Publish start game signal and imageURL to ably for guest players to use
    // pub(uniqueImage)
}

export { getPlayerUID, getGameCode, getDecks, getDatabaseImages, getApiImages }
