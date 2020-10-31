import {
    Container,
    Paper
    }
    from '@material-ui/core';
import * as React from 'react';
import SubmitArt from "./SubmitArt";

import "./Create.css";

export default class Exhibition extends React.Component {
    public render() {
        return (
            <Container maxWidth="md">
                <Paper className="create__paper" >
                    <SubmitArt />
                </Paper>
            </Container>
        );
    }
}