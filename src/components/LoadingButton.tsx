import React from "react";
import CustomButton, {CustomButtonProps} from "./CustomButton";

interface LoadingButtonProps extends CustomButtonProps {
    loadingMsg?: string;
    onClick(): Promise<any> | void;
}

interface State {
    loading: boolean;
}

export default class LoadingButton extends React.Component<LoadingButtonProps, State> {
    async onClick() {
        const {onClick} = this.props;
        try {
            this.setState({loading: true});
            const result = onClick();
            if (result instanceof Promise) {
                await result;
            }
        }
        finally {
            this.setState({loading: false});
        }
    }

    render() {
        const {disabled = false, loadingMsg, label} = this.props;
        const {loading} = this.state || {};
        const loadingMessage = loadingMsg || "Processing...";

        return <CustomButton label={loading ? loadingMessage : label}
                             onClick={this.onClick.bind(this)}
                             disabled={disabled || loading}/>
    }
}