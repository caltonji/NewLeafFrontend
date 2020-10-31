import * as React from 'react';
import { getSubmissions, getUser, IResponse, ISubmission, IUser } from "../../data";
import Loading from "../Loading/Loading";
import NewResponses from "./NewResponses";
import NewSubmission from "./NewSubmission";
import ViewSubmissions from "./ViewSubmissions";

import "./ReturningUser.css";

enum Stage {
    CreateSubmission = 1,
    CreateResponses,
    ViewSubmissions
}

interface IReturningUserProps {
    userId: string
}

interface IReturningUserState {
    user?: IUser,
    stage: Stage,
    isBusy: boolean,
    loadingMessage: string,
    finishedResponses: boolean,
    submissions: ISubmission[],
    preloadIndex: number
}

export default class ReturningUser extends React.Component<IReturningUserProps, IReturningUserState> {
    constructor(props: any) {
        super(props);

        this.state = {
            stage: Stage.CreateSubmission,
            user: undefined,
            isBusy: true,
            loadingMessage: "",
            finishedResponses: false,
            submissions: [],
            preloadIndex: 1
        };
    }

    public componentDidMount = () => {
        // get user and submissions and mark isBusy false
        getUser(this.props.userId,
            (user: IUser) => {
                getSubmissions(
                    this.props.userId,
                    (submissions: ISubmission[]) => {
                        submissions = this.orderSubmissions(submissions);
                        const stage = this.getStageFromSubmissions(submissions, this.props.userId, false);
                        this.setState({ user, submissions, stage, isBusy: false });
                });
            },
            () => {
                console.log("setup failed");
                window.location.replace("/");
            });
    }

    private reevaluateStage = () => {
        const previousSubmissions = this.state.submissions;
        getSubmissions(
            this.props.userId,
            (submissions: ISubmission[]) => {
                submissions = this.orderSubmissions(submissions, previousSubmissions);
                const stage = this.getStageFromSubmissions(submissions, this.props.userId, this.state.finishedResponses);
                this.setState({ submissions, stage, isBusy: false });
        });
    }

    private orderSubmissions = (submissions: ISubmission[], previousSubmissions?: ISubmission[]): ISubmission[] => {
        if (!previousSubmissions) {
            return submissions.sort(() => Math.random() - 0.5);
        } else {
            return submissions.sort((a: ISubmission, b: ISubmission) => {
                const aIndex = previousSubmissions.findIndex((x: ISubmission) => x.submission_id === a.submission_id);
                const bIndex = previousSubmissions.findIndex((x: ISubmission) => x.submission_id === b.submission_id);
                return aIndex - bIndex;
            });
        }
    }

    private getStageFromSubmissions = (
        submissions: ISubmission[],
        userId: string,
        hasFinishedResponses: boolean): Stage => {
        if (!this.getUserSubmission(submissions, userId)) {
            return Stage.CreateSubmission;
        } else if (this.getNonRespondedSubmissions(submissions, userId).length > 0 && !hasFinishedResponses) {
            return Stage.CreateResponses;
        } else {
            return Stage.ViewSubmissions;
        }
    }

    private getUserSubmission = (
        submissions: ISubmission[],
        userId: string): ISubmission | undefined => {
        return submissions.find( (submission: ISubmission) => submission.user_id === userId);
    }

    private getNonRespondedSubmissions = (
        submissions: ISubmission[],
        userId: string): ISubmission[] => {
        return submissions.filter( (submission: ISubmission) => {
            const isMySubmission = submission.user_id === userId;
            const hasResponded = submission.responses?.some((response: IResponse) => response.user_id === userId );
            return !hasResponded && !isMySubmission;
        });
    }

    private onFinishNewResponses = () => {
        this.setState({ finishedResponses: true, isBusy: true });
        this.reevaluateStage();
    }

    private setIsBusy = (isBusy: boolean, loadingMessage?: string): void => {
        loadingMessage = loadingMessage ?? "";
        this.setState({isBusy, loadingMessage});
    }

    private onFinishPreload = () => {
        this.setState({preloadIndex: this.state.preloadIndex + 1})
    }

    public render() {
        return (
            <React.Fragment>
                {
                    this.state.isBusy 
                        ? <Loading message={ this.state.loadingMessage } />
                        : this.state.stage === Stage.CreateSubmission
                            ? <NewSubmission userId={ this.props.userId } setIsBusy={ this.setIsBusy } onFinish={ this.reevaluateStage } />
                            : this.state.stage === Stage.CreateResponses
                                ? <NewResponses userId={ this.props.userId } submissions={ this.getNonRespondedSubmissions(this.state.submissions, this.props.userId) } onFinish={ this.onFinishNewResponses } />
                                : <ViewSubmissions submissions={ this.state.submissions } />
                }
                { this.state.submissions.slice(0, this.state.preloadIndex).map((item, i) =>
                    <link key={ item.submission_id } rel="preload" as="image" href={ item.photo_url } onLoad={ this.onFinishPreload } />
                )}
            </React.Fragment>
            
        );
    }
}