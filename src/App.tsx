import React from 'react';
import {BrowserRouter as Router, Switch} from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import {LoggedOutRoutes, AdminRoutes, LoggedInRoutes} from "./constants/routes";
import SignUpPage from "./pages/SignUpPage";
import AdminHome from "./pages/admin/AdminHome";
import AdminTable from "./pages/admin/AdminTable";

import './style/App.css';
import Cognito from "./helpers/cognito/cognito";
import LoggedOutRoute from "./components/routes/LoggedOutRoute";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import CognitoContext from "./helpers/cognito/CognitoContext";
import LoggedInHome from "./pages/logged_in/LoggedInHome";
import LoggedInTest from "./pages/logged_in/LoggedInTest";

interface State {
    isLoggedIn: boolean,
    isAdmin: boolean,
}

class App extends React.Component<{}, State> {
    private readonly cognito: Cognito;

    constructor(props: any) {
        super(props);
        this.cognito = new Cognito();
        this.state = {
            isLoggedIn: false,
            isAdmin: false
        }
    }


    async componentDidMount(): Promise<void> {
        let loggedIn = await this.cognito.isLoggedIn();
        this.setState({isLoggedIn: loggedIn});
    }

    setIsLoggedIn(value: boolean) {
        this.setState({isLoggedIn: value});
    }

    // setIsAdmin(value: boolean) {
    //     this.setState({isAdmin: value});
    // }

    render() {
        const {isLoggedIn, isAdmin} = this.state || {};

        return (
            <div className="app">
                <CognitoContext.Provider value={this.cognito}>
                    <Router>
                        <Switch>
                            {/*--------------Logged In Routes--------------------*/}
                            <ProtectedRoute exact isAuthenticated={isLoggedIn && !isAdmin} path={LoggedInRoutes.HOME}>
                                <LoggedInHome setIsLoggedIn={this.setIsLoggedIn.bind(this)}/>
                            </ProtectedRoute>
                            <ProtectedRoute exact isAuthenticated={isLoggedIn} path={LoggedInRoutes.TEST}>
                                <LoggedInTest/>
                            </ProtectedRoute>
                            <ProtectedRoute exact isAuthenticated={isLoggedIn} path={LoggedInRoutes.REPORT}>
                                <h3>Logged In Report</h3>
                            </ProtectedRoute>

                            {/*-----------------Admin Routes---------------------*/}
                            <ProtectedRoute exact isAuthenticated={isLoggedIn && isAdmin} path={AdminRoutes.HOME}>
                                <AdminHome/>
                            </ProtectedRoute>
                            <ProtectedRoute exact isAuthenticated={isLoggedIn && isAdmin} path={AdminRoutes.VIEWDATA}>
                                <AdminTable/>
                            </ProtectedRoute>

                            {/*----------------Logged Out Routes------------------*/}
                            <LoggedOutRoute exact
                                            isAuthenticated={isLoggedIn}
                                            isAdmin={isAdmin}
                                            path={LoggedOutRoutes.SIGNUP}>
                                <SignUpPage/>
                            </LoggedOutRoute>
                            <LoggedOutRoute exact
                                            isAuthenticated={isLoggedIn}
                                            isAdmin={isAdmin}
                                            path={LoggedOutRoutes.LOGIN}>
                                <LoginPage
                                    setIsLoggedIn={this.setIsLoggedIn.bind(this)}
                                    setIsAdmin={() => {}}/>
                            </LoggedOutRoute>
                        </Switch>
                    </Router>
                </CognitoContext.Provider>
            </div>
        );
    }
}

export default App;
