import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuShell } from '../components/MenuShell.jsx';

const initialFish = [
  {
    id: 1,
    name: 'Карп обыкновенный',
    weight: 1.2,
    length: 35,
    rarity: 'common',
    price: 45,
    image: 'icon/9.png',
    location: 'Городской пруд',
    caughtTime: '2 часа назад',
  },
  {
    id: 2,
    name: 'Щука',
    weight: 2.8,
    length: 58,
    rarity: 'rare',
    price: 120,
    image: 'icon/9.png',
    location: 'Река',
    caughtTime: '1 час назад',
  },
  {
    id: 3,
    name: 'Окунь',
    weight: 0.8,
    length: 22,
    rarity: 'common',
    price: 25,
    image: 'icon/9.png',
    location: 'Городской пруд',
    caughtTime: '3 часа назад',
  },
  {
    id: 4,
    name: 'Судак',
    weight: 1.9,
    length: 45,
    rarity: 'rare',
    price: 95,
    image: 'icon/9.png',
    location: 'Река',
    caughtTime: '30 минут назад',
  },
  {
    id: 5,
    name: 'Лещ',
    weight: 1.5,
    length: 38,
    rarity: 'common',
    price: 60,
    image: 'icon/9.png',
    location: 'Озеро',
    caughtTime: '4 часа назад',
  },
  {
    id: 6,
    name: 'Форель радужная',
    weight: 1.1,
    length: 32,
    rarity: 'epic',
    price: 180,
    image: 'icon/9.png',
    location: 'Горное озеро',
    caughtTime: '1 час назад',
  },
  {
    id: 7,
    name: 'Сом',
    weight: 4.5,
    length: 78,
    rarity: 'legendary',
    price: 450,
    image: 'icon/9.png',
    location: 'Река',
    caughtTime: '6 часов назад',
  },
];

const rarityConfig = {
  common: {
    label: 'Обычная',
    badge: 'bg-slate-100/80 text-slate-800',
    ring: 'ring-slate-400/70',
  },
  rare: {
    label: 'Редкая',
    badge: 'bg-sky-100/80 text-sky-800',
    ring: 'ring-sky-400/70',
  },
  epic: {
    label: 'Эпическая',
    badge: 'bg-purple-100/80 text-purple-800',
    ring: 'ring-purple-400/70',
  },
  legendary: {
    label: 'Легендарная',
    badge: 'bg-amber-100/80 text-amber-800',
    ring: 'ring-amber-400/70',
  },
};

export function SellMenu() {
  const navigate = useNavigate();
  const [fishInCage, setFishInCage] = useState(initialFish);
  const [balance, setBalance] = useState(1000);

  const totalValue = useMemo(
    () => fishInCage.reduce((sum, fish) => sum + fish.price, 0),
    [fishInCage],
  );

  const handleSellFish = fish => {
    setFishInCage(prev => prev.filter(item => item.id !== fish.id));
    setBalance(prev => prev + fish.price);
    window.alert(`Продано: ${fish.name} за ${fish.price} руб.`);
  };

  const handleSellAll = () => {
    if (!fishInCage.length) {
      window.alert('Садок пуст!');
      return;
    }

    const sum = fishInCage.reduce((acc, fish) => acc + fish.price, 0);
    setFishInCage([]);
    setBalance(prev => prev + sum);
    window.alert(`Продано ${fishInCage.length} рыб на сумму ${sum} руб.`);
  };

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
            <p className="text-sky-200 text-sm">Реализуйте улов и пополните баланс</p>
            <h1 className="text-3xl font-bold">Скупка рыбы</h1>
          </div>
        </header>

        <section className="flex flex-col gap-4 rounded-3xl border border-white/20 bg-white/10 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-black/30 p-4">
              <p className="text-sm text-sky-200">Текущий баланс</p>
              <p className="text-2xl font-bold">{balance.toLocaleString('ru-RU')} ₽</p>
            </div>
            <div className="rounded-2xl bg-black/30 p-4">
              <p className="text-sm text-sky-200">Рыб в садке</p>
              <p className="text-2xl font-bold">{fishInCage.length}</p>
            </div>
            <div className="rounded-2xl bg-black/30 p-4">
              <p className="text-sm text-sky-200">Потенциальная выручка</p>
              <p className="text-2xl font-bold">{totalValue.toLocaleString('ru-RU')} ₽</p>
            </div>
          </div>
          <button
            onClick={handleSellAll}
            disabled={!fishInCage.length}
            className={`w-full rounded-full px-4 py-3 text-sm font-semibold transition ${
              fishInCage.length
                ? 'bg-green-500 text-gray-900 hover:bg-green-400'
                : 'bg-white/20 text-white'
            }`}
          >
            Продать всё
          </button>
        </section>

        <section className="rounded-3xl border border-white/20 bg-white/10 p-6">
          {fishInCage.length === 0 ? (
            <p className="py-12 text-center text-lg text-sky-100">
              Садок пуст. Отправляйтесь на рыбалку и возвращайтесь с уловом!
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {fishInCage.map(fish => {
                const rarity = rarityConfig[fish.rarity] ?? rarityConfig.common;
                return (
                  <div
                    key={fish.id}
                    className={`flex flex-col gap-3 rounded-3xl border border-white/20 bg-black/30 p-4 ring-2 ${
                      rarity.ring
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                        <img src={fish.image} alt={fish.name} className="h-14 w-14 object-contain" />
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-semibold">{fish.name}</p>
                        <p className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${rarity.badge}`}>
                          {rarity.label}
                        </p>
                      </div>
                      <div className="text-right text-lg font-bold text-amber-300">
                        {fish.price.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-sky-100">
                      <p>Вес: {fish.weight} кг</p>
                      <p>Длина: {fish.length} см</p>
                      <p>Локация: {fish.location}</p>
                      <p>Поймана: {fish.caughtTime}</p>
                    </div>

                    <button
                      onClick={() => handleSellFish(fish)}
                      className="rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-green-400"
                    >
                      Продать
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </MenuShell>
  );
}
