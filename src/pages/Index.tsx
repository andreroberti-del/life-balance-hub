import { motion } from "framer-motion";
import { useLifeBalance } from "@/hooks/useLifeBalance";
import BalanceWheel from "@/components/BalanceWheel";
import AreaSlider from "@/components/AreaSlider";
import ScoreRing from "@/components/ScoreRing";
import { RotateCcw } from "lucide-react";

const Index = () => {
  const { areas, updateArea, overallScore, resetAll } = useLifeBalance();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
              Life Balance
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Avalie e equilibre as áreas da sua vida
            </p>
          </div>
          <button
            onClick={resetAll}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-secondary"
          >
            <RotateCcw size={14} />
            Resetar
          </button>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left: Wheel + Score */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center gap-8 lg:sticky lg:top-10"
          >
            <BalanceWheel areas={areas} />
            <ScoreRing score={overallScore} />
            <p className="text-xs text-center text-muted-foreground max-w-xs">
              Ajuste os sliders para refletir seu nível de satisfação em cada área da vida.
            </p>
          </motion.div>

          {/* Right: Sliders */}
          <div className="grid sm:grid-cols-2 gap-3">
            {areas.map((area, i) => (
              <AreaSlider
                key={area.id}
                area={area}
                onUpdate={updateArea}
                index={i}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
