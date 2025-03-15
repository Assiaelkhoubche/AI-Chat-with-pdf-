"use client";
import { useUser } from "@/app/_context/UserContext";
import axios from "axios";
import React, { useEffect, useState, useTransition } from "react";
import { Button } from "./button";
import { documentFetched } from "@/types/type";
import { useRouter } from "next/navigation";
import { DownloadCloud, Trash2Icon } from "lucide-react";
import useSubscription from "@/hooks/useSubscription";
import { deleteFile } from "@/action/file";

const ExistDocument = () => {
  const [documents, setDocuments] = useState([]);
  const { hasAciveMembership } = useSubscription();
  const { user } = useUser();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchedDocuments();
  }, []);

  const fetchedDocuments = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`/api/documents?userId=${user.id}`);
      console.log("res documents=>:", res.data.documents);
      setDocuments(res.data.documents);
    } catch (err) {
      console.log("error fetching documents=>:", err);
    }
  };
  const handleClick = (document: documentFetched) => {
    router.push(`/dashboard/files/${document.fileId}`);
  };
  return (
    <div
      className="flex flex-row gap-3
    "
    >
      {documents.map((document: documentFetched) => (
        <div
          key={document.fileId}
          className=" flex flex-col w-60 h-50 justify-between rounded-xl  drop-shadow-md bg-white
                      p-4 transition-all transform hover:scale-105 hover:bg-indigo-600 hover:text-white
                      cursor-pointer group
                      "
        >
          <div onClick={() => handleClick(document)}>
            <p className="font-semibold line-clamp-2">{document.name}</p>
          </div>

          {/* Download Button */}
          <div className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              disabled={!hasAciveMembership || isPending}
              onClick={() => {
                const prompt = window.confirm(
                  "Are you sure you want to delete this document?"
                );
                if (prompt) {
                  startTransition(async () => {
                    await deleteFile(document.fileId!);
                    const updatedDocuments = documents.filter(
                      (doc: documentFetched) => doc.fileId !== document.fileId
                    );
                    setDocuments(updatedDocuments);
                  });
                }
              }}
            >
              <Trash2Icon className="h-5 w-5 text-red-500" />
              {!hasAciveMembership && (
                <p className="text-red-500 ml-2">PRO Feature</p>
              )}
            </Button>
            <Button variant="outline" asChild>
              <a
                href={`https://drive.google.com/file/d/${document.fileId}/view?usp=sharing`}
                target="_blank"
                rel="noreferrer"
              >
                <DownloadCloud className="h-5 w-5 text-indigo-600" />
              </a>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExistDocument;
