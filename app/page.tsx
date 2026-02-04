import Scene from "@/components/Scene";
import PlayerControls from "@/components/PlayerControls";
import GameMenu from "@/components/GameMenu";

export default function Home() {
  return (
    <main className="h-screen w-full relative overflow-hidden bg-slate-50">
      <Scene />
      <GameMenu />
      <PlayerControls />
    </main>
  );
}
