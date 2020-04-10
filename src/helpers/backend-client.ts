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
                resolve(response["userType"]);
            }
            else {
                reject("Not Logged In");
            }
        });
    }

    async getExportedData(startDate: string, endDate: string, includeRecordings: boolean): Promise<string> {
        return new Promise(async (resolve, reject) => {
            if (await this.cognito.isLoggedIn()) {
                let response = await fetch("/api/export", {
                    method: "POST",
                    body: JSON.stringify({startDate, endDate, includeRecordings}),
                    headers: {
                        "TOKEN": await this.cognito.getJWT(),
                        "Content-Type": "application/json",
                    }
                })
                .then((response) => response.blob())
                .then((blob) => {
                    const url = window.URL.createObjectURL(new Blob([blob]));
                    const link = document.createElement('a');
                    link.href = url;

                    var fileType;

                    if(includeRecordings) {
                        fileType = ".zip"
                    } else {
                        fileType = ".csv"
                    }

                    var fileName = startDate + "-to-" + endDate + fileType;
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
                .catch(r => reject(r));
            }
            else {
                reject("Not Logged In");
            }
        })
    }
}