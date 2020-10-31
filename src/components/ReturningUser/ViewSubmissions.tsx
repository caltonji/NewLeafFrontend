import {
    Grid,
    Paper,
    Typography
} from '@material-ui/core';
import Image from 'material-ui-image';
import * as React from 'react';
import { IResponse, ISubmission } from "../../data";

import "./ReturningUser.css";

interface IViewSubmissionsProps {
    submissions: ISubmission[]
}

const noResponsesMessage: string = "No responses yet.";

export default class ViewSubmissions extends React.Component<IViewSubmissionsProps, any> {

    public render() {
        return (
            <Grid container spacing={ 4 }>
                { this.props.submissions.map((submission: ISubmission, index: number) =>
                    <Grid item key={ submission.submission_id } xs={ 12 } >
                        <Paper >
                            <Grid key={ submission.submission_id }>
                                <Typography className="submission__nameheader">{ submission.user?.name }</Typography>
                                <Image
                                    className="submission__image"
                                    title={submission.user?.name }
                                    aspectRatio={ 5 / 4 }
                                    src={ submission.photo_url }
                                    animationDuration={ 1000 } />
                                <div className="viewsubmissions__responsecontainer">                                
                                    { submission.responses?.length
                                        ? submission.responses.map((response: IResponse, jindex: number) =>
                                            <div key={ response.response_id }>
                                                <Typography color="textSecondary" >{ response.user?.name }</Typography>
                                                <Typography>{ response.text }</Typography>
                                            </div>)
                                        : <Typography color="textSecondary">{ noResponsesMessage }</Typography>
                                    }
                                </div>
                            </Grid>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        );
    }
}