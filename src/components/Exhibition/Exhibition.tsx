import {
    Container,
    Grid
    } from '@material-ui/core';
import * as React from 'react';
import { ArtCard } from '../../components';
import { getArtDisplays, IArt } from '../../data/';
import './Exhibition.css';

const actionTitle = "Add a piece to the collection!";
const actionSubtext = "I will print out any of the art you add onto poster paper and you can take it home after the party."

interface IExhibitionState {
    artItems: IArt[]
}

export default class Exhibition extends React.Component<any, IExhibitionState> {

    constructor(props: any) {
        super(props);
        this.state = { artItems: [] }
    }

    public componentDidMount = () => {
        getArtDisplays((arts: IArt[]) => {
            this.setState({ artItems: arts });
        });
    }

    public render() {
        return (
            <Container maxWidth="md">
                <Grid container={ true } spacing={ 10 }>
                    {this.state.artItems.map((item) => (
                    <Grid item={ true } key={ item.id } xs={12} sm={6}>
                        <ArtCard 
                            imgUrl={ item.blobUri }
                            artName={ item.name }
                            artistName={ item.artist }
                            curatorName={ item.curator }
                            curatorNotes={ item.curatorNotes } />
                    </Grid>
                    ))}
                    <Grid item={ true } key={ "add piece" } xs={12} sm={6}>
                        <ArtCard
                            imgUrl={ "plus-512.png" }
                            artName={ actionTitle }
                            artistName={ actionSubtext }
                            href={ "/create" }/>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}