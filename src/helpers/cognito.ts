// This article was helpful: https://aws-amplify.github.io/docs/js/authentication

import UserAttributes from '../model/UserAttributes';
import Amplify, {Auth} from 'aws-amplify';
import {
    CognitoUser,
    CognitoUserAttribute,
    CognitoUserSession,
} from 'amazon-cognito-identity-js';

export default class Cognito {
    constructor() {
        // Configure the Amplify library with the details required to access a Cognito user pool
        Amplify.configure({
            Auth: {
                region: 'us-west-2',
                userPoolId: "us-west-2_B5Jb6rdZT",
                userPoolWebClientId: "4e5gg78s3bhokr219c2vbnbud7",
            }
        });
    }

    /**
     * Attempt to fetch the JWT token for the current user's session. If successful,
     * returns a Promise that resolves with a value of the JWT token. If it fails, the
     * Promise rejects with an appropriate error message.
     *
     * @returns Promise<string> - A promise that resolves on success and rejects a string on failure
     */
    public async getJWT() : Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                let session : CognitoUserSession = await Auth.currentSession();
                resolve(session.getAccessToken().getJwtToken());
            } catch (err) {
                reject(err.message);
            }
        });
    }

    /**
     * Attempt to check whether or not the session is currently logged in. If successful, returns
     * a Promise that resolves to a boolean value corresponding to whether or not the user is logged
     * in and is in a valid session. If it fails, the Promise rejects with an appropriate error message.
     *
     * @returns Promise<boolean> - A promise that resolves on success and rejects a string on failure
     */
    public async isLoggedIn() : Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                let session : CognitoUserSession = await Auth.currentSession();
                if (session !== null && session.isValid()) {
                    resolve(true);
                }
                resolve(false);
            } catch (err) {
                reject(err.message);
            }
        });
    }

    /**
     * Attempt the initial login of a Cognito user. If successful, the AWS SDK will store
     * credentials in cookies and this will return a promise that resolves. Otherwise, it
     * will result in one of three error states and return a promise that rejects with an
     * error message:
     *
     *  1. The user is registered, but is not confirmed. The user should have received
     *      an email with a link to confirm their account. If this is the case, we should
     *      provide some way for them to resend the confirmation email. This can be done
     *      by calling the resendConfirmationLink() function on the Cognito object and
     *      passing the account email as a parameter.
     *  2. The user entered the incorrect password. We should alert them of that.
     *  3. The user entered an email for which no account is registered. We should alert
     *      them of that.
     *
     * @param username: string - The account email
     * @param password: string - The account password
     * @returns Promise - A promise that resolves on success and rejects a string on failure
     */
    public async signIn(username: string, password: string) : Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await Auth.signIn(username, password);
                resolve();
            } catch (err) {
                if (err.code === 'UserNotConfirmedException') {
                    reject('User is not confirmed');
                } else if (err.code === 'NotAuthorizedException') {
                    reject('Incorrect password');
                } else if (err.code === 'UserNotFoundException') {
                    reject('Incorrect email');
                } else {
                    reject(err.message);
                }
            }
        });
    }

    /**
     * Attempt the initial register of a Cognito user. If successful, this will result in a
     * Promise that resolves. If not, it will reject with an appropriate error message. It is
     * expected that the user will need to confirm their account, so prompt to do that upon a
     * successful completion and take them to the sign in page to sign in after they have
     * confirmed their account.
     *
     * @param email: string - The account email
     * @param password: string - The account password formatted to the following specifications:
     *      - Minimum length of 8 characters
     *      - Contains one or more uppercase letters
     *      - Contains one or more lowercase letters
     *      - Contains one or more numbers
     * @param name: string - The name of the user
     * @param phoneNumber: string - The phone number of the user formatted to the following specifications:
     *      - [Country code][Full phone number with only numeric characters]
     *      - i.e. +18018503445
     * @param address: string - The user's address
     *
     * @returns Promise - A promise that resolves on success and rejects a string on failure
     */
    public async signUp(email: string, password: string, name : string, phoneNumber: string, address: string) : Promise<void> {
        return new Promise(async (resolve, reject) => {
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
                await Auth.signUp(signUpParams);
                resolve();
            } catch (err) {
                reject(err.message);
            }
        });
    }

    /**
     * Attempt to resend a confirmation link to the account email. If successful, returns
     * a Promise that resolves and an email is sent with a link to confirm their account. If it
     * fails, the Promise rejects with an appropriate error message.
     *
     * @param email: string - The account email
     *
     * @returns Promise - A promise that resolves on success and rejects a string on failure
     */
    public async resendConfirmationLink(email: string) : Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await Auth.resendSignUp(email);
                resolve();
            } catch (err) {
                reject(err.message);
            }
        });
    }

    /**
     * Attempt to sign the user out of their current session. If successful, returns a Promise
     * that resolves. If it fails, the Promise rejects with an appropriate error message.
     *
     * @returns Promise - A promise that resolves on success and rejects a string on failure
     */
    public async signOut() : Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await Auth.signOut();
                resolve();
            } catch (err) {
                reject(err.message);
            }
        });
    }

    /**
     * Attempt to get the attributes belonging to the current user. If successful, returns a
     * Promise that resolves to a UserAttributes object. If it fails, the Promise rejects with
     * an appropriate error message.
     *
     * @returns Promise<UserAttributes> - A Promise that resolves on success and rejects a string
     *      on failure
     */
    public async getUserAttributes() : Promise<UserAttributes> {
        return new Promise(async (resolve, reject) => {
            try {
                let user : CognitoUser = await Auth.currentAuthenticatedUser();
                user.getUserAttributes((err, result) => {
                    if (err) {
                        reject(err.message);
                    } else if (result) {
                        let userAttributes : UserAttributes = new UserAttributes();
                        for (let attribute of result) {
                            if (attribute.getName() === "name") {
                                userAttributes.name = attribute.getValue();
                            }
                            else if (attribute.getName() === "email") {
                                userAttributes.email = attribute.getValue();
                            }
                            else if (attribute.getName() === "address") {
                                userAttributes.address = attribute.getValue();
                            }
                            else if (attribute.getName() === "phone_number") {
                                userAttributes.phoneNumber = attribute.getValue();
                            }
                        }
                        resolve(userAttributes);
                    } else {
                        reject('No attributes available');
                    }
                });
            } catch (err) {
                reject(err.message);
            }
        });
    }

    /**
     * Attempt to update the attributes belonging to the current user. If successful, returns a
     * Promise that resolves. If it fails, the Promise rejects with an appropriate error message.
     *
     * @param attributes : UserAttributes - The new attributes for the account user
     *
     * @returns Promise - A Promise that resolves on success and rejects a string on failure
     */
    public async updateUserAttributes(attributes : UserAttributes) : Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                let user : CognitoUser = await Auth.currentAuthenticatedUser();
                let cognitoAttributes : CognitoUserAttribute[] = [];
                cognitoAttributes.push(new CognitoUserAttribute({Name: "name", Value: attributes.name}));
                cognitoAttributes.push(new CognitoUserAttribute({Name: "email", Value: attributes.email}));
                cognitoAttributes.push(new CognitoUserAttribute({Name: "address", Value: attributes.address}));
                cognitoAttributes.push(new CognitoUserAttribute({Name: "phone_number", Value: attributes.phoneNumber}));
                await Auth.updateUserAttributes(user, cognitoAttributes);
                resolve();
            } catch (err) {
                reject(err.message);
            }

        });
    }

    /**
     * Attempt to send the email containing a verification code to update the account password.
     * If successful, returns a Promise that resolves. If it fails, the Promise rejects with an
     * appropriate error message.
     *
     * @param email : string - The email for the account
     *
     * @returns Promise - A Promise that resolves on success and rejects a string on failure
     */
    public async sendForgotPassword(email : string) : Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await Auth.forgotPassword(email);
                resolve();
            } catch (err) {
                reject(err.message);
            }
        });
    }

    /**
     * Attempt to change the account password with a provided verification code. If successful,
     * returns a Promise that resolves. If it fails, the Promise rejects with an appropriate error
     * message.
     *
     * @param email : string - The email for the account
     * @param verificationCode : string - The verification code contained in the email sent to the user
     * @param newPassword : string - The new password to access the account
     *
     * @returns Promise - A Promise that resolves on success and rejects a string on failure
     */
    public async confirmNewPassword(email: string, verificationCode : string, newPassword : string) : Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await Auth.forgotPasswordSubmit(email, verificationCode, newPassword);
                resolve();
            } catch (err) {
                reject(err.message);
            }
        });
    }
}
