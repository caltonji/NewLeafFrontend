import axios from 'axios';

const defaultTemplateId = "AltonjiTemplate2";

// assuming the base url might work in prod. Not sure.
const baseUrl =  process.env.NODE_ENV === 'development'
    ? "http://0.0.0.0:8000"
    :  "https://artshare-backend-b2.azurewebsites.net";
// const baseUrl = "https://artshare-backend-b2.azurewebsites.net";

export interface IUser {
    name: string,
    phone_number: string,
    template_id: string,
    user_id: string
}

export interface ISubmission {
    photo_url: string,
    submission_id: string,
    template_id: string,
    user_id: string,
    responses?: IResponse[]
    user?: IUser
}

export interface IResponse {
    response_id: string,
    submission_id: string,
    template_id: string,
    text: string,
    user_id: string,
    user?: IUser
}

export function getUser(
    userId: string,
    callback: (user: IUser) => void,
    onFailure: () => void) {
        const queryParams = {
            user_id: userId,
            template_id: defaultTemplateId
        };
        axios.get("/user",
            {
                baseURL: baseUrl,
                params: queryParams
            }).then(res => {
                if (res.status === 200) {
                    callback(res.data);
                } else {
                    console.log("failed get user: " + res);
                }
            }).catch((reason: any) => {
                onFailure();
            });
    }

export function submitUser(
    name: string,
    phoneNumber: string,
    callback: (user: IUser) => void) {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("phone_number", phoneNumber);
        formData.append("template_id", defaultTemplateId);
        axios.post("/user",
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                baseURL: baseUrl
            })
            .then(res => {
                if (res.status === 200) {
                    callback(res.data);
                } else {
                    console.log("failed put user: " + res);
                }
            });
}

export function getSubmissions(
    userId: string,
    callback: (submissions: ISubmission[]) => void) {
        const queryParams = {
            user_id: userId,
            template_id: defaultTemplateId
        };
        axios.get("/submissions",
            {
                baseURL: baseUrl,
                params: queryParams
            }).then(res => {
                if (res.status === 200) {
                    callback(res.data);
                } else {
                    console.log("failed get submissions: " + res);
                }
            });
    }

    export function submitSubmission(
        photo: File,
        userId: string,
        callback: (submission: ISubmission) => void) {
            const formData = new FormData();
            formData.append("photo", photo, photo.name);
            formData.append("user_id", userId);
            formData.append("template_id", defaultTemplateId);
            axios.put("/submission",
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    baseURL: baseUrl
                })
                .then(res => {
                    if (res.status === 200) {
                        callback(res.data);
                    } else {
                        console.log("failed put submission: " + res);
                    }
                });
    
    }

    export function submitResponse(
        userId: string,
        submissionId: string,
        text: string,
        callback: (response: IResponse) => void) {
            const formData = new FormData();
            formData.append("user_id", userId);
            formData.append("submission_id", submissionId);
            formData.append("template_id", defaultTemplateId);
            formData.append("text", text)
            axios.put("/response",
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    baseURL: baseUrl
                })
                .then(res => {
                    if (res.status === 200) {
                        callback(res.data);
                    } else {
                        console.log("failed put user: " + res);
                    }
                });
    }