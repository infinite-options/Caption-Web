import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Redirect, Route, Switch } from "react-router-dom";
import Page1 from "./Pages/Page";
import Collections from "./Pages/Collections";
import Scoreboard from "./Pages/Scoreboard";
import Landing from "./Pages/Landing";
import Selection from "./Pages/Selection";
import Error from "./Pages/Error";
import GameRules from "./Pages/GameRules"
import DeckInfo from "./Pages/DeckInfo"

export default function Nav() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/collections" component={Collections} />
        <Route exact path="/scoreboard" component={Scoreboard} />
        <Route exact path="/page" component={Page1} />
        <Route exact path="/selection" component={Selection} />
        <Route exact path="/error" component={Error} />
        <Route exact path="/gamerules" component={GameRules} />
        <Route exact path="/deckinfo" component={DeckInfo} />
      </Switch>
    </Router>
  );
}
