import React from "react";
import {Route, Redirect, RouteProps} from "react-router-dom";
import {AdminRoutes, LoggedInRoutes} from "../../constants/routes";

interface LoggedOutRouteProps extends RouteProps {
    isAuthenticated: boolean,
    isAdmin: boolean,
}

export default class LoggedOutRoute extends Route<LoggedOutRouteProps> {
    render() {
        const {isAuthenticated, isAdmin, path} = this.props;
        if (isAuthenticated && isAdmin) {
            return <Redirect to={AdminRoutes.HOME} from={path as string}/>
        }
        else if (isAuthenticated && !isAdmin) {
            return <Redirect to={LoggedInRoutes.HOME} from={path as string}/>
        }
        else {
            return <Route {...this.props}/>
        }
    }
}

