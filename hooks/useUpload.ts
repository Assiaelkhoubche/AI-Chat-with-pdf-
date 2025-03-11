"use client";

import { useState } from "react";
import { useUser } from "@/app/_context/UserContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { generateEmbeddings } from "@/action/generateEmbeding";
import { loadDocumentToGoogleDrive } from "@/action/file";

export enum StatusText {
  UPLOADING = "Uploading file...",
  UPLOADED = "File uploaded successfully.",
  SAVING = "Saving file to database...",
  GENERATING = "Generating AI Embeddings, this will only take a few seconds...",
}

export type Status = StatusText[keyof StatusText];

function useUpload() {
  const [progress, setProgress] = useState<number | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const { user } = useUser();
  const router = useRouter();

  const handleUpload = async (file: File) => {
    if (!file || !user) return;

    let fileIdUploaded;

    try {
      setStatus(StatusText.UPLOADING);
      const { fileIdGoogle, publicUrl } = await loadDocumentToGoogleDrive(file);
      fileIdUploaded = fileIdGoogle;

      setStatus(StatusText.SAVING);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);
      formData.append("fileId", fileIdUploaded!);
      formData.append("publicUrl", publicUrl);

      const response = await axios.post("/api/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total!
          );
          setProgress(percentCompleted);
        },
      });
      setStatus(StatusText.UPLOADED);

      console.log("Upload result:", response.data);

      if (!response.data.success) {
        console.log("Failed to upload File");
      }

      setStatus(StatusText.GENERATING);

      await generateEmbeddings(fileIdUploaded!);

      setFileId(fileIdUploaded!);
    } catch (err) {
      setStatus(null);
      console.error("Upload error:", err);
    }
  };

  return { handleUpload, fileId, status, progress };
}
export default useUpload;
