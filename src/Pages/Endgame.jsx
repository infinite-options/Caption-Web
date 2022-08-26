import React, {useEffect, useState, useContext} from "react";
import "../Styles/Scoreboard.css";
import Report from "../Components/Report";
import {Button} from "../Components/Button";
import axios from "axios";
import {LandingContext} from "../App";

export default function Endgame() {

    const [scoreboardInfo, setScoreboardInfo] = useState([]);
    const { userData, setUserData, cookies, setCookie } = useContext(LandingContext);

    console.log("Endgame Cookies", cookies)

    // Load cookies into userData state on first render
    useEffect(() => {
        const getCookies = (propsToLoad) => {
            let localCookies = cookies.userData
            let cookieLoad = {}

            for(let i = 0; i < propsToLoad.length; i++) {
                let propName = propsToLoad[i]
                let propValue = localCookies[propName]
                cookieLoad[propName] = propValue
            }

            console.log("cookieLoad", cookieLoad)

            let newUserData = {
                ...userData,
                ...cookieLoad
            }
            console.log("newUserData", newUserData)

            setUserData(newUserData)
        }


        getCookies(["host", "roundNumber", "name", "alias", "email", "zipCode", "playerUID", "rounds", "roundDuration", "code", "deckTitle", "deckSelected", "imageURL", "photosFromAPI", "scoreboardInfo"])
    }, [])


    // Sets cookies for state variables in propsToPut array.
    // If updating state right before calling putCookies(), call putCookies(["stateName"], {"stateName": "stateValue"}) with a literal
    // state value to update cookie correctly.
    const putCookies = (propsToPut, instantUpdate) => {
        console.log("In put Cookies", propsToPut)
        let localCookies = {}
        
        if(cookies.userData === undefined) {
            setCookie("userData", {})
        } else {
            localCookies = cookies.userData
        }

        for(let i = 0; i < propsToPut.length; i++) {
            const propName = propsToPut[i]

            // State has not updated, referecnce instantUpdate
            if(instantUpdate !== undefined && instantUpdate[propName] !== undefined) {
                localCookies[propName] = instantUpdate[propName]
            } 
            // State already updated, reference userData
            else {
                localCookies[propName] = userData[propName]
            }
        }

        //console.log("local cookies end", localCookies)
        setCookie("userData", localCookies)
    }

    useEffect(() => {
        const getScoreBoardURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/getScoreBoard/";
        axios.get(getScoreBoardURL + userData.code + "," + userData.roundNumber).then((res) => {
            console.log("GET Get Scoreboard",res);

            res.data.scoreboard.sort((a, b) => (
                b.game_score === a.game_score ? 
                    b.score - a.score : b.game_score - a.game_score
            ));

            setScoreboardInfo(res.data.scoreboard);
        })

        if(userData.host) {
            const endgameURL = "https://bmarz6chil.execute-api.us-west-1.amazonaws.com/dev/api/v2/endGame/";
            axios.get(endgameURL + userData.code).then((res) => {
                console.log("GET EndGame",res);
            })
        }
    }, []);


    let winning_score = Number.NEGATIVE_INFINITY;
    for (const playerInfo of scoreboardInfo)
        winning_score = playerInfo.game_score > winning_score ? playerInfo.game_score :
            winning_score;


    function renderReports() {
        return (
            <div>
                {
                    scoreboardInfo.map((item, index) => (
                        <Report
                            isWinner={winning_score === item.game_score}
                            alias={item.user_alias}
                            caption={item.caption}
                            points={item.score}
                            totalPts={item.game_score}
                            votes={item.votes}
                        />
                    ))
                }
            </div>
        );
    }

    


    useEffect(() => 
        console.log('Currently in Endgame', "Alias:", userData.alias, "Current Round: ", userData.roundNumber), 
    []);


    return (
        <div
            style={{
                maxWidth: "370px",
                height: "100%",
                backgroundColor: "red"
            }}
        >
            <h1>Game Over</h1>
            
            <br/>

            <h3> Final Scores </h3>

            <br/>

            {renderReports()}

            <br/>

            <Button
                className="card"
                children="Navigate to Landing Page"
                destination="/"
                conditionalLink={true}
            />

            <br/>
        </div>
    );
}

