import { Button, Container, Grid, Typography } from '@material-ui/core';
import * as React from 'react';

import "./NewUser.css";

const introTextFirstLine: string = "Hey, Chris here 👋.";
const introTextSecondLine: string = "I thought it'd be fun if we did a photo sharing competition.";
const introTextThirdLine: string = "You in?";
const gettingStartedButtonLabel: string = "Get Started";

interface IStaticWelcomeProps {
    moveOn: () => void
}

export default class StaticWelcome extends React.Component<IStaticWelcomeProps> {

    public render() {
        return (
            <React.Fragment>
                <Container maxWidth="sm" className={ "newuser__container" }>
                    <Typography variant="h4" align="center" color="textPrimary">
                    { introTextFirstLine }
                    </Typography>
                    <Typography variant="h4" align="center" color="textPrimary">
                    { introTextSecondLine }
                    </Typography>
                    <Typography variant="h4" align="center" color="textPrimary">
                    { introTextThirdLine }
                    </Typography>
                    <Grid className="newuser__buttoncontainer" container justify="center">
                        <Button variant="contained" size="large" color="primary" onClick={ this.props.moveOn }>
                            { gettingStartedButtonLabel }
                        </Button>
                    </Grid>
                </Container>
            </React.Fragment>
        );
    }
}