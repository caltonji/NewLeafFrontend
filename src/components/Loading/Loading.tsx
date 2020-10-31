import { CircularProgress, Grid, Typography } from "@material-ui/core";
import * as React from 'react';

import "./Loading.css";

interface ILoadingProps {
    message?: string
}

export default class Introduction extends React.Component<ILoadingProps, any> {
    public render() {
        return (
            <Grid className="loading__container" container justify="center" alignContent="center">
                <CircularProgress size={ 80 }/>
                { this.props.message && 
                    <Typography align="center" color="primary" variant="h6" className="loading__text">
                        { this.props.message }
                    </Typography>
                }
            </Grid>
        );
    }
}