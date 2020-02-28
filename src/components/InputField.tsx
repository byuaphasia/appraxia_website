import React from 'react';

interface Props {
    type?: string;
    label?: string;
    startAdornment?: any;
    value: string;
    onChange(value: string): void;
}

export default class InputField extends React.Component<Props, {}> {
    render() {
        const {type, label, startAdornment} = this.props;
        return <div className="input-field">
            {startAdornment && <span className="start">
              <img src={startAdornment} alt="start"/>
            </span>}
            <div className="group">
                <input type={type ? type : 'text'} required/>
                <span className="highlight"/>
                <span className="bar"/>
                <label>{label}</label>
            </div>
        </div>
    }
}