import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography
    }
    from '@material-ui/core';
import * as React from 'react';

import "./ArtCard.css";

interface IArtCardProps {
    imgUrl: string
    artName: string,
    artistName: string,
    curatorName?: string,
    curatorNotes?: string,
    href?: string
}

export default class ArtCard extends React.Component<IArtCardProps> {

    public render() {
        const shouldRenderCurator = this.props.curatorName && this.props.curatorNotes;

        return (
            <React.Fragment>
                <Card className={ "artcard__card" }>
                    <CardActionArea
                        className={ "artcard__cardactionarea" }
                        disabled={ !this.props.href }
                        href={ this.props.href ? this.props.href : "" }>
                        <CardMedia
                            className={ "artcard__cardmedia"}
                            image={ this.props.imgUrl }
                            title={ this.props.artName }
                        />
                        <CardContent>
                            <Typography gutterBottom={ true } variant="h5" component="h2" color="textPrimary">
                            { this.props.artName }
                            </Typography>
                            <Typography color="textSecondary" paragraph={ true }>
                            { this.props.artistName }
                            </Typography>
                            { shouldRenderCurator && 
                                <Typography color="textSecondary">
                                    <Typography color="textPrimary" display="inline">{this.props.curatorName}:</Typography> "{this.props.curatorNotes}"
                                </Typography>
                            }
                        </CardContent>
                    </CardActionArea>
                </Card>
            </React.Fragment>
        );
    }
}