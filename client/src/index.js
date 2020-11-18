import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';

import AuthCodeReader from "./AuthCodeReader";
import App from "./App";

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Switch>
                <Route path="/auth-code-reader" component={AuthCodeReader}/>
                <Route path="/" component={App}/>
                <Route path="*"><Redirect to="/"/></Route>
            </Switch>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);