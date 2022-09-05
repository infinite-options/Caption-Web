import React, {useContext} from 'react'
import { LandingContext } from '../App';

export const CookieHelper = () => {
    const {userData, setUserData, cookies, setCookie} = useContext(LandingContext);

    // FUNCTION: InitializeCookies()
    // DESCRIPTION: Sets default cookie values in Landing page
    const initializeCookies = () => {
        setCookie("userData", {
            ...cookies.userData,
            "code": "",
            "gameUID": "",
            "rounds": "10",
            "roundDuration": "30",
            "host": "",
            "playerUID": "",
            "roundNumber": "",
            "imageURL": "",
            "scoreboardInfo": [],
            "deckSelected": "",
            "deckTitle": "",
            "isApi": false,
            "googlePhotos": {
                "albumId": "",
                "accessToken": ""
            }
        })
    }


    // FUNCTION: GetCookies() 
    // ARGUMENTS: 
        // hooksNeeded => Type: String array => Array of hooks to check (e.g. ["name", "email", "zipcode"])
        // setDisplayHtml => Type: Function => Function that renders html on page
    // DESCRIPTION : If hooks' values from hooksNeeded are empty, load cookie values into hooks
    const getCookies = (hooksNeeded, setDisplayHtml) => {
        console.log("hooksUpdate before: ", hooksUpdate)


        if(cookies.userData === undefined) 
            return

        console.log("Starting getCookies() in", window.location.href)
        let hooksUpdate = {}

        console.log("Current cookies", cookies.userData)
        console.log("hooksUpdate: ", hooksUpdate)
        console.log("hooksNeeded", hooksNeeded)

        // If userData has incorrect cookieName value, load value from cookies
        for(let i = 0; i < hooksNeeded.length; i++) {
            console.log("userData[hooksNeeded[i]]: ", userData[hooksNeeded[i]])
            console.log("cookies.userData[hooksNeeded[i]]", cookies.userData[hooksNeeded[i]])

            if(userData[hooksNeeded[i]] !== cookies.userData[hooksNeeded[i]]) {}
                hooksUpdate[hooksNeeded[i]] = cookies.userData[hooksNeeded[i]]
        }

        console.log("hooksUpdate after loop: ", hooksUpdate)

        let hooksUpdateSize = Object.keys(hooksUpdate).length

        // If no updates, render html immediately
        // Else, update hooks then render html
        if(hooksUpdateSize.length <= 0){
            console.log("No userData update")
            setDisplayHtml(true)
        } else {
            console.log("UserData updated with the following cookies:", hooksUpdate)
            setUserData({
                ...userData,
                ...hooksUpdate
            })
            setDisplayHtml(true)
        }
    }
    


    return {initializeCookies, getCookies}
}



