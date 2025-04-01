// import { google } from "googleapis";
// import { Readable } from "stream";
// import fs from "fs";
// import path from "path";

// // Load Service Account Key
// const KEYFILEPATH = path.join(process.cwd(), "google-drive-key.json"); // Store your Google API key file in root
// const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

// const auth = new google.auth.GoogleAuth({
//   keyFile: KEYFILEPATH,
//   scopes: SCOPES,
// });

// const drive = google.drive({ version: "v3", auth });

// export const uploadToGoogleDrive = async (fileBuffer, filename, mimetype) => {
//   try {
//     const fileMetadata = {
//       name: filename,
//       parents: "1D3v96I6xQ8Pyqj5fGbAelyoTQB1ZiwKn", // Replace with your Drive folder ID
//     };

//     const media = {
//       mimeType: mimetype,
//       body: Readable.from(fileBuffer),
//     };

//     const response = await drive.files.create({
//       requestBody: fileMetadata,
//       media: media,
//       fields: "id",
//     });

//     // Make file public
//     await drive.permissions.create({
//       fileId: response.data.id,
//       requestBody: {
//         role: "reader",
//         type: "anyone",
//       },
//     });

//     console.log("Uploaded File ID:", response.data.id);

//     const fileUrl = `https://drive.google.com/uc?id=${response.data.id}`;
//     return fileUrl;
//   } catch (error) {
//     console.error("Error uploading to Google Drive:", error);
//     throw error;
//   }
// };



import { google } from "googleapis";
import { Readable } from "stream";
import fs from "fs";
import path from "path";
import os from "os"; // ✅ Import OS module to get temp directory

// Decode Google Service Account JSON from Vercel's environment variable
const googleServiceAccount = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT, "base64").toString("utf8");

// ✅ Use OS temp directory instead of hardcoded `/tmp/`
const TEMP_DIR = os.tmpdir();
const KEYFILEPATH = path.join(TEMP_DIR, "google-drive-key.json");

// ✅ Write the key file dynamically
fs.writeFileSync(KEYFILEPATH, googleServiceAccount);

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

export const uploadToGoogleDrive = async (fileBuffer, filename, mimetype) => {
  try {
    const fileMetadata = {
      name: filename,
      parents: ["1D3v96I6xQ8Pyqj5fGbAelyoTQB1ZiwKn"], // Replace with your actual Drive folder ID
    };

    const media = {
      mimeType: mimetype,
      body: Readable.from(fileBuffer),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });

    // Make file public
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    console.log("Uploaded File ID:", response.data.id);
    return `https://drive.google.com/uc?id=${response.data.id}`;
  } catch (error) {
    console.error("Error uploading to Google Drive:", error);
    throw error;
  }
};
