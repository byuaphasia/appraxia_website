import React from "react";
import {Route, Redirect, RouteProps} from "react-router-dom";
import {LoggedInRoutes} from "../../constants/routes";

interface LoggedOutRouteProps extends RouteProps {
    isAuthenticated: boolean,
}

export default class LoggedOutRoute extends Route<LoggedOutRouteProps> {
    render() {
        const {isAuthenticated, path} = this.props;
        if (isAuthenticated) {
            return <Redirect to={LoggedInRoutes.HOME} from={path as string}/>
        }
        else {
            return <Route {...this.props}/>
        }
    }
}

