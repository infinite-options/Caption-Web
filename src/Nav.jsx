import React, {useContext, useState} from "react";
import {BrowserRouter as Router} from "react-router-dom";
import {Redirect, Route, Switch} from "react-router-dom";
import Page1 from "./Pages/Page";
import Collections from "./Pages/Collections";
import Scoreboard from "./Pages/Scoreboard";
import Landing from "./Pages/Landing";
import Selection from "./Pages/Selection";
import Waiting from "./Pages/Waiting";
import GameRules from "./Pages/GameRules"
import DeckInfo from "./Pages/DeckInfo"
import Error from "./Pages/Error";
import Rounds from "./Pages/Rounds";
import Endgame from "./Pages/Endgame";
import {LandingContext} from "./App";

// export const LandingContext = React.createContext();

export default function Nav() {

    const {code, setCode, setName, setEmail, setZipCode, setAlias, setGameUID, setRounds, setRoundDuration, setHost, setRoundNumber, setPlayerUID, setImageURL} = useContext(LandingContext);

    return (
        <Router>
            <Switch>

                <Route exact path='/'>
                    <Landing setCode={setCode} setName={setName} setEmail={setEmail} setZipCode={setZipCode}
                             setAlias={setAlias} setGameUID={setGameUID} setHost={setHost} setPlayerUID={setPlayerUID}/>
                </Route>

                {/*This way of rendering the component forces re-renders in a way that I don't want atm*/}
                {/*<Route exact path='/' component={() => <Landing setCode={setCode} setName={setName} setEmail={setEmail}*/}
                {/*                                                setZipCode={setZipCode} setAlias={setAlias}/>}/>*/}


                <Route exact path="/collections" component={Collections}/>


                <Route exact path='/scoreboard'>
                    <Scoreboard setRoundNumber = {setRoundNumber} />
                </Route>

                {/*<Route exact path="/page" component={Page1}/>*/}
                <Route exact path = "/page">
                    <Page1 setImageURL = {setImageURL} setRounds = {setRounds}/>
                </Route>

                <Route exact path="/selection" component={Selection}/>

                <Route exact path='/waiting'>
                    <Waiting/>
                </Route>

                <Route exact path="/gamerules" component={GameRules}/>
                <Route exact path="/deckinfo" component={DeckInfo}/>
                <Route exact path="/error" component={Error}/>



                <Route exact path='/rounds'>
                    <Rounds setRounds={setRounds} setRoundDuration={setRoundDuration} />
                </Route>

                <Route exact path='/endgame'>
                    <Endgame setRoundNumber = {setRoundNumber} />
                </Route>
            </Switch>
        </Router>
    );
}
