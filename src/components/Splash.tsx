import React from 'react';
import IconLogo from "../assets/img/Icon Logo.png";
import TextLogo from "../assets/img/Text Logo.png";

import "../style/components/Splash.css"

export default function Splash() {
    return (
        <div className="splash">
            <img className="icon" src={IconLogo} alt="icon"/>
            <img className="text" src={TextLogo} alt="text"/>
        </div>
    )
}