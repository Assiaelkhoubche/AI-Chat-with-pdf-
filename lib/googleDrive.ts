import { google } from "googleapis";


const oauth2Client= new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_SECRET_KEY,
    process.env.GOOGLE_REDIRECT_URL
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

export default oauth2Client