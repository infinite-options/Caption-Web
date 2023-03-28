import axios from "axios"
import Ably from "ably/callbacks"
import { getApiImagesHelper } from "./ApiHelper"

//KdQRaQ.Xl1OGw:yvmvuVmPZkzLf3ZF 
const ably_api_key = "uVw8ZQ.JeIy0w:oGVPDlf8XqW8GGYFkjpbMaxjGb7PFr0Go8xp7NMWB28"
const ably = new Ably.Realtime(ably_api_key)

const checkGameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/checkGame"
const checkEmailCodeURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/checkEmailValidationCode"
const addUserURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/addUser"
const createGameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createGame"
const joinGameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/joinGame"
const decksURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/decks"
const selectDeckURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/selectDeck"
const postAssignDeckURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/assignDeck"
const postRoundImageURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/postRoundImage"
const getPlayersURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayers/"
const getImageURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getImageForPlayers/"
const getUniqueImageInRoundURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getUniqueImageInRound/"
const submitCaptionURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/submitCaption"
const getAllSubmittedCaptionsURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getAllSubmittedCaptions/"
const postVoteCaptionURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/voteCaption"
const getUpdateScoresURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/updateScores/"
const getPlayersWhoHaventVotedURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getPlayersWhoHaventVoted/"
const getScoreBoardURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getScoreBoard/"
const createNextRoundURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createNextRound"
const createRounds = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createRounds"
const nextImage = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getNextImage"
const errorURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/sendError/"
const CheckGameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getRoundImage"
const getCNNDeckURLS = "https://myx6g22dd2rtcpviw3d5wuz7eu0zudaq.lambda-url.us-west-2.on.aws/"
const getgameScoreURL =  "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getScores/"

async function checkGameCode(gameCode){
    const codeStatus = await axios.get(checkGameURL + '/' + gameCode)
    if(codeStatus.data.warning === "Invalid game code") {
        alert("Please enter a valid game code.")
        return false
    }
    return true
}

async function checkGameStarted(gameCode,round){
    const Game_status = await axios.get(CheckGameURL + '/' + gameCode + ',' + round)
    if(Game_status.data.result[0].round_image_uid === null ) {
        return false
    }
    return true
}
async function getGameImageForRound(gameCode,round){
    const Game_status = await axios.get(CheckGameURL + '/' + gameCode + ',' + round)
    return Game_status.data.result[0].round_image_uid
}

async function checkEmailCode(playerUID, code){
    const payload = {
        user_uid: playerUID,
        code: code
    }
    
    const status = await axios.post(checkEmailCodeURL, payload)
        .then(response => response.data)
    return status
}

async function addUser(userData) {
    const payload = {
        user_name: userData.name,
        user_email: userData.email,
        user_zip: userData.zipCode,
        user_alias: userData.alias
    }
    const playerInfo = await axios.post(addUserURL, payload)
        .then(response => response.data)
    return playerInfo
}

async function getCnnImageURLS() {
    const CnnImageURLS = await axios.get(getCNNDeckURLS)
        .then(response => {
            if (response.status != 200) {
                return []
            }            
            return response.data
        })
    return CnnImageURLS
}

async function createGame(playerUID, numOfRounds, roundTime, scoreType){
    const payload = {
        user_uid: playerUID,
        rounds: numOfRounds.toString(),
        round_time: "00:00:" + roundTime.toString(),
        scoring_scheme: scoreType
    }
    const gameInfo = await axios.post(createGameURL, payload)
        .then(response => response.data)
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
    const decksInfo = await axios.get(decksURL + "/" + playerUID + "," + "true")
        .then(response => response.data.decks_info)
    return decksInfo
}

async function getPlayers(gameCode){
    const players = await axios.get(getPlayersURL + gameCode)
        .then(response => response.data.players_list)
    return players
}

async function selectDeck(deckUID, gameCode, roundNumber){
    const payload = {
        game_code: gameCode.toString(),
        deck_uid: deckUID.toString(),
        round_number: roundNumber.toString()
    }
    await axios.post(selectDeckURL, payload)
    return
}

