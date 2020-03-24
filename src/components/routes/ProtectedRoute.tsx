import React from "react";
import {Route, Redirect, RouteProps} from "react-router-dom";
import {LoggedOutRoutes} from "../../constants/routes";

interface ProtectedRouteProps extends RouteProps {
    isAuthenticated: boolean,
}

export default class ProtectedRoute extends Route<ProtectedRouteProps> {
    render() {
        const {isAuthenticated, path} = this.props;
        if (!isAuthenticated) {
            return <Redirect to={LoggedOutRoutes.LOGIN} from={path as string}/>
        }
        else {
            return <Route {...this.props}/>
        }
    }
}

