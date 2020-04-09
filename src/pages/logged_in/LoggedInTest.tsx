import React from "react";
import {Redirect} from "react-router-dom";
import SwipeableViews from 'react-swipeable-views';
import Dropzone from "react-dropzone";
import Splash from "../../components/Splash";
import CustomButton from "../../components/CustomButton";
import {LoggedInRoutes} from "../../constants/routes";

import "../../style/pages/logged_in/LoggedInTest.css";
import InputField from "../../components/InputField";

interface Props {
}

interface State {
    back: boolean
    page: number
    files: CustomFile[]
}

class CustomFile {
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

class LoggedInTest extends React.Component<Props, State> {
    componentDidMount(): void {
        this.setState({page: 0, files: []});
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

    render() {
        const {back, page = 0, files = []} = this.state || {};

        if (back) {
            return <Redirect to={LoggedInRoutes.HOME}/>
        }

        const acceptedFiles = files.map(file => (
            <li key={file.file.path}>
                {file.file.path}
            </li>
        ));

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
                    <p>Final Page</p>
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
                    <p>Page {page + 1} of {files.length + 2}</p>
                    <CustomButton disabled={page === files.length + 1} label={"Next"} onClick={() => {
                        this.setState({page: page + 1});
                    }}/>
                </div>
            </div>
        )
    }
}

export default LoggedInTest