async function assignDeck(deckUID, gameCode){
    const payload = {
        deck_uid: deckUID,
        game_code: gameCode
    }
    await axios.post(postAssignDeckURL, payload)
    return
}

async function setDatabaseImages(gameCode, roundNumber){
    await axios.get(getUniqueImageInRoundURL + gameCode + "," + roundNumber)
    return
}

async function getApiImages(userData){
    const imageURLs = await getApiImagesHelper(userData)
    return imageURLs
}

async function postRoundImage(gameCode, roundNumber, imageURL){
    const payload = {
        game_code: gameCode,
        round_number: roundNumber.toString(),
        image: imageURL
    }
    await axios.post(postRoundImageURL, payload)
    return
}

async function getDatabaseImage(userData){
    const imageURL = await axios.get(getImageURL + userData.gameCode + "," + userData.roundNumber)
        .then(response => response.data.image_url)
    return imageURL
}

async function submitCaption(caption, userData){
    const payload = {
        caption: caption,
        user_uid: userData.playerUID,
        game_code: userData.gameCode,
        round_number: userData.roundNumber.toString()
    }
    const numOfPlayersSubmitting = await axios.post(submitCaptionURL, payload)
        .then(response => response.data.no_caption_submitted)
    return numOfPlayersSubmitting
}

async function getSubmittedCaptions(userData) {
    const submittedCaptions = await axios.get(getAllSubmittedCaptionsURL + userData.gameCode + "," + userData.roundNumber)
        .then(response => response.data.players)
    return submittedCaptions
}

async function postVote(caption, userData){
    const payload = {
        caption: caption,
        user_id: userData.playerUID,
        game_code: userData.gameCode,
        round_number: userData.roundNumber.toString()
    }
    const numOfPlayersVoting = await axios.post(postVoteCaptionURL, payload)
        .then(response => response.data.players_count)
    return numOfPlayersVoting
}

async function updateScores(userData){
    await axios.get(getUpdateScoresURL + userData.gameCode + "," + userData.roundNumber)
    return
}

async function leftOverVotingPlayers(userData){
    const numOfPlayersVoting = await axios.get(getPlayersWhoHaventVotedURL + userData.gameCode + "," + userData.roundNumber)
        .then(response => response.data.players_count)
    return numOfPlayersVoting
}

async function getScoreBoard(userData){
    const scoreBoard = await axios.get(getScoreBoardURL + userData.gameCode + "," + userData.roundNumber)
        .then(response => response.data.scoreboard)
    return scoreBoard
}

async function createNextRound(userData){
    const payload = {
        game_code: userData.gameCode,
        round_number: userData.roundNumber.toString()
    }
    await axios.post(createNextRoundURL, payload)
    return
}

async function postCreateRounds(gameCode, imageURLs){
    const payload = {
        game_code: gameCode,
        images: imageURLs
    }
    const imageURL = await axios.post(createRounds, payload)
        .then(response => response.data.image)
    return imageURL
}

async function getNextImage(gameCode, roundNumber){
    const payload = {
        game_code: gameCode,
        round_number: roundNumber.toString()
    }
    const imageURL = await axios.post(nextImage, payload)
        .then(response => response.data.image)
    return imageURL
}

async function sendError(code1, code2){
    await axios.get(errorURL + code1 + "*" + code2).then(res => {console.log(res)})
    return
}
async function getGameScore(gameCode,roundNo){
    const scoreboard = await axios.get(getgameScoreURL + '/' + gameCode + ',' + roundNo).then(response => {
        return response.data.scoreboard
    })
    return scoreboard
}
export { ably, checkGameCode, checkEmailCode, addUser, createGame,
    joinGame, getDecks, selectDeck, assignDeck, setDatabaseImages,
    getApiImages, postRoundImage, getDatabaseImage, getPlayers, submitCaption,
    getSubmittedCaptions, postVote, updateScores, leftOverVotingPlayers, getScoreBoard,
    createNextRound, postCreateRounds, getNextImage, sendError,getCnnImageURLS ,checkGameStarted,getGameScore,getGameImageForRound}