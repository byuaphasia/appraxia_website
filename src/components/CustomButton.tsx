import React from "react";

import "../style/components/CustomButton.css";

export interface CustomButtonProps {
    disabled?: boolean;
    type?: "button" | "submit";
    label: string;
    onClick(): void;
}

export default class CustomButton extends React.Component<CustomButtonProps, {}> {
    render() {
        const {label, type, onClick, disabled = false} = this.props;
        return <button className="custom-button"
                       type={type || "button"}
                       disabled={disabled}
                       onClick={onClick}
        >{label}</button>
    }
}