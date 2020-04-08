import Cognito from "./cognito/cognito";

export interface Evaluation {
    id: string,
    age: string,
    gender: string,
    impression: string,
    owner_id: string,
    ambiance_threshold: number,
    date_created: string,
}

export interface Attempt {
    id: string,
    evaluation_id: string,
    word: string,
    duration: number,
    date_created: string,
    active: boolean,
    syllable_count: number
}

export default class BackendClient {
    constructor() {
        this.cognito = new Cognito();
    }

    private cognito: Cognito;

    async healthCheck(): Promise<string> {
        return new Promise(async (resolve, reject) => {
            let response = await fetch("/api/healthcheck").then(r => r.json()).catch(r => reject(r));
            resolve(response["message"]);
        });
    }

    async getUserType(): Promise<string> {
        return new Promise(async (resolve, reject) => {
            if (await this.cognito.isLoggedIn()) {
                let response = await fetch("/api/user", {
                    headers: {
                        "TOKEN": await this.cognito.getJWT(),
                    }
                }).then(r => r.json()).catch(r => reject(r));
                resolve(response["message"]);
            }
            else {
                reject("Not Logged In");
            }
        });
    }
}