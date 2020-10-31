import {
    Grid,
    TextField
    }
    from '@material-ui/core';
import "regenerator-runtime";
// tslint:disable-next-line:ordered-imports
import { DropzoneArea } from 'material-ui-dropzone'
import * as React from 'react';

import "./Create.css";

interface IAddArtDetailsProps {
    files?: [string],
    onChangeFiles: (files: FileList) => void,
    artName: string
    onChangeArtName: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
    artistName: string
    onChangeArtistName: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
}

export default class SubmitArt extends React.Component<IAddArtDetailsProps> {

    public render() {
        return (
            <React.Fragment>
                <Grid className="submitname__containergrid"
                    container={ true }
                    spacing={2}
                    direction="column"
                    justify="center"
                    alignItems="center">
                    <DropzoneArea 
                        acceptedFiles={ ['image/*'] }
                        initialFiles={ this.props.files }
                        filesLimit={ 1 }
                        maxFileSize={ 20000000 }
                        onChange={ this.props.onChangeFiles }
                        />
                    <Grid item={ true } key={ 1 } xs={12} sm={12} className="create__full">
                        <TextField
                            required
                            id="artName"
                            name="artName"
                            label="What's the name of this piece?"
                            value={ this.props.artName }
                            onChange={ this.props.onChangeArtName }
                            fullWidth
                            autoComplete="username"
                        />
                    </Grid> 
                    <Grid item={ true } key={ 2 } xs={12} sm={12} className="create__full">
                        <TextField
                            required
                            id="artistName"
                            name="artistName"
                            label="What's the name of the arist?"
                            value={ this.props.artistName }
                            onChange={ this.props.onChangeArtistName }
                            fullWidth
                            autoComplete="username"
                        />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}