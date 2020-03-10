import React from 'react';
import Splash from "../../components/Splash";

interface State {

}

export default class AdminTable extends React.Component<{}, State> {
    componentDidMount(): void {

    }

    render() {
        return (
            <div id="admin">
                <Splash/>
                <br/>

            </div>
        );
    }
}