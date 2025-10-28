import { useGame } from '../context/GameContext.jsx';

export function InfoBar() {
  const { balance } = useGame();

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 -z-30 overflow-hidden"
        aria-hidden
      >
        <video autoPlay loop muted playsInline className="h-full w-full object-cover">
          <source src="/video/mbg.mp4" type="video/mp4" />
        </video>
      </div>

      <div
        className="pointer-events-none fixed inset-0 -z-20 bg-slate-950/35 backdrop-blur-sm"
        aria-hidden
      />

      <div className="fixed top-3 left-3 z-30 flex items-center gap-2 rounded-r-2xl bg-blue-900/90 px-3 py-2 shadow-lg">
        <div className="border-2 border-white rounded-full p-1.5 bg-blue-500/40">
          <img src="vite.svg" width={32} height={32} alt="avatar" />
        </div>
        <div className="flex flex-col leading-tight text-left">
          <p className="text-white font-bold text-sm sm:text-base">Player #200</p>
          <p className="text-sky-100 text-xs sm:text-sm">Готов к рыбалке</p>
        </div>
      </div>

      <div className="fixed top-3 right-3 z-30 flex items-center gap-2 rounded-l-2xl bg-blue-900/90 px-4 py-2 text-white shadow-lg">
        <img className="h-9 w-9" src="иконки/6.png" alt="coins" />
        <p className="text-sm sm:text-base font-bold">{balance.toLocaleString('ru-RU')} ₽</p>
      </div>
    </>
  );
}
