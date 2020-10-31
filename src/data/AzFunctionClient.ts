import axios from 'axios';

// assuming the base url might work in prod. Not sure.
const baseUrl =  process.env.NODE_ENV === 'development'
    ? "http://localhost:7071"
    :  window.location.origin;

export interface IArt {
    id: number;
    lastModifiedOn: Date;
    blobUri: string;
    name: string;
    artist: string;
    curator: string;
    curatorNotes: string;
}

export function getArtDisplays(callback: (artItems: IArt[]) => void) {
    axios.get("api/art",
    {
        baseURL: baseUrl
    }).then(res => {
        console.log(res);
        console.log(res.data);
        if (!("error" in res.data)) {
            console.log(res.data as IArt[]);
            callback(res.data);
        }
    });
}

export function submitArtDisplay(
    photo: File,
    name: string,
    artist: string,
    curator: string,
    curatorNotes: string,
    callback: (artItem: IArt) => void) {
        const formData = new FormData();
        formData.append("file", photo, photo.name);
        formData.append("artName", name);
        formData.append("artistName", artist);
        formData.append("curatorName", curator);
        formData.append("curatorNotes", curatorNotes);
        axios.put("/api/art",
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
                    console.log("failed put art: " + res);
                }
            });

}