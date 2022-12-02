import axios from "axios";

const addUserURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/addUser"
const createGameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/createGame"

async function getPlayerUID(userData) {
    let payload = {
        user_name: userData.name,
        user_email: userData.email,
        user_zip: userData.zipCode,
        user_alias: userData.alias
    }
    const playerUID = await axios.post(addUserURL, payload).then(response => response.data.user_uid)
    return playerUID
}

async function getGameCode(userData, numOfRounds, roundTime){
    let payload = {
        user_uid: userData.playerUID,
        rounds: numOfRounds,
        round_time: "00:00:" + roundTime,
        scoring_scheme: "V"
    }
    const gameInfo = await axios.post(createGameURL, payload).then(response => response.data)
    return gameInfo
}

export { getPlayerUID, getGameCode }
