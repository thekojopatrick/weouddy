import { vendorsData } from './dummy-data';
import Marketplace from './components/marketplace';

export default function FindProfessionalsPage() {
  return (
    <main className="container max-w-7xl mx-auto px-4 min-h-screen">
      <Marketplace vendors={vendorsData} />
    </main>
  );
}
