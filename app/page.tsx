import Scene from "@/components/Scene";
import PlayerControls from "@/components/PlayerControls";


export default function Home() {
  return (
    <main className="h-screen w-full relative overflow-hidden bg-slate-50">
      <Scene />
      <PlayerControls />
    </main>
  );
}
