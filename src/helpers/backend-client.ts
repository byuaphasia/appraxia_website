import Cognito from "./cognito/cognito";
import CustomFile from "../model/CustomFile";

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
        this.backendURL = process.env.REACT_APP_BACKEND || "http://localhost:8080";
    }

    private cognito: Cognito;
    private backendURL: string;

    /**
     * A health check that checks if the server is running. Not used, but can be useful for testing
     *
     * @returns A promise that resolves to "all is well" if the server is running
     */
    async healthCheck(): Promise<string> {
        return new Promise(async (resolve, reject) => {
            let response = await fetch(this.backendURL + "/healthcheck").then(r => r.json()).catch(r => reject(r));
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
                let response = await fetch(this.backendURL + "/user", {
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
                let response = await fetch(this.backendURL + "/evaluation", {
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
                let url = this.backendURL + `/evaluation/${evaluationId}/ambiance`;

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
     * Uploads an Attempt file to a given evaluation. This will not save the file, since there is no way to check
     * waivers right now. In the future if that becomes available, change the query parameter "save" to be true
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
                let url = this.backendURL + `/evaluation/${evaluationId}/attempt?syllableCount=${recordingFile.syllableCount}&word=${recordingFile.word}&save=false`;

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
                let url = this.backendURL + `/evaluation/${evaluationId}/attempts`;

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

    /**
     * Downloads exported data from the backend
     *
     * @param startDate a string form of the start date: e.g. "YYYY-MM-DD"
     * @param endDate   a string form of the end date: e.g. "YYYY-MM-DD"
     * @param includeRecordings a boolean that determines whether you just download the .csv table, or a zip with the
     *                          .csv and a folder of recordings
     *
     * @returns A promise that resolves if there were no errors in the request or downloading
     */
    async downloadExportedData(startDate: string, endDate: string, includeRecordings: boolean): Promise<string> {
        return new Promise(async (resolve, reject) => {
            if (await this.cognito.isLoggedIn()) {
                await fetch(this.backendURL + "/export", {
                    method: "POST",
                    body: JSON.stringify({startDate, endDate, includeRecordings}),
                    headers: {
                        "TOKEN": await this.cognito.getJWT(),
                        "Content-Type": "application/json",
                    }
                }).then((response) => response.blob()).then((blob) => {
                    const url = window.URL.createObjectURL(new Blob([blob]));
                    const link = document.createElement('a');
                    link.href = url;

                    let fileType;

                    if(includeRecordings) {
                        fileType = ".zip"
                    } else {
                        fileType = ".csv"
                    }

                    let fileName = startDate + "-to-" + endDate + fileType;
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }).catch(r => reject(r));

                resolve();
            }
            else {
                reject("Not Logged In");
            }
        })
    }
}