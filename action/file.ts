"use server";
import { Readable } from "stream";
import { google } from "googleapis";
import oauth2Client from "@/lib/googleDrive";
import { authenticatedUser } from "./user";
import { Document } from "@/lib/models/Document";
import { get } from "http";
import connectDB from "@/lib/db";

export const loadDocumentToGoogleDrive = async (file: File) => {
  await authenticatedUser();

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const bufferToStream = (buffer: Buffer) => {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  };

  const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
  });

  const fileMetadata = {
    name: file.name,
    mimeType: file.type,
  };

  try {
    const driveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: file.type,
        body: bufferToStream(buffer),
      },
      fields: "id",
    });

    if (driveResponse.data && driveResponse.data.id) {
      const fileIdGoogle = driveResponse.data.id;
      await drive.permissions.create({
        fileId: fileIdGoogle,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });

      const publicUrl = `https://drive.google.com/file/d/${fileIdGoogle}/preview`;

      console.log(
        "......Uploaded file to Google Drive successfully",
        driveResponse.data.id
      );
      return { fileIdGoogle, publicUrl };
    } else {
      console.log("......Failed to upload file to Google Drive");
    }
  } catch (err) {
    console.log("........Error creating file in Google Drive", err);
  }
};

export const getPublicUrl = async (docId: string) => {
  await authenticatedUser();
  try {
    const doc = await Document.findOne({ fileId: docId });
    if (!doc) {
      console.log("No document found with this id ", docId);
    }
    return doc.publicUrl;
  } catch (err) {
    console.log("Error getting public url=>: ", err);
  }
};

export const deleteFile = async (docId: string) => {
  const user = await authenticatedUser();
  await connectDB();
  try {
    const res = await Document.deleteOne({ fileId: docId, userId: user.id });
    console.log("res=>", res);
  } catch (err) {
    console.log("Error deleting file=>: ", err);
  }
};
