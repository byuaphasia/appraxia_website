import React from 'react';
import Splash from "../../components/Splash";
import {Redirect} from "react-router-dom";
import CustomButton from "../../components/CustomButton";
import {LoggedInRoutes} from "../../constants/routes";
import { FormGroup, FormControlLabel, Switch } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import BackendClient from "../../helpers/backend-client";

import "../../style/pages/admin/AdminTable.css";

interface Props {
}

interface State {
    back: boolean,
    checked: boolean,
    selectedStartDate: Date,
    selectedEndDate: Date
}

export default class AdminTable extends React.Component<Props, State> {
    componentDidMount(): void {

    }

    private readonly backendClient: BackendClient;

    constructor(props: any) {
        super(props);

        this.backendClient = new BackendClient();

        this.state = {
            checked: false,
            back: false,
            selectedStartDate: new Date(),
            selectedEndDate: new Date()
        };

        this.toggleChecked=this.toggleChecked.bind(this)
        this.handleStartDateChange=this.handleStartDateChange.bind(this)
        this.handleEndDateChange=this.handleEndDateChange.bind(this)
        this.getData=this.getData.bind(this)
    }

    toggleChecked(){
        if (this.state.checked === true) {
            this.setState ({
                checked: false
            });
        }
        else {
            this.setState ({
                checked: true
            });
        }
    }

    getNewDate(dateIn: any) {
        return (new Date(dateIn).getFullYear() + "-" + ('0' + (new Date(dateIn).getMonth()+1)).slice(-2)
        + "-" + ("0" + new Date(dateIn).getDate()).slice(-2));
    }

    getData() {
        let includeRecordings = this.state.checked
        let startDate = this.getNewDate(this.state.selectedStartDate.toUTCString())
        let endDate = this.getNewDate(this.state.selectedEndDate.toUTCString())

        this.backendClient.getExportedData(startDate, endDate, includeRecordings)
    }

    handleStartDateChange(date: any) {
        this.setState ({
            selectedStartDate: date
        });
    }

    handleEndDateChange(date: any) {
        this.setState ({
            selectedEndDate: date
        });
    }

    render() {
        const {back} = this.state || {};

        if (back) {
            return <Redirect to={LoggedInRoutes.HOME}/>
        }

        return (
            <div id="admin">
                <Splash/>
                <br/>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        label="Start Date"
                        value={this.state.selectedStartDate}
                        placeholder="1/1/2018"
                        onChange={date => this.handleStartDateChange(date)}
                        minDate={"1/1/2018"}
                        maxDate={new Date()}
                        format="MM/dd/yyyy"
                    />
                    <KeyboardDatePicker
                        label="End Date"
                        value={this.state.selectedEndDate}
                        placeholder="1/1/2018"
                        onChange={date => this.handleEndDateChange(date)}
                        minDate={"1/1/2018"}
                        maxDate={new Date()}
                        format="MM/dd/yyyy"
                    />
                </MuiPickersUtilsProvider>
                
                <FormGroup>
                    <FormControlLabel
                        control={<Switch color={this.state.checked ? 'primary' : 'secondary'} checked={this.state.checked} onChange={this.toggleChecked} />}
                        label="Include Recordings?"
                        labelPlacement="start"
                    />
                </FormGroup>
                <div className="buttons">
                    <CustomButton label="Back" onClick={() => this.setState({back: true})}/>
                    <CustomButton label="Download" onClick={this.getData} />
                </div>

            </div>
        );
    }
}