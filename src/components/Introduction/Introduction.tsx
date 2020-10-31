import * as React from 'react';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import "./Introduction.css";

const headerText: string = "Know any cool art?";
const descriptionTextFirstLine: string = "We're having an art party (you're invited).  We're gonna print out some pieces, drink wine and sophisticatedly comment on the art.  We need to find some pieces to print, can you help us out?"
const descriptionTextSecondLine: string = "I also just wanted to make this website tbh."

export default class Introduction extends React.Component {
    public render() {
        return (
            <div className={ "introduction__container" }>
                <Container maxWidth="sm">
                    <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom={ true }>
                    { headerText }
                    </Typography>
                    <Typography variant="h5" align="center" color="textSecondary" paragraph={ false }>
                    { descriptionTextFirstLine }
                    </Typography>
                    <Typography variant="h5" align="center" color="textSecondary" paragraph={ true }>
                    { descriptionTextSecondLine }
                    </Typography>
                </Container>
            </div>
        );
    }
}