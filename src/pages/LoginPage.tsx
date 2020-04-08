import React from 'react';
import {NavLink as Link} from "react-router-dom";
import EmailIcon from '../assets/icon/email-24px.svg';
import PasswordIcon from '../assets/icon/vpn_key-24px.svg';
import InputField from "../components/InputField";
import {LoggedOutRoutes} from "../constants/routes";
import LoadingButton from "../components/LoadingButton";
import Splash from "../components/Splash";

import BackendClient from "../helpers/backend-client";
import Cognito from "../helpers/cognito/cognito";

import "../style/pages/LoginPage.css"
import {withCognito} from "../helpers/cognito/CognitoContext";

interface Props {
    email?: string,
    password?: string,
    cognito: Cognito,
    setIsLoggedIn(value: boolean): void,
    setIsAdmin(value: boolean): void
}

interface State {
    email: string,
    password: string,
    backendClient: BackendClient,
    toAdminDashboard: boolean,
    toDashboard: boolean,
}

class LoginPage extends React.Component<Props, State> {
    componentDidMount(): void {
        this.setState({
            backendClient: new BackendClient(),
            email: "drakebwade@gmail.com",
            password: "Password1"
        });
    }

    async handleSignIn() {
        const {setIsLoggedIn, setIsAdmin, cognito} = this.props;
        const {email, password, backendClient} = this.state;

        await cognito.signIn(email, password).catch(reason => {
            console.log(reason);
        });

        setIsLoggedIn(true);
        setIsAdmin(true);
    }

    render() {
        const {email, password} = this.state || {};

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

                <LoadingButton label="Sign In" onClick={async () => await this.handleSignIn()}/>
                <button type="button" className="link">Forgot Password?</button>
                <Link className="link" to={LoggedOutRoutes.SIGNUP}>Sign Up</Link>
            </div>
        );
    }
}

export default withCognito(LoginPage);