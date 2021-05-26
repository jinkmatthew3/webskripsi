import React from "react";
import { Switch, Route } from "react-router-dom";
import Data from "./pages/data";
import Home from "./pages/home";
import Test from "./pages/test";

function Routes() {
    return (
        <Switch>
            <Route path="/" exact component={ Home }></Route>
            <Route path="/home" exact component={ Home } />
            <Route path="/data" exact component={ Data } />
            <Route path="/test" exact component={ Test } />
            {/* <Route component={NotFound} /> */}  
        </Switch>
    )
}

export default Routes;