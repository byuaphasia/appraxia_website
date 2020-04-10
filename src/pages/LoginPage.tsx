import React from 'react';
import {NavLink as Link} from "react-router-dom";
import EmailIcon from '../assets/icon/email-24px.svg';
import PasswordIcon from '../assets/icon/vpn_key-24px.svg';
import {TextField, Icon, Dialog, DialogTitle, DialogContent} from "@material-ui/core";
import {LoggedOutRoutes} from "../constants/routes";
import Errors from "../components/Errors";
import Splash from "../components/Splash";

import BackendClient from "../helpers/backend-client";
import Cognito from "../helpers/cognito/cognito";

import "../style/pages/LoginPage.css";
import {withCognito} from "../helpers/cognito/CognitoContext";
import CustomButton from "../components/CustomButton";
import {isValidEmail} from "../helpers/functions";
import ForgotPassword from "./ForgotPassword";

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
    showErrors: boolean,
    showModal: boolean
}

class LoginPage extends React.Component<Props, State> {
    componentDidMount(): void {
        this.setState({
            backendClient: new BackendClient(),
            showErrors: false,
            showModal: false,
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

    async handleForgotPassword() {
        const {cognito} = this.props;
        const {email} = this.state;

        let errors: string[] = [];

        if (email && isValidEmail(email)) {
            await cognito.sendForgotPassword(email).catch(e => {
                errors.push(e);
                this.setState({errors, showErrors: true});
            });
            this.setState({showModal: true});
        }
        else {
            errors.push("Invalid Email Entered");
            this.setState({errors, showErrors: true});
        }
    }

    async handleKeyPress(event: any) {
        if (event.key === "Enter") {
            await this.handleSignIn();
        }
    }

    render() {
        const {email, password, errors = [], showErrors, showModal} = this.state || {};

        return (
            <>
                <div id="login">
                    <Splash/>
                    <br/>
                    <TextField label="Email"
                                value={email}
                                InputProps={{
                                    startAdornment: <Icon><img src={EmailIcon} alt="email_icon"/></Icon>
                                }}
                                onKeyPress={this.handleKeyPress.bind(this)}
                                onChange={e => this.setState({email: e.target.value})}/>
                    <br/>
                    <TextField label="Password"
                                value={password}
                                type="password"
                                InputProps={{
                                    startAdornment: <Icon><img src={PasswordIcon} alt="password_icon"/></Icon>
                                }}
                                onKeyPress={this.handleKeyPress.bind(this)}
                                onChange={e => this.setState({password: e.target.value})}/>

                    <Errors errors={errors} show={showErrors} onClose={() => this.setState({showErrors: false})}/>

                    <CustomButton label="Sign In" type="submit" onClick={this.handleSignIn.bind(this)}/>
                    <button className="link" onClick={this.handleForgotPassword.bind(this)}>Forgot Password?</button>
                    <Link className="link" to={LoggedOutRoutes.SIGNUP}>Sign Up</Link>
                </div>

                <Dialog open={showModal} fullWidth maxWidth="xs"
                        onClose={() => this.setState({showModal: false})}>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogContent>
                        <ForgotPassword email={email} onClose={() => this.setState({showModal: false})}/>
                    </DialogContent>
                </Dialog>
            </>
        );
    }
}

export default withCognito(LoginPage);