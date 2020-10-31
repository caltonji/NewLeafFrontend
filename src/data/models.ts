export interface IArtItem {
    id: number;
    created: Date;
    art_url: string;
    art_name: string;
    artist_name: string;
    curator_name: string;
    curator_notes: string;
}

export interface ICurator {
    id: number;
    name: string;
    created: Date;
}

export const config =  {
    baseUrl: "http://0.0.0.0:8000"
}