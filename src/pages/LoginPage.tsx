import React from 'react';
import IconLogo from '../assets/img/Icon Logo.png';
import TextLogo from '../assets/img/Text Logo.png';
import EmailIcon from '../assets/icon/email-24px.svg';
import PasswordIcon from '../assets/icon/vpn_key-24px.svg';
import InputField from "../components/InputField";

interface Props {

}

interface State {
    email: string,
    password: string
}

export default class LoginPage extends React.Component<Props, State> {

    render() {
        const {email, password} = this.state || {};
        return (
            <div id="login">
                <div className="form">
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
                </div>
            </div>
        );
    }
}