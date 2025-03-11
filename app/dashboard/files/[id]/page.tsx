"use server";

import { authenticatedUser, getUser } from "@/action/user";
import { getPublicUrl } from "@/action/file";
import { Suspense } from "react";
import Chat from "@/components/ui/Chat";

const ChatToFilePage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const user = await authenticatedUser();
  console.log("user CatToFilePage=>", user);
  const publicUrl = await getPublicUrl(id);
  console.log("publicUrl=>", publicUrl);

  return (
    <div className="grid lg:grid-cols-5 h-screen overflow-hidden py-10">
      {/* PDF Viewer */}
      <div className="lg:col-span-3 bg-gray-100 border-r-2 border-indigo-600 flex justify-center items-center px-10">
        <Suspense
          fallback={
            <span className="loading loading-spinner loading-lg"></span>
          }
        >
          {publicUrl ? (
            <iframe
              src={publicUrl}
              id={id}
              className="w-full h-full border-none"
            ></iframe>
          ) : (
            <p className="text-center text-gray-500">Failed to load PDF...</p>
          )}
        </Suspense>
      </div>

      {/* Chat Section */}
      <div className="lg:col-span-2 flex flex-col bg-white overflow-y-auto p-4">
        <Chat id={id} user={user} />
      </div>
    </div>
  );
};

export default ChatToFilePage;
