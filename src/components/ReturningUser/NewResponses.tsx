import { Button, CircularProgress, Grid, TextField, Typography } from '@material-ui/core';
import Image from 'material-ui-image';
import * as React from 'react';
import { IResponse, ISubmission, submitResponse } from "../../data";

import "./ReturningUser.css";

interface INewResponsesProps {
    userId: string,
    submissions: ISubmission[],
    onFinish: () => void
}

interface INewResponsesState {
    response: string,
    index: number,
    isBusy: boolean
}

const message: string = "Now caption everyone else's submissions!";
const subMessage: string = "(there's points for funniest)";
const nextButtonLabel: string = "Skip";
const captionHint: string = "Caption";
export default class NewResponses extends React.Component<INewResponsesProps, INewResponsesState> {
 
    constructor(props: any) {
        super(props);

        this.state = {
            response: "",
            index: 0,
            isBusy: false
        };
    }

    private onChangeResponse = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({response: event.target.value});
    };

    private getSubmitButtonLabel = () => {
        return "Submit";
    }

    private getIndexText = () => {
        return (this.state.index + 1).toString() + " / " + this.props.submissions.length;
    }

    private getSubmission = () => {
        return this.props.submissions[this.state.index];
    }

    private onSubmitResponse = () => {
        if (this.state.response) {
            this.setState({isBusy: true})
            submitResponse(
                this.props.userId,
                this.getSubmission().submission_id,
                this.state.response,
                (response: IResponse) => {
                    this.nextResponse();
                    this.setState({isBusy: false});
                });
        }
    };

    private nextResponse = () => {
        const newIndex = this.state.index + 1;
        if (newIndex >= this.props.submissions.length) {
            this.props.onFinish();
        } else {
            this.setState({ index: newIndex, response: "" });
        }
    }

    private getImageTitle = () => {
        return "Photo submission from " + this.getSubmission().user?.name;
    }
    private isSubmitButtonDisabled = () => {
        return !this.state.response || this.state.isBusy;
    }

    private isNextButtonDisabled = () => {
        return this.state.isBusy;
    }

    public render() {
        return (
            <div>
                <Grid container direction="column">
                    <Typography variant="h4" align="center" color="textPrimary">
                        { message }
                    </Typography>
                    <Typography variant="h6" align="center" color="textSecondary">
                        { subMessage }
                    </Typography>
                    <Typography color="textSecondary">
                        { this.getIndexText() }
                    </Typography>
                    <Image
                        className="submission__image"
                        title={ this.getImageTitle() }
                        src={ this.getSubmission().photo_url }
                        animationDuration={ 1000 }
                        aspectRatio={(5/4)} />
                    <Grid className="newresponse__textfieldcontainer" item={ true } key={ 4 } xs={12} sm={12}>
                        <TextField
                            required
                            multiline
                            id="response"
                            name="response"
                            label={ captionHint }
                            value={ this.state.response }
                            onChange={ this.onChangeResponse }
                            fullWidth
                        />
                    </Grid>
                    <Grid className="newuser__buttoncontainer" container justify="flex-end">
                        <Button
                            className="newresponses__button"
                            variant="contained"
                            size="small"
                            disabled ={ this.isNextButtonDisabled() }
                            onClick={ this.nextResponse }>
                            { nextButtonLabel }
                        </Button>
                        <Button
                            className="newresponses__button"
                            variant="contained"
                            size="large"
                            color="primary"
                            disabled={ this.isSubmitButtonDisabled() }
                            onClick={ this.onSubmitResponse }>
                            { this.getSubmitButtonLabel() }
                            { this.state.isBusy && <CircularProgress size={ "24px" } className="newresponse__buttonprogress" />}
                        </Button>
                    </Grid>
                </Grid>
            </div>
        );
    }
}