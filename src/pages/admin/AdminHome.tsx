import React from "react";
import {RouteComponentProps, withRouter, Redirect} from "react-router-dom";
import Splash from "../../components/Splash";
import CustomButton from "../../components/CustomButton";
import {AdminRoutes, LoggedInRoutes, LoggedOutRoutes} from "../../constants/routes";

import "../../style/pages/admin/AdminHome.css";

interface Props extends RouteComponentProps {
    logout(): void;
}

interface State {
    logout: boolean,
}

class AdminHome extends React.Component<Props, State> {

    async handleSignOut() {
        const {logout} = this.props;
        logout();
        this.setState({logout: true});
    }

    render() {
        const {history} = this.props;
        const {logout} = this.state || {};

        if (logout) {
            return <Redirect to={LoggedOutRoutes.LOGIN}/>
        }

        return (
            <div id="admin">
                <Splash/>
                <br/>
                <CustomButton label="View Data" onClick={() => history.push(AdminRoutes.VIEWDATA)}/>
                <CustomButton label="Upload New Session" onClick={() => history.push(LoggedInRoutes.TEST)}/>
                <CustomButton label="Sign Out" onClick={this.handleSignOut.bind(this)}/>
            </div>
        )
    }
}

export default withRouter(AdminHome)