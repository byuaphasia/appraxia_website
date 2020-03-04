// This article was helpful:


import Amplify, {Auth} from 'aws-amplify';
import {
    // AuthenticationDetails,
    // CognitoUserPool,
    CognitoUser,
    // CognitoUserAttribute,
    // ICognitoUserAttributeData,
    // ISignUpResult,
    // CognitoUserSession,
} from 'amazon-cognito-identity-js';



export default class Cognito {
    constructor() {
        // Configure the Amplify library with the details required to access a Cognito user pool
        Amplify.configure({
            Auth: {
                region: 'us-west-2', // Amazon Cognito Region
                userPoolId: "us-west-2_B5Jb6rdZT", // Amazon Cognito User Pool ID
                userPoolWebClientId: "4e5gg78s3bhokr219c2vbnbud7", // Amazon Cognito Web Client ID (26-char alphanumeric string)
            }
        });
    }

    /**
     * Attempt the initial login of a Cognito user. This may result in a password change
     * form being displayed if required. Once logged in, the id and access tokens will
     * be displayed.
     * @param username The Cognito username
     * @param password The Cognito password
     */
    public async signIn(username: string, password: string) : Promise<void> {
        try {
            let user = await Auth.signIn(username, password);
            this.saveTokens(user);
        } catch (err) {
            if (err.code === 'UserNotConfirmedException') {
                // The error happens if the user didn't finish the confirmation step when signing up
                // In this case you need to resend the code and confirm the user
                // About how to resend the code and confirm the user, please check the signUp part
                alert('User is not confirmed');
            } else if (err.code === 'NotAuthorizedException') {
                // The error happens when the incorrect password is provided
                alert('Incorrect password');
            } else if (err.code === 'UserNotFoundException') {
                // The error happens when the supplied username/email does not exist in the Cognito user pool
                alert('Incorrect email');
            } else {
                console.log(err);
            }
        }
    }

    public async signUp(email: string, password: string, name : string, phoneNumber: string, address: string) : Promise<void> {
        let signUpParams = {
            username: email,
            password: password,
            attributes: {
                email: email,
                name: name,
                phone_number: phoneNumber,
                address: address
            }
        };
        try {
            let user = await Auth.signUp(signUpParams);
            console.log(user);
            // {
            //     user: CognitoUser;
            //     userConfirmed: boolean;
            //     userSub: string;
            // }
        } catch (err) {
            console.log(err);
        }
    }

    public async resendConfirmationLink(email: string) : Promise<void> {
        try {
            await Auth.resendSignUp(email);
            console.log('Code resent successfully.');
        } catch (err) {
            console.log(err);
        }
    }

    public async signOut() : Promise<void> {
        await Auth.signOut();
    }

    private getTokens() : object {
        return {
            accessToken: "",
            refreshToken: ""
        }
    }

    private saveTokens(user: CognitoUser) : void {
        console.log(user.getSignInUserSession()?.getAccessToken());
    }
}
