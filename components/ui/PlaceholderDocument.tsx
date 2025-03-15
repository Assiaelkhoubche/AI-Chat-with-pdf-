"use client";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { PlusCircleIcon } from "lucide-react";
import useSubscription from "@/hooks/useSubscription";

const PlaceholderDocument = () => {
  const router = useRouter();
  const { isOverFileLimit } = useSubscription();

  const handleClick = () => {
    if (isOverFileLimit) {
      router.push("/dashboard/upgrade");
    } else {
      router.push("/dashboard/upload");
    }
  };
  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className=" bg-slate-200 text-gray-400 flex flex-col items-centerw-64 h-40 rounded-xl drop-shadow-md "
    >
      <PlusCircleIcon className="h-16 w-16" />
      <p>Add a document</p>
    </Button>
  );
};

export default PlaceholderDocument;
