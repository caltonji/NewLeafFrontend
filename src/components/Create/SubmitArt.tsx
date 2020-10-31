import {
    Box,
    Button,
    CircularProgress,
    Grid
    }
    from '@material-ui/core';
import * as React from 'react';
import { ArtCard } from "../../components";
import { IArt, submitArtDisplay } from '../../data';
import AddArtDetails from "./AddArtDetails";
import AddPersonalDetails from "./AddPersonalDetails";
import "./Create.css";

enum SubmitStage {
    ChooseArt = 1,
    AddNotes,
    Submitting
}

interface ISubmitArtState {
    artPhoto?: File,
    artPhotoUrl: string,
    artName: string,
    artistName: string,
    curatorName: string,
    curatorNotes: string,
    submitStage: SubmitStage
}

const NameKey = "curatorName";

export default class SubmitArt extends React.Component<any, ISubmitArtState> {

    constructor(props: any) {
        super(props);
        // this.state = { artPhoto: undefined, artName: "", artistName: "", curatorName: "", curatorNotes: "" };
        const storedName = localStorage.getItem(NameKey);

        this.state = {
            artPhoto: undefined,
            artPhotoUrl: "",
            artName: "",
            artistName: "",
            curatorName: storedName ? storedName : "",
            curatorNotes: "It represents our shattered sense of community in the face of capitalist-driven isolation. Looks like the work of Cindy Sherman or Frank Stella.",
            submitStage: SubmitStage.ChooseArt
        };
    }

    private onChangeFiles = (files: FileList) => {
        if (files && files[0]) {
            this.setState({artPhoto: files[0], artPhotoUrl: URL.createObjectURL(files[0])});
        }
    };
    private onChangeArtName = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({artName: event.target.value});
    };
    private onChangeArtistName = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({artistName: event.target.value});
    };
    private onChangeCuratorName = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({curatorName: event.target.value});
    };
    private onChangeCuratorNotes = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({curatorNotes: event.target.value});
    };

    private submitArt = () => {
        if (this.state.artPhoto) {
            this.setState({submitStage: SubmitStage.Submitting})
            submitArtDisplay(
                this.state.artPhoto,
                this.state.artName,
                this.state.artistName,
                this.state.curatorName,
                this.state.curatorNotes,
                (createdArtItem: IArt) => {
                    localStorage.setItem(NameKey, createdArtItem.curator);
                    window.location.replace("/");
                }
            )
        }
    };

    private handleBackPress = () => {
        this.setState({submitStage: SubmitStage.ChooseArt });
    }
    private handleForwardPress = () => {
        if (this.state.submitStage === SubmitStage.ChooseArt) {
            this.setState({submitStage: SubmitStage.AddNotes});
        } else {
            this.submitArt();
        }
    }
    private getButtonLabel = (stage: SubmitStage) => {
        return stage === SubmitStage.ChooseArt ? "Next" : "Submit";
    }

    public render() {
        return (
            <React.Fragment>
                {this.state.submitStage === SubmitStage.ChooseArt ? (
                    <AddArtDetails
                        files={ this.state.artPhotoUrl ? [this.state.artPhotoUrl] : undefined }
                        onChangeFiles={ this.onChangeFiles }
                        artName={ this.state.artName }
                        onChangeArtName={ this.onChangeArtName }
                        artistName={ this.state.artistName }
                        onChangeArtistName={ this.onChangeArtistName }
                    />
                ) : (
                    <React.Fragment>
                        <ArtCard
                            imgUrl={ this.state.artPhotoUrl }
                            artName={ this.state.artName }
                            artistName={ this.state.artistName }
                        />
                        <Box mt={ 2 }>
                            <AddPersonalDetails
                                curatorName={ this.state.curatorName }
                                onChangeCuratorName={ this.onChangeCuratorName }
                                curatorNotes={ this.state.curatorNotes }
                                onChangeCuratorNotes={ this.onChangeCuratorNotes }
                            />
                        </Box>
                    </React.Fragment>
                )}
                <Box mt={ 2 }>
                    <Grid
                        justify="space-between"
                        spacing={10}
                        container>
                        <Grid item>
                            <Button
                                className={ "create__button" }
                                variant="contained"
                                disabled={ this.state.submitStage === SubmitStage.ChooseArt }
                                onClick={ this.handleBackPress }>
                                Back
                            </Button>
                        </Grid>
                        <Grid item>
                            <div className="create__createbuttonwrapper">
                                <Button
                                    className={ "create__button" }
                                    disabled={ this.state.submitStage === SubmitStage.Submitting}
                                    variant="contained"
                                    color="primary"
                                    onClick={ this.handleForwardPress }>
                                    { this.getButtonLabel(this.state.submitStage) }
                                </Button>
                                { this.state.submitStage === SubmitStage.Submitting &&
                                    <CircularProgress size={36} className="create__createbuttonspinner" />
                                }
                            </div>
                        </Grid>
                    </Grid>
                </Box> 
            </React.Fragment>
        );
    }
}