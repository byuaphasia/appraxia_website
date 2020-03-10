import React from 'react';
import {NavLink as Link, Redirect} from "react-router-dom";
import EmailIcon from '../assets/icon/email-24px.svg';
import PasswordIcon from '../assets/icon/vpn_key-24px.svg';
import InputField from "../components/InputField";
import {AdminRoutes, LoggedOutRoutes} from "../constants/routes";
import CustomButton from "../components/CustomButton";
import Splash from "../components/Splash";

import BackendClient from "../helpers/backend-client";

import "../style/pages/LoginPage.css"

interface Props {
    email?: string,
    password?: string,
}

interface State {
    email: string,
    password: string,
    backendClient: BackendClient,
    toAdminDashboard: boolean
}

export default class LoginPage extends React.Component<Props, State> {
    componentDidMount(): void {
        this.setState({backendClient: new BackendClient()});
    }

    render() {
        const {email, password, backendClient, toAdminDashboard} = this.state || {};

        if (toAdminDashboard) {
            return <Redirect to={AdminRoutes.HOME}/>;
        }

        return (
            <div id="login">
                <Splash/>
                <br/>
                <InputField label="Email"
                            value={email}
                            startAdornment={EmailIcon}
                            onChange={value => this.setState({email: value})}/>
                <br/>
                <InputField label="Password"
                            value={password}
                            type="password"
                            startAdornment={PasswordIcon}
                            onChange={value => this.setState({password: value})}/>

                <CustomButton label="Sign In" onClick={async () => {
                    console.log("Health Check: " + await backendClient.healthCheck());
                    this.setState({toAdminDashboard: true})
                }}/>
                <button type="button" className="link">Forgot Password?</button>
                <Link className="link" to={LoggedOutRoutes.SIGNUP}>Sign Up</Link>
            </div>
        );
    }
}