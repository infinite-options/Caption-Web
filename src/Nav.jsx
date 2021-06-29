import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Redirect, Route, Switch } from "react-router-dom";
import Page1 from "./Pages/Page";
import Collections from "./Pages/Collections";
import Scoreboard from "./Pages/Scoreboard";
import Landing from "./Pages/Landing";

export default function Nav() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/collections" component={Collections} />
        <Route exact path="/scoreboard" component={Scoreboard} />
        <Route exact path="/page" component={Page1} />
      </Switch>
    </Router>
  );
}
