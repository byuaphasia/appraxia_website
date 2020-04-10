import Cognito from "./cognito/cognito";
import CustomFile from "../model/CustomFile";

export interface Evaluation {
    evaluationId: string,
    age: string,
    gender: string,
    impression: string,
    dateCreated: string,
}

export interface Attempt {
    attemptId: string,
    evaluationId: string,
    word: string,
    duration: number,
    dateCreated: string,
    active: boolean,
    syllableCount: number,
    wsd: number
}

export interface AttemptReturn {
    attemptId: string,
    wsd: string
}

export interface EvaluationReturn {
    evaluationId: string,
}

export default class BackendClient {
    constructor() {
        this.cognito = new Cognito();
    }

    private cognito: Cognito;

    async healthCheck(): Promise<string> {
        return new Promise(async (resolve, reject) => {
            let response = await fetch("/api/healthcheck").then(r => r.json()).catch(r => reject(r));
            response ? resolve(response["message"]) : reject("Response Error in /healthcheck");
        });
    }

    /**
     * Gets the user type of the currently logged in User
     *
     * @returns a Promise that resolves to either "user" or "admin" if there is a currently logged in user
     */
    async getUserType(): Promise<"user" | "admin"> {
        return new Promise(async (resolve, reject) => {
            if (await this.cognito.isLoggedIn()) {
                let response = await fetch("/api/user", {
                    headers: {
                        "TOKEN": await this.cognito.getJWT(),
                    }
                }).then(r => r.json()).catch(r => reject(r));

                response ? resolve(response["userType"] as "user" | "admin")
                    : reject("Response Error in /user");
            }
            else {
                reject("Not Logged In");
            }
        });
    }

    /**
     * Creates a new Evaluation
     *
     * @param age   The age formatted as a string: e.g. "40" or "no answer"
     * @param gender    The gender, either "Male", "Female", or "no answer"
     * @param impression    A comma delimited list of impressions: e.g. "apraxia,aphasia"
     *
     * @returns a Promise that resolves to an evaluation id
     */
    async createEvaluation(age: string, gender: string, impression: string): Promise<EvaluationReturn> {
        return new Promise(async (resolve, reject) => {
            if (await this.cognito.isLoggedIn()) {
                let response = await fetch("/api/evaluation", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "TOKEN": await this.cognito.getJWT(),
                    },
                    body: JSON.stringify({age, gender, impression}),
                }).then(r => r.json()).catch(r => reject(r));

                response ? resolve(response as EvaluationReturn)
                    : reject("Response Error in /evaluation");
            }
        })
    }

    /**
     * Uploads an Ambiance file to a given evaluation
     *
     * @param evaluationId  An evaluation to upload to
     * @param ambianceFile  The ambiance file to upload. Must be a .wav file
     *
     * @returns a Promise that resolves if the upload is successful
     */
    async uploadAmbianceFile(evaluationId: string, ambianceFile: any) {
        return new Promise(async (resolve, reject) => {
            if (await this.cognito.isLoggedIn()) {
                let body = new FormData();
                body.append("recording", ambianceFile);
                let url = `/api/evaluation/${evaluationId}/ambiance`;

                let response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "TOKEN": await this.cognito.getJWT(),
                    },
                    body: body,
                }).then(r => r.json()).catch(r => reject(r));

                response ? resolve(response)
                    : reject(`Response Error in ${url}`);
            }
        })
    }

    /**
     * Uploads an Attempt file to a given evaluation
     *
     * @param recordingFile The CustomFile that holds the recording information
     * @param evaluationId  The id of the evaluation
     *
     * @returns a Promise that resolves to an AttemptReturn if successful
     */
    async addAttempt(recordingFile: CustomFile, evaluationId: string): Promise<AttemptReturn> {
        return new Promise(async (resolve, reject) => {
            if (await this.cognito.isLoggedIn()) {
                let body = new FormData();
                body.append("recording", recordingFile.file);
                let url = `/api/evaluation/${evaluationId}/attempt?syllableCount=${recordingFile.syllableCount}&word=${recordingFile.word}`;

                let response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "TOKEN": await this.cognito.getJWT(),
                    },
                    body: body
                }).then(r => r.json()).catch(r => reject(r));

                response ? resolve(response as AttemptReturn)
                    : reject(`Response Error in ${url}`);
            }
        });
    }

    /**
     * Gets the attempts for a particular evaluation
     *
     * @param evaluationId  The id of the evaluation
     *
     * @returns a Promise that resolves to a list of Attempts
     */
    async getAttempts(evaluationId: string): Promise<Attempt[]> {
        return new Promise(async (resolve, reject) => {
            if (await this.cognito.isLoggedIn()) {
                let url = `/api/evaluation/${evaluationId}/attempts`;

                let response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "TOKEN": await this.cognito.getJWT(),
                    }
                }).then(r => r.json()).catch(r => reject(r));

                response ? resolve(response["attempts"] as Attempt[])
                    : reject(`Response Error in ${url}`);
            }
        })
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