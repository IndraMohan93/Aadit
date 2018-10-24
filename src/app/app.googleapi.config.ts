import { NgGapiClientConfig } from "ng-gapi";

export const gapiClientConfig: NgGapiClientConfig = {
    client_id: "1026002468534-4tecffk1ojtkjoamr35i1358h3etk2h5.apps.googleusercontent.com",
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    scope: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.readonly",
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/spreadsheets.readonly"
    ].join(" ")
};