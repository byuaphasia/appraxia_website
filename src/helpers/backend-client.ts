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
    async healthCheck() {
        fetch("/api/healthcheck")
            .then(res => res.json())
            .then(result => console.log(result));
    }
}