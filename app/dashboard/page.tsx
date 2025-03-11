import Documents from "@/components/ui/Documents";

export const dynamic = "force-dynamic";

const Dashboard = () => {
  return (
    <div className="h-full max-w-7xl mx-autob pt-8">
      <h1 className="text-3xl p-5 bg-gray-100 font-extralight text-indigo-600">
        My Documents
      </h1>
      <Documents />
    </div>
  );
};

export default Dashboard;
