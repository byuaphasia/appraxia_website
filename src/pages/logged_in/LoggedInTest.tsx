import React from "react";
import {Redirect} from "react-router-dom";
import Splash from "../../components/Splash";
import CustomButton from "../../components/CustomButton";
import {LoggedInRoutes} from "../../constants/routes";

import "../../style/pages/logged_in/LoggedInHome.css";

interface Props {
}

interface State {
    back: boolean,
}

class LoggedInTest extends React.Component<Props, State> {
    render() {
        const {back} = this.state || {};

        if (back) {
            return <Redirect to={LoggedInRoutes.HOME}/>
        }

        return (
            <div id="logged-in">
                <Splash/>
                <br/>
                <p>Here's where you would upload a test</p>
                <CustomButton label="Back" onClick={async () => {
                    this.setState({back: true})
                }}/>
            </div>
        )
    }
}

export default LoggedInTest