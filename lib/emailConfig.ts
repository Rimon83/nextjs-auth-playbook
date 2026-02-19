import nodemailer from "nodemailer";
import { google } from "googleapis";

const OAuth2 = google.auth.OAuth2;

// Create OAuth2 client
const oauth2Client = new OAuth2(
  process.env.AUTH_GOOGLE_ID,
  process.env.AUTH_GOOGLE_SECRET,
  "https://developers.google.com/oauthplayground", // Redirect URL
);

// Set the refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// Function to get access token
async function getAccessToken() {
  try {
    const { token } = await oauth2Client.getAccessToken();
    if (!token) {
      throw new Error("Failed to get access token");
    }
    return token;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
}

// Create reusable transporter
export async function createTransporter() {
  const accessToken = await getAccessToken();

  return nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: process.env.GMAIL_USER,
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });
}
