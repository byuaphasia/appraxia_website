import React from 'react';
import IconLogo from '../assets/img/Icon Logo.png';
import TextLogo from '../assets/img/Text Logo.png';
import {
    Email as EmailIcon,
    House as HouseIcon,
    Phone as PhoneIcon,
    Person as PersonIcon,
    VPNKey as KeyIcon
} from '../assets/icon';
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import {Link} from "react-router-dom";
import {LoggedOutRoutes} from "../constants/routes";

import "../style/pages/SignUpPage.css";

interface Props {
    email?: string,
    password?: string
}

interface State {
    email: string,
    password: string,
    name: string,
    phone: string,
    address: string
}

export default class SignUpPage extends React.Component<Props, State> {

    render() {
        const {email, password, name, phone, address} = this.state || {};
        return (
            <div id="sign-up">
                <div className="splash">
                    <img className="icon" src={IconLogo} alt="icon"/>
                    <img className="text" src={TextLogo} alt="text"/>
                </div>
                <br/>
                <InputField label="Email"
                            value={email}
                            startAdornment={EmailIcon}
                            onChange={(value: string) => this.setState({email: value})}/>
                <br/>
                <InputField label="Password"
                            value={password}
                            type="password"
                            startAdornment={KeyIcon}
                            onChange={(value: string) => this.setState({password: value})}/>
                <br/>
                <InputField label="Full Name"
                            value={name}
                            startAdornment={PersonIcon}
                            onChange={(value: string) => this.setState({name: value})}/>
                <br/>
                <InputField label="Phone Number"
                            value={phone}
                            startAdornment={PhoneIcon}
                            onChange={(value: string) => this.setState({phone: value})}/>
                <br/>
                <InputField label="Address"
                            value={address}
                            startAdornment={HouseIcon}
                            onChange={(value: string) => this.setState({address: value})}/>
                <br/>

                <div className="links">
                    <Link className="back" to={LoggedOutRoutes.LOGIN}>Back</Link>
                    <CustomButton label="Sign Up" onClick={() => {}}/>
                </div>
            </div>
        );
    }
}