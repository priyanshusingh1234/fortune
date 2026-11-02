import RetroComputerHero from "@/components/RetroComputerHero";
import FortuneQuestMap from "@/components/FortuneQuestMap";
import FortuneFaq from "@/components/FortuneFaq";
import FortuneFooter from "@/components/FortuneFooter";

// main entry page where all the chaos comes together
export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f1e1] text-[#181926]">
      <RetroComputerHero />
      <FortuneQuestMap />
      <FortuneFaq />
      <FortuneFooter />
    </main>
  );
}
