import React, {useContext, useState, useEffect} from "react";
import {BrowserRouter as Router} from "react-router-dom";
import {Redirect, Route, Switch} from "react-router-dom";
import Page1 from "./Pages/Page";
import Collections from "./Pages/Collections";
import Scoreboard from "./Pages/Scoreboard";
import Landing from "./Pages/Landing";
import HiddenPage from "./Pages/HiddenPage";
import Selection from "./Pages/Selection";
import Waiting from "./Pages/Waiting";
import GameRules from "./Pages/GameRules"
import DeckInfo from "./Pages/DeckInfo"
import Error from "./Pages/Error";
import Rounds from "./Pages/Rounds";
import Endgame from "./Pages/Endgame";
import ScoreType from "./Pages/ScoreType";
import UploadPage from "./Pages/UploadPage";
import GooglePhotos from "./Pages/GooglePhotos";
import {LandingContext} from "./App";
import Ably from 'ably/promises';
import Confirmation from "./Pages/Confirmation";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CookiesProvider, useCookies } from "react-cookie";

const client = new Ably.Realtime('KdQRaQ.Xl1OGw:yvmvuVmPZkzLf3ZF');

// export const LandingContext = React.createContext();

export default function Nav() {

    const { userData, setUserData, cookies, setCookie } = useContext(LandingContext);
    
    const channel_page = client.channels.get(`Captions/Page/${userData.code}`);
    const channel_waiting = client.channels.get(`Captions/Waiting/${userData.code}`);
    const channel_rounds = client.channels.get(`Captions/Rounds/${userData.code}`);
    const channel_voted_host = client.channels.get(`Captions/Vote/Host/${userData.code}`);
    const channel_voted_all = client.channels.get(`Captions/Vote/All/${userData.code}`);
    const channel_scoreboard = client.channels.get(`Captions/Scoreboard/${userData.code}`);
    const channel_joining = client.channels.get(`Captions/Landing/${userData.code}`);

    return (
            <GoogleOAuthProvider 
                    clientId="336598290180-69pe1qeuqku450vnoi8v1ehhi19jhpmt.apps.googleusercontent.com">
                <Router>
                    <Switch>
                        <Route exact path='/'>
                            <Landing client = {client} channel_waiting={channel_waiting}/>
                        </Route>


                        {/* This format below doesn't work */}
                        {/* <Route exact path="/confirmation" component={Confirmation} setCode={setCode} setName={setName} setEmail={setEmail} setZipCode={setZipCode}
                                    setAlias={setAlias} setGameUID={setGameUID} setHost={setHost} setPlayerUID={setPlayerUID} client = {client} channel= {channel_joining} setRoundNumber= {setRoundNumber} setRounds ={setRounds}/> */}

                        <Route exact path='/confirmation'>
                            <Confirmation client = {client} />
                        </Route>

                        <Route exact path='/rounds'>
                            <Rounds />
                        </Route>


                        <Route exact path="/scoretype">
                            <ScoreType channel = {channel_rounds} />
                        </Route>


                        <Route exact path='/waiting'>
                            <Waiting channel = {channel_waiting} channel2 = {channel_rounds} channel_joining= {channel_joining} />
                        </Route>


                        <Route exact path="/collections" component={Collections} />
                    

                        <Route exact path="/googleAuth">
                            <GooglePhotos />
                        </Route>


                        <Route exact path = "/page">
                            <Page1 channel = {channel_page} channel_waiting = {channel_waiting} channel_joining = {channel_joining} />
                        </Route>


                        <Route exact path="/selection" >
                            <Selection channel_host = {channel_voted_host} channel_all = {channel_voted_all} channel_waiting = {channel_waiting} channel_joining = {channel_joining} />
                        </Route>


                        <Route exact path='/scoreboard'>
                            <Scoreboard channel = {channel_scoreboard} channel_waiting = {channel_waiting} channel_joining = {channel_joining} />
                        </Route>

                        <Route exact path='/endgame'>
                            <Endgame />
                        </Route>


                        <Route exact path="/gamerules" >
                            <GameRules channel2 = {channel_rounds} ></GameRules>
                        </Route>


                        <Route exact path="/deckinfo" component={DeckInfo}/>


                        <Route exact path="/error" component={Error}/>


                        <Route exact path="/uploadPage" component={UploadPage}/>


                        <Route exact path="/hiddenpage" component={HiddenPage}/>
                    </Switch>
                </Router>
            </GoogleOAuthProvider>
    );
}
