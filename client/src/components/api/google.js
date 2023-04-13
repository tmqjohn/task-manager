const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.file",
];

const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];

export async function gapiPickerLoad() {
  await window.gapi.load("picker", initGapiPickerLoad);
}

export function initGapiPickerLoad() {
  google.accounts.oauth2.initTokenClient({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    scope: SCOPES,
  });
}

export async function gapiDriveLoad() {
  await window.gapi.load("client", initGapiDriveClient);
}

async function initGapiDriveClient() {
  await window.gapi.client.init({
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
  });
}
