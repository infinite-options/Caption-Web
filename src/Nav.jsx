import React, {useContext, useState, useEffect} from "react";
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
import ScoreType from "./Pages/ScoreType";
import {LandingContext} from "./App";
import Ably from 'ably/promises';
import uploadPage from "./Pages/uploadPage";
const client = new Ably.Realtime('KdQRaQ.Xl1OGw:yvmvuVmPZkzLf3ZF');

// export const LandingContext = React.createContext();

export default function Nav() {

    const {code, setCode, setName, setEmail, setZipCode, setAlias, setGameUID, setRounds, setRoundDuration, setHost, setRoundNumber, setPlayerUID, setImageURL, rounds, roundNumber} = useContext(LandingContext);
    const channel_page = client.channels.get(`Captions/Page/${code}`);
    const channel_waiting = client.channels.get(`Captions/Waiting/${code}`);
    const channel_rounds = client.channels.get(`Captions/Rounds/${code}`);
    const channel_voted_host = client.channels.get(`Captions/Vote/Host/${code}`);
    const channel_voted_all = client.channels.get(`Captions/Vote/All/${code}`);
    const channel_scoreboard = client.channels.get(`Captions/Scoreboard/${code}`);
    const channel_joining = client.channels.get(`Captions/Landing/${code}`);

    useEffect(() => {
        // async function subscribe(){
        //     await channel_waiting.subscribe(something => {
        //         console.log("newPlayerName", something.data.newPlayerName);
        //         channel_joining.publish({data: {rounds: rounds, roundNumber: roundNumber, path: window.location.pathname}})
        //     })
        // }
        // subscribe();
        // return function cleanup(){
        //     channel_joining.unsubscribe();
        // }
    }, []);

    return (
        <Router>
            <Switch>

                <Route exact path='/'>
                    <Landing setCode={setCode} setName={setName} setEmail={setEmail} setZipCode={setZipCode}
                             setAlias={setAlias} setGameUID={setGameUID} setHost={setHost} setPlayerUID={setPlayerUID} client = {client} channel= {channel_joining} setRoundNumber= {setRoundNumber} setRounds ={setRounds} />
                </Route>

                {/*This way of rendering the component forces re-renders in a way that I don't want atm*/}
                {/*<Route exact path='/' component={() => <Landing setCode={setCode} setName={setName} setEmail={setEmail}*/}
                {/*                                                setZipCode={setZipCode} setAlias={setAlias}/>}/>*/}


                <Route exact path="/collections" component={Collections}/>


                <Route exact path='/scoreboard'>
                    <Scoreboard setRoundNumber = {setRoundNumber} channel = {channel_scoreboard} channel_waiting = {channel_waiting} channel_joining = {channel_joining} />
                </Route>

                {/*<Route exact path="/page" component={Page1}/>*/}
                <Route exact path = "/page">
                    <Page1 setImageURL = {setImageURL} setRounds = {setRounds} channel = {channel_page} channel_waiting = {channel_waiting} channel_joining = {channel_joining}/>
                </Route>

                <Route exact path="/selection" >
                    <Selection channel_host = {channel_voted_host} channel_all = {channel_voted_all} channel_waiting = {channel_waiting} channel_joining = {channel_joining}/>
                </Route>

                <Route exact path='/waiting'>
                    <Waiting channel = {channel_waiting} channel2 = {channel_rounds} channel_joining= {channel_joining} />
                </Route>

                <Route exact path="/gamerules" component={GameRules}/>
                <Route exact path="/deckinfo" component={DeckInfo}/>
                {/*<Route exact path="/error" component={Error}/>*/}

                <Route exact path="/uploadPage" component={uploadPage}/>


                <Route exact path='/rounds'>
                    <Rounds setRounds={setRounds} setRoundDuration={setRoundDuration}  />
                </Route>

                <Route exact path='/endgame'>
                    <Endgame setRoundNumber = {setRoundNumber} />
                </Route>
                <Route exact path="/scoretype">
                    <ScoreType channel = {channel_rounds} />
                </Route>
            </Switch>
        </Router>
    );
}
