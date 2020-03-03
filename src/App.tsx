import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import {LoggedOutRoutes} from "./constants/routes";
import './style/App.css';
import SignUpPage from "./pages/SignUpPage";

function App() {
    return (
        <div className="app">
            <Router>
                <Switch>
                    <Route path={LoggedOutRoutes.SIGNUP}><SignUpPage/></Route>
                    <Route path={LoggedOutRoutes.LOGIN}><LoginPage/></Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
