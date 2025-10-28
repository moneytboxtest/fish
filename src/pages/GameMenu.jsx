import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuShell } from '../components/MenuShell.jsx';
import { useGame } from '../context/GameContext.jsx';
import { locations, locationsMap } from '../data/locations.js';
import { rarityLabels } from '../data/fish.js';

export function GameMenu() {
  const navigate = useNavigate();
  const { selectedLocationId, setLocation } = useGame();
  const [focusedLocationId, setFocusedLocationId] = useState(
    selectedLocationId ?? locations[0].id,
  );

  const focusedLocation = useMemo(
    () => locationsMap[focusedLocationId] ?? locationsMap[locations[0].id],
    [focusedLocationId],
  );

  const fishChances = useMemo(() => {
    if (!focusedLocation) {
      return [];
    }
    const totalWeight = focusedLocation.fishDetails.reduce(
      (sum, fish) => sum + fish.chanceWeight,
      0,
    );
    return focusedLocation.fishDetails.map(fish => ({
      ...fish,
      chance: Math.round((fish.chanceWeight / totalWeight) * 100),
    }));
  }, [focusedLocation]);

  const handleTravel = () => {
    setLocation(focusedLocation.id);
    navigate('/game');
  };

  return (
    <MenuShell>
      <div className="flex flex-col gap-8 text-white">
        <button
          onClick={() => navigate('/')}
          className="self-start bg-blue-900/80 hover:bg-blue-800 transition rounded-full px-4 py-2 text-white font-semibold"
        >
          ← На базу
        </button>

        <header className="text-white">
          <h1 className="text-3xl font-bold mb-2">Выбор локации</h1>
          <p className="text-sky-200 text-lg max-w-3xl">
            Подберите подходящее место для рыбалки. Каждая локация имеет свой набор рыбы и уровень сложности.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 pb-8">
          <aside className="bg-white/10 border border-white/20 rounded-3xl p-4 flex flex-col gap-3 text-white">
            {locations.map(location => (
              <button
                key={location.id}
                onClick={() => setFocusedLocationId(location.id)}
                className={`text-left rounded-2xl px-4 py-3 transition font-semibold ${
                  focusedLocationId === location.id
                    ? 'bg-blue-600/90 shadow-lg'
                    : 'bg-blue-900/50 hover:bg-blue-800/80'
                }`}
              >
                <p className="text-sm uppercase tracking-wide text-sky-200">{location.difficulty}</p>
                <p className="text-xl">{location.name}</p>
              </button>
            ))}
          </aside>

          <section className="bg-white/10 border border-white/20 rounded-3xl p-6 text-white flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{focusedLocation.name}</h2>
              <p className="text-sky-100 text-base">{focusedLocation.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Обитатели водоёма</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {fishChances.map(fish => (
                  <div
                    key={fish.id}
                    className="bg-black/30 border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3"
                  >
                    <img
                      src={fish.image}
                      alt={fish.name}
                      className="w-14 h-14 object-contain"
                    />
                    <div>
                      <p className="text-base font-semibold">{fish.name}</p>
                      <p className="text-sm text-sky-200">{rarityLabels[fish.rarity]}</p>
                      <p className="text-xs text-sky-100">Шанс поймать: {fish.chance}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/30 border border-white/20 rounded-2xl px-5 py-4">
              <div>
                <p className="text-sky-200 text-sm">Рекомендуемый уровень</p>
                <p className="text-lg font-semibold">{focusedLocation.difficulty}</p>
              </div>
              <button
                onClick={handleTravel}
                className="bg-green-500 hover:bg-green-600 text-gray-900 font-semibold rounded-full px-6 py-3"
              >
                Поехать на рыбалку
              </button>
            </div>
          </section>
        </div>
      </div>
    </MenuShell>
  );
}
