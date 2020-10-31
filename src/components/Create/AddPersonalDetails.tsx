import {
    Grid,
    TextField
    }
    from '@material-ui/core';
import * as React from 'react';
import "./Create.css";

interface IAddPersonalDetailsProps {
    curatorName: string,
    onChangeCuratorName: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    curatorNotes: string,
    onChangeCuratorNotes: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default class SubmitArt extends React.Component<IAddPersonalDetailsProps> {

    public render() {
        return (
            <React.Fragment>
                <Grid className="submitname__containergrid"
                    container={ true }
                    spacing={2}
                    direction="column"
                    justify="center"
                    alignItems="center">  
                    <Grid item={ true } key={ 3 } xs={12} sm={12} className="create__full">
                        <TextField
                            required
                            id="curatorName"
                            name="curatorName"
                            label="Who are you?"
                            value={ this.props.curatorName }
                            onChange={ this.props.onChangeCuratorName }
                            fullWidth
                            autoComplete="username"
                        />
                    </Grid>
                    <Grid item={ true } key={ 4 } xs={12} sm={12} className="create__full">
                        <TextField
                            required
                            multiline
                            id="curatorNotes"
                            name="curatorNotes"
                            label="In your own words, tell us about this piece"
                            value={ this.props.curatorNotes }
                            onChange={ this.props.onChangeCuratorNotes }
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}