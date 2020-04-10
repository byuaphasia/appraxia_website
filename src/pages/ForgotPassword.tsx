import React from 'react';
import {
    VPNKey as KeyIcon
} from '../assets/icon';
import {TextField, Icon} from "@material-ui/core";
import CustomButton from "../components/CustomButton";
import Errors from "../components/Errors";
import {withCognito} from "../helpers/cognito/CognitoContext";
import Cognito from "../helpers/cognito/cognito";

import "../style/pages/ForgotPassword.css";

interface Props {
    email: string,
    onClose(): any,
    cognito: Cognito,
}

interface State {
    verificationCode: string,
    password: string,
    confirmPassword: string,
    errors: string[],
    showErrors: boolean;
}

class ForgotPassword extends React.Component<Props, State> {

    async handleSubmit() {
        const {verificationCode, password, confirmPassword} = this.state || {};
        const {email, cognito} = this.props;
        let errors: string[] = [];

        if (password !== confirmPassword) {
            errors.push("Passwords do not match");
            this.setState({errors, showErrors: true});
            return;
        }

        await cognito.confirmNewPassword(email, verificationCode, confirmPassword).catch(reason => {
            errors.push(reason);
            this.setState({errors, showErrors: true});
        });
    }

    render() {
        const {verificationCode, password, confirmPassword, errors = [], showErrors} = this.state || {};
        const {onClose} = this.props;
        return (
            <div id="forgot-password">
                <TextField label="Verification Code"
                           value={verificationCode}
                           onChange={e => this.setState({verificationCode: e.target.value})}/>
                <br/>
                <TextField label="New Password"
                           value={password}
                           type="password"
                           InputProps={{
                               startAdornment: <Icon><img src={KeyIcon} alt="key_icon"/></Icon>
                           }}
                           onChange={e => this.setState({password: e.target.value})}/>
                <br/>
                <TextField label="Confirm Password"
                           value={confirmPassword}
                           type="password"
                           InputProps={{
                               startAdornment: <Icon><img src={KeyIcon} alt="person_icon"/></Icon>
                           }}
                           onChange={e => this.setState({confirmPassword: e.target.value})}/>
                <br/>

                <Errors errors={errors} show={showErrors} onClose={() => this.setState({showErrors: false})}/>

                <div className="buttons">
                    <CustomButton label="Cancel" onClick={onClose}/>
                    <CustomButton label="Confirm" onClick={this.handleSubmit.bind(this)}/>
                </div>
            </div>
        );
    }
}

export default withCognito(ForgotPassword);