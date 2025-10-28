import { useNavigate } from 'react-router-dom';
import { MenuShell } from '../components/MenuShell.jsx';

const leaderboard = [
  { id: 1, name: 'Охотник на омаров', score: 15820, catches: 312, rank: 1 },
  { id: 2, name: 'Player #200', score: 14270, catches: 298, rank: 2 },
  { id: 3, name: 'HotFish', score: 12640, catches: 274, rank: 3 },
  { id: 4, name: 'Зимний волк', score: 11890, catches: 251, rank: 4 },
  { id: 5, name: 'Ледокол', score: 11010, catches: 232, rank: 5 },
];

export function RaitMenu() {
  const navigate = useNavigate();

  return (
    <MenuShell>
      <div className="flex flex-col gap-8 text-white">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => navigate('/')}
            className="self-start rounded-full bg-blue-900/80 px-4 py-2 text-sm font-semibold transition hover:bg-blue-800"
          >
            ← На базу
          </button>
          <div className="text-left sm:text-right">
            <p className="text-sky-200 text-sm">Лучшие рыбаки сезона</p>
            <h1 className="text-3xl font-bold">Рейтинг игроков</h1>
          </div>
        </header>

        <section className="rounded-3xl border border-white/20 bg-white/10 p-6">
          <div className="grid grid-cols-1 gap-4">
            {leaderboard.map(player => (
              <div
                key={player.id}
                className="flex flex-col gap-4 rounded-3xl border border-white/20 bg-black/30 p-4 shadow-lg md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/30 text-xl font-bold">
                    {player.rank}
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{player.name}</p>
                    <p className="text-sm text-sky-100">Поймано рыб: {player.catches}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-sky-200">Очки сезона</p>
                  <p className="text-2xl font-bold text-green-300">{player.score.toLocaleString('ru-RU')}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MenuShell>
  );
}
