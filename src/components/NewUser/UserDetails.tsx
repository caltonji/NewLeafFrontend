import {
    Button,
    Grid,
    TextField
    }
    from '@material-ui/core';
import * as React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css'
import { IUser, submitUser } from "../../data";

import "./NewUser.css";

const submitLabel: string = "Submit";

interface IUserDetailsProps {
    setIsBusy: (isBusy: boolean) => void,
}

interface IUserDetailsState {
    name: string,
    phoneNumber: string
}

export default class UserDetails extends React.Component<IUserDetailsProps, IUserDetailsState> {

    constructor(props: any) {
        super(props);
        
        this.state = {
            name: "",
            phoneNumber: ""
        };
    }

    private onPhoneNumberChange = (value: string) => {
        console.log(value);
        this.setState({ phoneNumber: value })
    };

    private onNameChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ name: event.target.value});
    };
    
    private inputsAreValid = () => {
        const phoneNumberIsValid = this.state.phoneNumber.length === 11;
        return this.state.name && phoneNumberIsValid;
    }

    private onSubmitUser = () => {
        const phoneNumber = "+" + this.state.phoneNumber;
        this.props.setIsBusy(true);
        submitUser(
            this.state.name,
            phoneNumber,
            (user: IUser) => {
                window.location.replace("/" + user.user_id);
        })
    };

    public render() {
        return (
            <div className="newuser__userdetailscontainer">
                <Grid className="newuser__buttoncontainer" container justify="center">
                    <PhoneInput
                        inputClass="userdetails__phone"
                        country="us"
                        value={ this.state.phoneNumber }
                        onChange={ this.onPhoneNumberChange }/>
                </Grid>
                <Grid className="newuser__buttoncontainer" container justify="center">
                    <TextField
                        required
                        id="name"
                        name="name"
                        label="Display name"
                        value={ this.state.name }
                        onChange={ this.onNameChange }
                        fullWidth
                    />
                </Grid>
                <Grid className="newuser__buttoncontainer" container justify="center">
                    <Button
                        variant="contained"
                        size="large"
                        color="primary"
                        onClick={ this.onSubmitUser }
                        disabled={ !this.inputsAreValid() }>
                        { submitLabel }
                    </Button>
                </Grid>
            </div>
        );
    }
}