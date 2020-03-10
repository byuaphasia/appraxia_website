import React from "react";

import "../style/components/CustomButton.css";

interface Props {
    label: string;
    onClick(): void;
}

export default class CustomButton extends React.Component<Props, {}> {
    render() {
        const {label, onClick} = this.props;
        return <button className="custom-button" onClick={onClick}>{label}</button>
    }
}