import { Button } from "@/components/ui/button";
import Link from "next/link";
import { features } from "./_utils/data";

export default function Home() {
  return (
    <main className="flex-1 overflow-scroll p-2 lg:p-5 bg-gradient-to-bl ■from-white to-indigo-600">
      <div className="bg-white py-24 sm:py-32 rounded-md drop-shadow-xl">
        <div className="flex flex-col justify-center items-center mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2
              className="text-base font-semibold leading-7 
              text-indigo-600"
            >
              Your Interactive Document Companion
            </h2>
            <p
              className="mt-2 text-3xl font-bold tracking-tight 
              ☐ text-gray-900 sm:text-6xl"
            >
              Transform Your PDFs into Interactive Conversations
            </p>
            <p>
              Introducing{" "}
              <span className="font-bold text-indigo-600">Chat with PDF.</span>
              <br />
              <br /> Upload your document, and our chatbot will answer
              questions, summarize content, and answer all your Qs. Ideal for
              everyone, <span className="text-indigo-608">Chat with PDF</span>
              {""}
              turns static documents into{" "}
              <span className="font-bold">dynamic conversations</span>,
              enhancing productivity 10x fold effortlessly.
            </p>
          </div>

          <Button className="mt-10">
            <Link href="/dashboard">Get Started</Link>
          </Button>

          <div className="mt-4">
            <img
              alt="App screenshot"
              src="https://i.imgur.com/VciRSTI.jpeg"
              width={2432}
              height={1442}
              className="mb-[-0%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
            />
          </div>

          <div className="mt-16">
            <div
              className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 
                text-gray-600 sm:grid-cols-2 
                lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8xlg:gap-y-16"
            >
              {features.map((feature, i) => (
                <div className="relative pl-9" key={i}>
                  <div className="inline font-semibold text-gray-900">
                    <feature.icon
                      aria-hidden="true"
                      className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                    />
                  </div>
                  <div>{feature.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
