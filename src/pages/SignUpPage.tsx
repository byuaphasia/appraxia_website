import React from 'react';
import {Link} from "react-router-dom";
import IconLogo from '../assets/img/Icon Logo.png';
import TextLogo from '../assets/img/Text Logo.png';
import {
    Email as EmailIcon,
    House as HouseIcon,
    Phone as PhoneIcon,
    Person as PersonIcon,
    VPNKey as KeyIcon
} from '../assets/icon';
import {TextField, Icon} from "@material-ui/core";
import CustomButton from "../components/CustomButton";
import Errors from "../components/Errors";
import {LoggedOutRoutes} from "../constants/routes";
import {withCognito} from "../helpers/cognito/CognitoContext";
import Cognito from "../helpers/cognito/cognito";
import {isValidEmail} from "../helpers/functions";

import "../style/pages/SignUpPage.css";

interface Props {
    email?: string,
    password?: string,
    cognito: Cognito,
}

interface State {
    email: string,
    password: string,
    name: string,
    phone: string,
    address: string,
    errors: string[],
    showErrors: boolean;
}

class SignUpPage extends React.Component<Props, State> {

    async handleSignUp() {
        const {email, password, name, phone, address} = this.state || {};
        const {cognito} = this.props;

        let errors: string[] = [];

        if (!isValidEmail(email)) {
            errors.push("Not a Valid Email");
            this.setState({errors, showErrors: true})
        }

        if (errors.length === 0) {
            await cognito.signUp(email, password, name, phone, address).catch(reason => errors.push(reason));
        }

        this.setState({errors, showErrors: true});
    }

    render() {
        const {email, password, name, phone, address, errors = [], showErrors} = this.state || {};
        return (
            <div id="sign-up">
                <div className="splash">
                    <img className="icon" src={IconLogo} alt="icon"/>
                    <img className="text" src={TextLogo} alt="text"/>
                </div>
                <br/>
                <TextField label="Email"
                           value={email}
                           InputProps={{
                               startAdornment: <Icon><img src={EmailIcon} alt="email_icon"/></Icon>
                           }}
                           onChange={e => this.setState({email: e.target.value})}/>
                <br/>
                <TextField label="Password"
                           value={password}
                           type="password"
                           InputProps={{
                               startAdornment: <Icon><img src={KeyIcon} alt="key_icon"/></Icon>
                           }}
                           onChange={e => this.setState({password: e.target.value})}/>
                <br/>
                <TextField label="Full Name"
                           value={name}
                           InputProps={{
                               startAdornment: <Icon><img src={PersonIcon} alt="person_icon"/></Icon>
                           }}
                           onChange={e => this.setState({name: e.target.value})}/>
                <br/>
                <TextField label="Phone Number"
                           value={phone}
                           InputProps={{
                               startAdornment: <Icon><img src={PhoneIcon} alt="phone_icon"/></Icon>
                           }}
                           onChange={e => this.setState({phone: e.target.value})}/>
                <br/>
                <TextField label="Address"
                           value={address}
                           InputProps={{
                               startAdornment: <Icon><img src={HouseIcon} alt="house_icon"/></Icon>
                           }}
                           onChange={e => this.setState({address: e.target.value})}/>
                <br/>

                <Errors errors={errors} show={showErrors} onClose={() => this.setState({showErrors: false})}/>

                <div className="links">
                    <Link className="back" to={LoggedOutRoutes.LOGIN}>Back</Link>
                    <CustomButton label="Sign Up" onClick={this.handleSignUp.bind(this)}/>
                </div>
            </div>
        );
    }
}

export default withCognito(SignUpPage);