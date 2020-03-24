import React from "react";

import "../style/components/CustomButton.css";

export interface CustomButtonProps {
    disabled?: boolean;
    label: string;
    onClick(): void;
}

export default class CustomButton extends React.Component<CustomButtonProps, {}> {
    render() {
        const {label, onClick, disabled = false} = this.props;
        return <button className="custom-button"
                       disabled={disabled}
                       onClick={onClick}
        >{label}</button>
    }
}