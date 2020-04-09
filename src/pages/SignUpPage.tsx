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
import InputField from "../components/InputField";
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
                <InputField label="Email"
                            value={email}
                            startAdornment={EmailIcon}
                            onChange={value => this.setState({email: value})}/>
                <br/>
                <InputField label="Password"
                            value={password}
                            type="password"
                            startAdornment={KeyIcon}
                            onChange={value => this.setState({password: value})}/>
                <br/>
                <InputField label="Full Name"
                            value={name}
                            startAdornment={PersonIcon}
                            onChange={value => this.setState({name: value})}/>
                <br/>
                <InputField label="Phone Number"
                            value={phone}
                            startAdornment={PhoneIcon}
                            onChange={value => this.setState({phone: value})}/>
                <br/>
                <InputField label="Address"
                            value={address}
                            startAdornment={HouseIcon}
                            onChange={value => this.setState({address: value})}/>
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