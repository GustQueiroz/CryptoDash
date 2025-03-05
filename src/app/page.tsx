import Navbar from "./components/Navbar";
import DashboardWrapper from "./components/DashboardWrapper";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0c1013] text-white">
      <Navbar />
      <DashboardWrapper />
    </div>
  );
}
