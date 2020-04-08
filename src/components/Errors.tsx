import React from "react";

import "../style/components/Errors.css";

interface Props {
    errors: string[];
    show: boolean;
    onClose(): any;
}

export default class Errors extends React.Component<Props, {}> {
    render() {
        const {errors, show, onClose} = this.props;
        if (show) {
            return (
                <div className="errors">
                    {errors.map((error, i) => <div key={i} className="error">{error}</div>)}
                    <span className="close" onClick={onClose}>&times;</span>
                </div>
            )
        }
        else {
            return <></>;
        }
    }
}