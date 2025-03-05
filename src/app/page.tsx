import Navbar from "./components/Navbar";
import DashboardWrapper from "./components/DashboardWrapper";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <DashboardWrapper />
    </div>
  );
}
