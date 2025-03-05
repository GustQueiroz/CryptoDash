import Navbar from "../components/Navbar";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfileStats } from "../components/profile/ProfileStats";
import { TransactionHistory } from "../components/profile/TransactionHistory";
import { ProfileSettings } from "../components/profile/ProfileSettings";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#0B0E11]">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <ProfileHeader />
          <ProfileStats />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TransactionHistory />
            </div>
            <div>
              <ProfileSettings />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
