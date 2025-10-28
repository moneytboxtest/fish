import { useGame } from '../context/GameContext.jsx';

export function InfoBar() {
  const { balance } = useGame();

  return (
    <div className="relative App">
      <video autoPlay loop muted className="w-full h-full object-cover">
        <source src="/video/mbg.mp4" type="video/mp4" />
      </video>

      <div className="flex absolute top-1 left-1 pl-2 pr-4 py-1 justify-start items-center rounded-r-2xl gap-2 bg-blue-900/90">
        <div className="border-2 border-white rounded-full p-1.5 bg-blue-500/40">
          <img src="vite.svg" width={28} height={28} alt="avatar" />
        </div>
        <div className="flex flex-col leading-tight">
          <p className="text-white font-bold text-sm sm:text-base">Player #200</p>
          <p className="text-sky-100 text-xs sm:text-sm">Готов к рыбалке</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-white font-bold absolute top-1 right-1 pl-3 pr-5 py-1 rounded-l-2xl bg-blue-900/90">
        <img className="h-8 w-8" src="иконки/6.png" alt="coins" />
        <p className="text-sm sm:text-base">{balance.toLocaleString('ru-RU')} ₽</p>
      </div>
    </div>
  );
}
