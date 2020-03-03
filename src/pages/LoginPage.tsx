import React from 'react';
import {NavLink as Link} from "react-router-dom";
import IconLogo from '../assets/img/Icon Logo.png';
import TextLogo from '../assets/img/Text Logo.png';
import EmailIcon from '../assets/icon/email-24px.svg';
import PasswordIcon from '../assets/icon/vpn_key-24px.svg';
import InputField from "../components/InputField";
import {LoggedOutRoutes} from "../constants/routes";
import CustomButton from "../components/CustomButton";

import BackendClient from "../helpers/backend-client";

interface Props {
    email?: string,
    password?: string,
}

interface State {
    email: string,
    password: string,
    backendClient: BackendClient,
}

export default class LoginPage extends React.Component<Props, State> {
    componentDidMount(): void {
        this.setState({backendClient: new BackendClient()});
    }

    render() {
        const {email, password, backendClient} = this.state || {};
        return (
            <div id="login">
                <div className="splash">
                    <img className="icon" src={IconLogo} alt="icon"/>
                    <img className="text" src={TextLogo} alt="text"/>
                </div>
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
                    await backendClient.healthCheck();
                }}/>
                <button type="button" className="link">Forgot Password?</button>
                <Link className="link" to={LoggedOutRoutes.SIGNUP}>Sign Up</Link>
            </div>
        );
    }
}