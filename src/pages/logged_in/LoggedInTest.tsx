import React from "react";
import {Redirect} from "react-router-dom";
import SwipeableViews from 'react-swipeable-views';
import Dropzone from "react-dropzone";

import Splash from "../../components/Splash";
import CustomButton from "../../components/CustomButton";
import {LoggedInRoutes} from "../../constants/routes";
import InputField from "../../components/InputField";
import CustomFile from "../../model/CustomFile";

import "../../style/pages/logged_in/LoggedInTest.css";
import Spinner from "../../components/Spinner";
import BackendClient, {Attempt} from "../../helpers/backend-client";


interface Props {
}

interface State {
    back: boolean
    page: number
    files: CustomFile[]
    ambianceFile: any,
    evalAge: number,
    evalGender: string,
    evalImpression: string,
    reportProgress: number
    loadingReport: boolean
    report: Attempt[]
}

class LoggedInTest extends React.Component<Props, State> {
    private readonly backendClient: BackendClient;

    constructor(props: Props) {
        super(props);
        this.backendClient = new BackendClient();
    }

    componentDidMount(): void {
        this.setState({
            page: 0,
            evalAge: 0,
            evalGender: "",
            evalImpression: "",
            reportProgress: 0,
            loadingReport: false
        });
    }

    async loadFiles(files: any[]) {
        const newFiles: CustomFile[] = files.map(file => new CustomFile(file));
        this.setState({files: newFiles});

        newFiles.forEach((file, index) => {
            const reader = new FileReader();

            reader.onprogress = (event: ProgressEvent) => {
                this.setFileAttribute(file.file.path, "progress", event.loaded / event.total);
            };

            reader.onloadend = () => {
                this.setFileAttribute(file.file.path, "URL", reader.result as string);
                this.setFileAttribute(file.file.path, "progress", 1);
                this.setFileAttribute(file.file.path, "isLoading", false);
            };

            this.setFileAttribute(file.file.path, "isLoading", true);
            reader.readAsDataURL(files[index]);
        });
    }

    setFileAttribute(filePath: string, attributeName: string, value: any) {
        this.setState(prevState => ({
            files: prevState.files.map(file => {
                return file.file.path === filePath ? {...file, [attributeName]: value} : file;
            })
        }));
    }

    async loadReport() {
        const {files, ambianceFile, evalAge, evalGender, evalImpression} = this.state || {};
        let reportProgress = 0;
        const reportProgressMax = files.length + 3; // evaluation, ambiance, all of the files, then getting the attempts back
        const updateProgress = () => {
            reportProgress++;
            this.setState({reportProgress: reportProgress / reportProgressMax});
        };

        this.setState({loadingReport: true});

        // 1) Create the evaluation
        const {evaluationId} = await this.backendClient.createEvaluation(evalAge.toString(), evalGender, evalImpression);
        updateProgress();

        // 2) Upload the ambiance file
        await this.backendClient.uploadAmbianceFile(evaluationId, ambianceFile);
        updateProgress();

        // 3) Upload the files as attempts
        for (let i = 0; i < files.length; i++) {
            const {attemptId, wsd} = await this.backendClient.addAttempt(files[i], evaluationId);
            console.log({word: files[i].word, attemptId, wsd});
            updateProgress();
        }

        // 4) Get the attempts from the backend
        const report: Attempt[] = await this.backendClient.getAttempts(evaluationId);
        this.setState({report});
        updateProgress();
    }

    getAverageWSD(): number {
        const {report} = this.state;
        let runningTotal: number = 0;

        for (let i = 0; i < report.length; i++) {
            runningTotal += report[i].wsd;
        }

        return runningTotal / report.length;
    }

    isNextButtonEnabled(): boolean {
        const {page, evalAge, evalGender, evalImpression, ambianceFile, files} = this.state || {};
        switch(page) {
            case 0:
                return evalAge > 0 && evalGender.length > 0 && evalImpression.length > 0;
            case 1:
                return ambianceFile && files && files.length > 0;
            default:
                return (files && files.length > 0) ? (files[page - 2].syllableCount > 0 && !!files[page - 2].word && files[page - 2].word.length > 0) : false;
        }
    }

    getPageCount() {
        const {files} = this.state || {};
        return files ? files.length + 2 : 2
    }

