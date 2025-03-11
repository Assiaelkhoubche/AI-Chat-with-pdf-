"use client";

import { useUser } from "@/app/_context/UserContext";
import { useEffect, useState } from "react";

const useDocument = () => {
  const { user } = useUser();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDocument();
  }, []);

  const fetchDocument = async () => {
    setIsLoading(true);
    if (!user?.id) {
      setError("User not authenticated");
      return;
    }
    try {
      const res = await fetch(`/api/documents?userId=${user.id}`);
      const data = await res.json();
      if (res.ok) {
        setDocuments(data.documents);
      }
    } catch (e) {
      setError("Failed to fetch document");
    }
    setIsLoading(false);
  };
  return { documents, error, isLoading };
};

export default useDocument;
