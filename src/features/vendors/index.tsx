import Header from "@/features/vendors/components/header";
import ProfileCard from "./components/profile-card";
import VendorsPage from "./components/vendors";

export default function FindProfessionalsPage() {
  return (
    <main className="container max-w-7xl mx-auto px-4">
      <Header />
      <VendorsPage />
    </main>
  );
}
