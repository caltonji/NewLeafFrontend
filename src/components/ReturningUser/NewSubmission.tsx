import { Button, Container, Grid, Typography } from '@material-ui/core';
import * as React from 'react';
import "regenerator-runtime";
// tslint:disable-next-line:ordered-imports
import { DropzoneArea } from 'material-ui-dropzone';
import { ISubmission, submitSubmission } from "../../data";

import "./ReturningUser.css";

const leadInMessageFirstLine: string = "Upload a childhood photo of yourself.";
const leadInMessageSecondLine: string = "(there's points for cutest)";
const submitButtonLabel: string = "Submit";
const loadingMessage: string = "Sorry, this takes a really long time because I'm paying very little on hosting fees.";

interface INewSubmissionProps {
    userId: string,
    setIsBusy: (isBusy: boolean, loadingMessage?: string) => void,
    onFinish: () => void
}

interface INewSubmissionState {
    photo?: File
}

export default class NewSubmission extends React.Component<INewSubmissionProps, INewSubmissionState> {
    constructor(props: any) {
        super(props);
        
        this.state = {
            photo: undefined
        };
    }

    private submitPhoto = () => {
        if (this.state.photo) {
            this.props.setIsBusy(true, loadingMessage);
            submitSubmission(
                this.state.photo,
                this.props.userId,
                (submission: ISubmission) => {
                    this.props.onFinish();
                });
        }
    }
    
    private onChangeFiles = (files: FileList) => {
        if (files && files[0]) {
            this.setState({photo: files[0]});
        }
    };

    private isButtonDisabled = (): boolean => {
        return !this.state.photo;
    }

    public render() {
        return (
            <Container>
                <Typography variant="h4" align="center" color="textPrimary">
                    { leadInMessageFirstLine }
                </Typography>
                <Typography variant="h6" align="center" color="textSecondary">
                    { leadInMessageSecondLine }
                </Typography>
                <div className="newsubmission__dropzonecontainer">
                    <DropzoneArea 
                        acceptedFiles={ ['image/*'] }
                        filesLimit={ 1 }
                        maxFileSize={ 20000000 }
                        onChange={ this.onChangeFiles }
                        />
                </div>
                <Grid className="newuser__buttoncontainer" container justify="center">
                    <Button 
                        variant="contained"
                        size="large"
                        color="primary"
                        disabled={ this.isButtonDisabled() }
                        onClick={ this.submitPhoto }>
                        { submitButtonLabel }
                    </Button>
                </Grid>
            </Container>
        );
    }
}