import { useState, useMemo } from "react";

export interface LifeArea {
  id: string;
  label: string;
  icon: string;
  value: number;
  color: string;
}

const DEFAULT_AREAS: LifeArea[] = [
  { id: "saude", label: "Saúde", icon: "💪", value: 5, color: "hsl(152, 35%, 45%)" },
  { id: "carreira", label: "Carreira", icon: "🎯", value: 5, color: "hsl(200, 50%, 60%)" },
  { id: "financas", label: "Finanças", icon: "💰", value: 5, color: "hsl(42, 70%, 55%)" },
  { id: "relacionamentos", label: "Relacionamentos", icon: "❤️", value: 5, color: "hsl(15, 60%, 65%)" },
  { id: "crescimento", label: "Crescimento Pessoal", icon: "🌱", value: 5, color: "hsl(152, 35%, 45%)" },
  { id: "diversao", label: "Diversão & Lazer", icon: "🎨", value: 5, color: "hsl(260, 30%, 70%)" },
  { id: "ambiente", label: "Ambiente Físico", icon: "🏠", value: 5, color: "hsl(185, 40%, 50%)" },
  { id: "espiritualidade", label: "Espiritualidade", icon: "✨", value: 5, color: "hsl(340, 45%, 65%)" },
];

export function useLifeBalance() {
  const [areas, setAreas] = useState<LifeArea[]>(DEFAULT_AREAS);

  const updateArea = (id: string, value: number) => {
    setAreas((prev) => prev.map((a) => (a.id === id ? { ...a, value } : a)));
  };

  const overallScore = useMemo(() => {
    const sum = areas.reduce((acc, a) => acc + a.value, 0);
    return Math.round((sum / (areas.length * 10)) * 100);
  }, [areas]);

  const resetAll = () => setAreas(DEFAULT_AREAS);

  return { areas, updateArea, overallScore, resetAll };
}
