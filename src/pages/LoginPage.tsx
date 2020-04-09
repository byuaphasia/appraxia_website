import React from 'react';
import {NavLink as Link} from "react-router-dom";
import EmailIcon from '../assets/icon/email-24px.svg';
import PasswordIcon from '../assets/icon/vpn_key-24px.svg';
import InputField from "../components/InputField";
import {LoggedOutRoutes} from "../constants/routes";
import Errors from "../components/Errors";
import Splash from "../components/Splash";

import BackendClient from "../helpers/backend-client";
import Cognito from "../helpers/cognito/cognito";

import "../style/pages/LoginPage.css";
import {withCognito} from "../helpers/cognito/CognitoContext";
import CustomButton from "../components/CustomButton";

interface Props {
    email?: string,
    password?: string,
    cognito: Cognito,
    setIsLoggedIn(value: boolean, isAdmin: boolean): void
}

interface State {
    email: string,
    password: string,
    backendClient: BackendClient,
    toAdminDashboard: boolean,
    toDashboard: boolean,
    errors: string[],
    showErrors: boolean;
}

class LoginPage extends React.Component<Props, State> {
    componentDidMount(): void {
        this.setState({
            backendClient: new BackendClient(),
            //TESTING PURPOSES ONLY TODO: Remove for production
            email: "drakebwade@gmail.com",
            password: "Password1",
            showErrors: false
        });
    }

    async handleSignIn() {
        const {setIsLoggedIn, cognito} = this.props;
        const {email, password, backendClient} = this.state;

        let errors: string[] = [];

        await cognito.signIn(email, password).catch(reason => {
            errors.push(reason);
            this.setState({errors, showErrors: true});
        });

        const userType = await backendClient.getUserType().catch(reason => {
            errors.push(reason);
            this.setState({errors, showErrors: true});
        });

        if (errors.length === 0) {
            setIsLoggedIn(true, userType === "admin");
        }
        else {
            return;
        }
    }

    async handleKeyPress(event: any) {
        if (event.key === "Enter") {
            await this.handleSignIn();
        }
    }

    render() {
        const {email, password, errors = [], showErrors} = this.state || {};

        return (
            <div id="login">
                <Splash/>
                <br/>
                <InputField label="Email"
                            value={email}
                            startAdornment={EmailIcon}
                            onKeyPress={this.handleKeyPress.bind(this)}
                            onChange={(value: string) => this.setState({email: value})}/>
                <br/>
                <InputField label="Password"
                            value={password}
                            type="password"
                            startAdornment={PasswordIcon}
                            onKeyPress={this.handleKeyPress.bind(this)}
                            onChange={(value: string) => this.setState({password: value})}/>

                <Errors errors={errors} show={showErrors} onClose={() => this.setState({showErrors: false})}/>

                <CustomButton label="Sign In" type="submit" onClick={this.handleSignIn.bind(this)}/>
                <button type="button" className="link">Forgot Password?</button>
                <Link className="link" to={LoggedOutRoutes.SIGNUP}>Sign Up</Link>
            </div>
        );
    }
}

export default withCognito(LoginPage);