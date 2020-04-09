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


interface Props {
}

interface State {
    back: boolean
    page: number
    files: CustomFile[]
    reportProgress: number
    loadingReport: boolean
    report: any
}

class LoggedInTest extends React.Component<Props, State> {
    componentDidMount(): void {
        this.setState({
            page: 0,
            files: [],
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

    validateFiles() {
        const {files} = this.state;

        for (let i = 0; i < files.length; i++) {
            if (files[i].word.length < 1 || files[i].syllableCount < 1) {
                return false;
            }
        }

        return true;
    }

    async loadReport() {
        const {files} = this.state;
        // let reportProgress = 0;

        this.setState({loadingReport: true});

        for (let i = 0; i < files.length; i++) {
            await new Promise((resolve) => {
                setTimeout(() => resolve(), 1000);
            });
            this.setState({reportProgress: i + 1 / files.length});
        }
    }

    render() {
        const {back, page = 0, files = [], loadingReport, reportProgress} = this.state || {};

        if (back) {
            return <Redirect to={LoggedInRoutes.HOME}/>
        }

        const acceptedFiles = files.map(file => (
            <li key={file.file.path}>
                {file.file.path}
            </li>
        ));

        if (loadingReport && reportProgress < 1) {
            return <div id="logged-in">
                <Splash/>
                <br/>
                <h2>Loading Report...</h2>
                <Spinner/>
            </div>;
        }

        if(loadingReport) {
            return <div id="logged-in">
                <Splash/>
                <br/>
                <h2>Results:</h2>
            </div>
        }

        return (
            <div id="logged-in">
                <Splash/>
                <br/>
                <SwipeableViews index={page}>
                    <div className="page">
                        <Dropzone accept={".wav"}
                            onDrop={acceptedFiles => this.loadFiles(acceptedFiles)}>
                            {({getRootProps, getInputProps}) => (
                                <section className="dropzone-container">
                                    <div {...getRootProps({className: "dropzone"})}>
                                        <input {...getInputProps()}/>
                                        <p>Drag and Drop some files here, or click to select files</p>
                                    </div>
                                    <aside>
                                        <h4>Files</h4>
                                        <ul>{acceptedFiles}</ul>
                                    </aside>
                                </section>
                            )}
                        </Dropzone>
                    </div>
                    {files.map((file, i) => {
                        return <div key={`${i}-${file.file.path}`} className="file-form">
                            <p>File Name: {file.file.path}</p>
                            {file.isLoading ? <p>{(file.progress * 100).toFixed(2) + "%"}</p> :
                                <audio id="audio-element" src={file.URL} controls>
                                    Your browser does not support the
                                    <code>audio</code> element.
                                </audio>}
                                <br/>
                                <br/>
                                <InputField label="Word" value={file.word} onChange={(value: string) => {
                                    this.setFileAttribute(file.file.path, "word", value);
                                }}/>
                                <br/>
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
                    {files.length > 0 && <>
                        <p>Page {page + 1} of {files.length + 1}</p>
                        <CustomButton disabled={page === files.length && !this.validateFiles()}
                                      label={page >= files.length ? "Finish" : "Next"}
                                      onClick={async () => {
                                          if (page >= files.length) {
                                              await this.loadReport();
                                          }
                                          else {
                                              this.setState({page: page + 1});
                                          }
                                      }}/>
                    </>}
                </div>
            </div>
        )
    }
}

export default LoggedInTest