    render() {
        const {back, page = 0,
            files, ambianceFile,
            evalAge, evalGender, evalImpression,
            loadingReport, reportProgress, report} = this.state || {};

        if (back) {
            return <Redirect to={LoggedInRoutes.HOME}/>
        }

        const acceptedFiles = files && files.map(file => (
            <li key={file.file.path}>
                {file.file.path}
            </li>
        ));

        if (loadingReport && reportProgress < 1) {
            return <div id="logged-in" className="test">
                <Splash/>
                <br/>
                <div className="loading">Loading Report...</div>
                <Spinner/>
            </div>;
        }

        if(loadingReport) {
            return <div id="logged-in" className="test">
                <Splash/>
                <br/>
                <div className="report">
                    <div className="header">Results:</div>
                    {report.map(attempt =>
                        <div className="attempt">
                            <div className="word">{attempt.word}</div>
                            <div className="wsd">{attempt.wsd}</div>
                        </div>)}
                    <div className="total">
                        <div className="header">Average WSD</div>
                        <div className="content">{this.getAverageWSD().toFixed(2)}</div>
                    </div>
                </div>
                <div className="buttons one">
                    <CustomButton label={"Done"} onClick={() => this.setState({back: true})}/>
                </div>
            </div>
        }

        return (
            <div id="logged-in" className="test">
                <Splash/>
                <br/>
                <SwipeableViews index={page}>
                    <div className="page">
                        <div className="header">Patient Information</div>
                        <div className="content">
                            <InputField label="Age" type="number" value={evalAge} onChange={(value: number) => this.setState({evalAge: value})}/>
                            <InputField label="Gender" value={evalGender} onChange={(value: string) => this.setState({evalGender: value})}/>
                            <InputField label="Impression" value={evalImpression} onChange={(value: string) => this.setState({evalImpression: value})}/>
                        </div>
                    </div>
                    <div className="page">
                        <div className="header">Ambiance Recording</div>
                        <Dropzone accept={".wav"}
                                  onDrop={acceptedFiles => this.setState({ambianceFile: acceptedFiles[0]})}>
                            {({getRootProps, getInputProps}) => (
                                <section className="dropzone-container">
                                    <div {...getRootProps({className: "dropzone"})}>
                                        <input {...getInputProps()}/>
                                        <p>Drag and Drop here, or click to select files</p>
                                    </div>
                                    {ambianceFile && <div className="dropzone-file">File Name: {ambianceFile.path}</div>}
                                </section>
                            )}
                        </Dropzone>
                        <br/>
                        <div className="header">Word Recordings</div>
                        <Dropzone accept={".wav"}
                            onDrop={acceptedFiles => this.loadFiles(acceptedFiles)}>
                            {({getRootProps, getInputProps}) => (
                                <section className="dropzone-container">
                                    <div {...getRootProps({className: "dropzone"})}>
                                        <input {...getInputProps()}/>
                                        <p>Drag and Drop here, or click to select files</p>
                                    </div>
                                    {acceptedFiles && <div className="dropzone-files">
                                        <div className="header">Word Files:</div>
                                        <ul>{acceptedFiles}</ul>
                                    </div>}
                                </section>
                            )}
                        </Dropzone>
                    </div>
                    {files && files.map((file, i) => {
                        return <div key={`${i}-${file.file.path}`} className="page">
                            <div className="header">{file.file.path}</div>
                            {file.isLoading ? <p>{(file.progress * 100).toFixed(2) + "%"}</p> :
                                <audio id="audio-element" src={file.URL} controls>
                                    Your browser does not support the
                                    <code>audio</code> element.
                                </audio>}
                                <InputField label="Word" value={file.word} onChange={(value: string) => {
                                    this.setFileAttribute(file.file.path, "word", value);
                                }}/>
                                <InputField label="Syllable Count" type="number" value={file.syllableCount} onChange={(value: number) => {
                                    this.setFileAttribute(file.file.path, "syllableCount", value);
                                }}/>
                        </div>
                    })}
                </SwipeableViews>
                <div className="buttons">
                    <CustomButton label="Back" onClick={() => {
                        if (page > 0) {
                            this.setState({page: page - 1});
                        }
                        else {
                            this.setState({back: true});
                        }
                    }}/>
                    <p>Page {page + 1} of {this.getPageCount()}</p>
                    <CustomButton disabled={!this.isNextButtonEnabled()}
                                  label={page >= this.getPageCount() - 1 ? page === 0 ? "Next" : "Finish" : "Next"}
                                  onClick={async () => {
                                      if (page >= this.getPageCount() - 1 && (page !== 0 && page !== 1)) {
                                          await this.loadReport();
                                      }
                                      else {
                                          this.setState({page: page + 1});
                                      }
                                  }}/>
                </div>
            </div>
        )
    }
}

export default LoggedInTest