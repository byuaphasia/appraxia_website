export default class CustomFile {
    //For uploading the file and displaying it
    public URL: string;
    public progress: number;
    public isLoading: boolean;
    public file: any;

    //For sending the file to the backend
    public word: string;
    public syllableCount: number;

    constructor(file: File) {
        this.URL = "";
        this.progress = 0;
        this.isLoading = false;
        this.file = file;

        this.word = "";
        this.syllableCount = 0;
    }
}