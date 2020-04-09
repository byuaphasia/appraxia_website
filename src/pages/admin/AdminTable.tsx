import React from 'react';
import Splash from "../../components/Splash";
import {Redirect} from "react-router-dom";
import CustomButton from "../../components/CustomButton";
import {LoggedInRoutes} from "../../constants/routes";
import { FormGroup, FormControlLabel, Switch } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

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

    constructor(props: any) {
        super(props);

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
        return new Date(dateIn).getFullYear() + "-" + (new Date(dateIn).getMonth() + 1) +
        "-" + new Date(dateIn).getDate()
    }

    getData() {
        let includeRecordings = this.state.checked
        let startDate = this.getNewDate(this.state.selectedStartDate.toUTCString())
        let endDate = this.getNewDate(this.state.selectedEndDate.toUTCString())
        console.log(startDate)
        console.log(endDate)
        console.log(includeRecordings)
        async function postData(url = '', data = {
            "startDate": startDate,
            "endDate": endDate,
            "includeRecordings": includeRecordings
          }) {
            // Default options are marked with *
            const response = await fetch(url, {
              method: 'POST',
              mode: 'cors',
              cache: 'no-cache',
              credentials: 'same-origin',
              headers: {
                'Content-Type': 'application/json'
              },
              redirect: 'follow',
              referrerPolicy: 'no-referrer',
              body: JSON.stringify(data)
            });
            return response.json();
          }
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
                    />
                </FormGroup>
                <CustomButton label="Submit to Get Data" 
                onClick={this.getData} />
                <CustomButton label="Back" onClick={async () => {
                    this.setState({back: true})
                }}/>

            </div>
        );
    }
}