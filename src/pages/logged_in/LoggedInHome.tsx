import React from "react";
import {RouteComponentProps, withRouter, Redirect} from "react-router-dom";
import Splash from "../../components/Splash";
import CustomButton from "../../components/CustomButton";
import {LoggedInRoutes, LoggedOutRoutes} from "../../constants/routes";

import "../../style/pages/logged_in/LoggedInHome.css";
import {withCognito} from "../../helpers/cognito/CognitoContext";
import Cognito from "../../helpers/cognito/cognito";

interface Props extends RouteComponentProps {
    cognito: Cognito
    setIsLoggedIn(): void
}

interface State {
    logout: boolean,
}

class LoggedInHome extends React.Component<Props, State> {

    async handleSignOut() {
        const {cognito, setIsLoggedIn} = this.props;
        await cognito.signOut();
        setIsLoggedIn();
        this.setState({logout: true});
    }

    render() {
        const {history} = this.props;
        const {logout} = this.state || {};

        if (logout) {
            return <Redirect to={LoggedOutRoutes.LOGIN}/>
        }

        return (
            <div id="logged-in">
                <Splash/>
                <br/>
                <CustomButton label="Upload New Session" onClick={() => history.push(LoggedInRoutes.TEST)}/>
                <CustomButton label="Sign Out" onClick={this.handleSignOut.bind(this)}/>
            </div>
        )
    }
}

export default withCognito(withRouter(LoggedInHome))