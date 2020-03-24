import React from "react";

const CognitoContext = React.createContext({});

export function withCognito(Component) {
  return props =>
    <CognitoContext.Consumer>
      {cognito => <Component cognito={cognito} {...props}/>}
    </CognitoContext.Consumer>
}

export default CognitoContext;