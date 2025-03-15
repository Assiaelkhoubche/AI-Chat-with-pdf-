"use client";
import { useUser } from "@/app/_context/UserContext";
import { useEffect, useState } from "react";
import useDocument from "./useDocument";

const PRO_LIMIT = 20;
const FREE_LIMIT = 2;
const useSubscription = () => {
  const [hasAciveMembership, setHasAciveMembership] = useState<boolean | null>(
    null
  );
  const [isOverFileLimit, setIsOverFileLimit] = useState(false);
  const { user } = useUser();
  const { documents, isLoading, error } = useDocument();
  useEffect(() => {
    if (!user) return;
    setHasAciveMembership(user.hasAciveMembership!);
  }, [user]);

  useEffect(() => {
    if (!documents || hasAciveMembership === null) return;
    const files = documents.length;
    const userLimit = hasAciveMembership ? PRO_LIMIT : FREE_LIMIT;

    setIsOverFileLimit(files >= userLimit);
  }, [documents, hasAciveMembership, PRO_LIMIT, FREE_LIMIT]);

  return { hasAciveMembership, isOverFileLimit, isLoading, error };
};

export default useSubscription;
