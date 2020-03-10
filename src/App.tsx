import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import {LoggedOutRoutes, AdminRoutes} from "./constants/routes";
import SignUpPage from "./pages/SignUpPage";
import AdminHome from "./pages/admin/AdminHome";

import './style/App.css';

function App() {
    return (
        <div className="app">
            <Router>
                <Switch>
                    <Route path={LoggedOutRoutes.SIGNUP}><SignUpPage/></Route>
                    <Route path={LoggedOutRoutes.LOGIN}><LoginPage/></Route>
                    <Route path={AdminRoutes.HOME}><AdminHome/></Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
