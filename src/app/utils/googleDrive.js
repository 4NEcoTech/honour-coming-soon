import { google } from "googleapis";
import { Readable } from "stream";
import fs from "fs";
import path from "path";
import os from "os"; // Import OS module to get temp directory

// Decode Google Service Account JSON from Vercel's environment variable
const googleServiceAccount = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT, "base64").toString("utf8");

// Use OS temp directory instead of hardcoded `/tmp/`
const TEMP_DIR = os.tmpdir();
const KEYFILEPATH = path.join(TEMP_DIR, "google-drive-key.json");

// Write the key file dynamically
fs.writeFileSync(KEYFILEPATH, googleServiceAccount);

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

export const uploadToGoogleDrive = async (fileBuffer, filename, mimetype) => {
  try {
    // Step 1: Search if file with the same name exists in the folder
    const existingFiles = await drive.files.list({
      q: `name='${filename}' and '${"1D3v96I6xQ8Pyqj5fGbAelyoTQB1ZiwKn"}' in parents and trashed=false`,
      fields: "files(id, name)",
    });

    const fileMetadata = {
      name: filename,
      parents: ["1D3v96I6xQ8Pyqj5fGbAelyoTQB1ZiwKn"],
    };

    const media = {
      mimeType: mimetype,
      body: Readable.from(fileBuffer),
    };

    let fileId;
    if (existingFiles.data.files.length > 0) {
      // File exists → update it
      fileId = existingFiles.data.files[0].id;

      await drive.files.update({
        fileId,
        media,
      });
    } else {
      // File doesn't exist → create new one
      const createRes = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id",
      });
      fileId = createRes.data.id;

      // Make public only when newly created
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });
    }

    return `https://drive.google.com/uc?id=${fileId}`;
  } catch (error) {
    console.error("Error uploading to Google Drive:", error);
    throw error;
  }
};


