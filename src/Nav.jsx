import React, {useContext, useState} from "react";
import {BrowserRouter as Router} from "react-router-dom";
import {Redirect, Route, Switch} from "react-router-dom";
import Page1 from "./Pages/Page";
import Collections from "./Pages/Collections";
import Scoreboard from "./Pages/Scoreboard";
import Landing from "./Pages/Landing";
import Selection from "./Pages/Selection";
import Waiting from "./Pages/Waiting";
import Info from "./Pages/Info";
import Rules from "./Pages/Rules";
import Error from "./Pages/Error";
import {LandingContext} from "./App";

// export const LandingContext = React.createContext();

export default function Nav() {

    const {setCode, setName, setEmail, setZipCode} = useContext(LandingContext);

    return (
        <Router>
            <Switch>

                <Route exact path='/'>
                    {/*<LandingContext.Provider value = {{code, name, email, zipCode}}>*/}
                    <Landing setCode={setCode} setName={setName} setEmail={setEmail} setZipCode={setZipCode}/>
                    {/*</LandingContext.Provider>*/}
                </Route>

                {/*This way of rendering the component forces re-renders in a way that I don't want atm*/}
                <Route exact path='/' component={() => <Landing setCode={setCode} setName={setName} setEmail={setEmail}
                                                                setZipCode={setZipCode}/>}/>


                <Route exact path="/collections" component={Collections}/>
                <Route exact path="/scoreboard" component={Scoreboard}/>
                <Route exact path="/page" component={Page1}/>
                <Route exact path="/selection" component={Selection}/>
                {/*<Route exact path="/waiting" component={Waiting} />*/}

                <Route exact path='/waiting'>
                    {/*<LandingContext.Provider value = {{code, name, email, zipCode}}>*/}
                    <Waiting/>
                    {/*</LandingContext.Provider>*/}
                </Route>

                <Route exact path="/info" component={Info}/>
                <Route exact path="/rules" component={Rules}/>
                <Route exact path="/error" component={Error}/>
            </Switch>
        </Router>
    );
}
