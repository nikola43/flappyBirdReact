import React, { ReactElement } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//import App from './App'
import NotFound from './pages/notfound'
import Home from './pages/home';
import Intro from './pages/intro';

const Routes = (): ReactElement => {

    return (
        <Router>
            <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/game' component={Home} />
                <Route exact path='*' component={NotFound} />
            </Switch>
        </Router>
    )
};

export default Routes;
