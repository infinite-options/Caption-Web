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
import GoogleTest from "./Pages/GoogleTest";
import {LandingContext} from "./App";
import Ably from 'ably/promises';
import Confirmation from "./Pages/Confirmation";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CookiesProvider, useCookies } from "react-cookie";

const client = new Ably.Realtime('KdQRaQ.Xl1OGw:yvmvuVmPZkzLf3ZF');

// export const LandingContext = React.createContext();

export default function Nav() {

    const {code, setCode, setName, setEmail, setZipCode, setAlias, setGameUID, setRounds, roundDuration, setRoundDuration, setHost, setRoundNumber, setPlayerUID, setImageURL, rounds, roundNumber, tokens, setTokens, photosFromAPI, setPhotosFromAPI, deckSelected, setDeckSelected, loading, setLoading, deckTitle, setDeckTitle, cookies, setCookie} = useContext(LandingContext);
    
    const channel_page = client.channels.get(`Captions/Page/${code}`);
    const channel_waiting = client.channels.get(`Captions/Waiting/${code}`);
    const channel_rounds = client.channels.get(`Captions/Rounds/${code}`);
    const channel_voted_host = client.channels.get(`Captions/Vote/Host/${code}`);
    const channel_voted_all = client.channels.get(`Captions/Vote/All/${code}`);
    const channel_scoreboard = client.channels.get(`Captions/Scoreboard/${code}`);
    const channel_joining = client.channels.get(`Captions/Landing/${code}`);

    return (
            <GoogleOAuthProvider 
                    clientId="336598290180-69pe1qeuqku450vnoi8v1ehhi19jhpmt.apps.googleusercontent.com">
                <Router>
                    <Switch>
                        <Route exact path='/'>
                            <Landing setCode={setCode} setName={setName} setEmail={setEmail} setZipCode={setZipCode}
                                    setAlias={setAlias} setGameUID={setGameUID} setHost={setHost} setPlayerUID={setPlayerUID} client = {client} channel= {channel_joining} setRoundNumber= {setRoundNumber} setRounds ={setRounds} setRoundDuration={setRoundDuration}/>
                        </Route>


                        {/* This format below doesn't work */}
                        {/* <Route exact path="/confirmation" component={Confirmation} setCode={setCode} setName={setName} setEmail={setEmail} setZipCode={setZipCode}
                                    setAlias={setAlias} setGameUID={setGameUID} setHost={setHost} setPlayerUID={setPlayerUID} client = {client} channel= {channel_joining} setRoundNumber= {setRoundNumber} setRounds ={setRounds}/> */}

                        <Route exact path='/confirmation'>
                            <Confirmation setCode={setCode} setName={setName} setEmail={setEmail} setZipCode={setZipCode}
                                    setAlias={setAlias} setGameUID={setGameUID} setHost={setHost} setPlayerUID={setPlayerUID} client = {client} channel= {channel_joining} setRoundNumber= {setRoundNumber} setRounds ={setRounds} loading={loading} setLoading={setLoading}/>
                        </Route>


                        <Route exact path='/rounds'>
                            <Rounds setRounds={setRounds} setRoundDuration={setRoundDuration} photosFromAPI={photosFromAPI} />
                        </Route>


                        <Route exact path="/scoretype">
                            <ScoreType channel = {channel_rounds} photosFromAPI={photosFromAPI}/>
                        </Route>


                        <Route exact path='/waiting'>
                            <Waiting channel = {channel_waiting} channel2 = {channel_rounds} channel_joining= {channel_joining} deckSelected={deckSelected} loaing={loading} setLoading={setLoading}/>
                        </Route>


                        <Route exact path="/collections" component={Collections} photosFromAPI={photosFromAPI}/>
                    

                        <Route exact path="/googleAuth">
                            <GoogleTest photosFromAPI={photosFromAPI} setPhotosFromAPI={setPhotosFromAPI} setDeckSelected={setDeckSelected}/>
                        </Route>


                        <Route exact path = "/page">
                            <Page1 setImageURL = {setImageURL} setRounds = {setRounds} channel = {channel_page} channel_waiting = {channel_waiting} channel_joining = {channel_joining} roundDuration={roundDuration}/>
                        </Route>


                        <Route exact path="/selection" >
                            <Selection channel_host = {channel_voted_host} channel_all = {channel_voted_all} channel_waiting = {channel_waiting} channel_joining = {channel_joining} roundDuration={roundDuration}/>
                        </Route>


                        <Route exact path='/scoreboard'>
                            <Scoreboard setRoundNumber = {setRoundNumber} channel = {channel_scoreboard} channel_waiting = {channel_waiting} channel_joining = {channel_joining} photosFromAPI={photosFromAPI}/>
                        </Route>

                        <Route exact path='/endgame'>
                            <Endgame setRoundNumber = {setRoundNumber} setCode={setCode} setEmail={setEmail} setName={setName} setZipCode={setZipCode} setAlias={setAlias} setGameUID={setGameUID} setRounds={setRounds} setRoundDuration={setRoundDuration} setHost={setHost} setPlayerUID={setPlayerUID} setPhotosFromAPI={setPhotosFromAPI} setDeckSelected={setDeckSelected} setLoading={setLoading}/>
                        </Route>


                        <Route exact path="/gamerules" component={GameRules}/>


                        <Route exact path="/deckinfo" component={DeckInfo}/>


                        <Route exact path="/error" component={Error}/>


                        <Route exact path="/uploadPage" component={UploadPage}/>


                        <Route exact path="/hiddenpage" component={HiddenPage}/>
                    </Switch>
                </Router>
            </GoogleOAuthProvider>
    );
}
