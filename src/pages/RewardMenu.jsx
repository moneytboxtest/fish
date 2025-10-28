import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuShell } from '../components/MenuShell.jsx';

const rewardsList = [
  {
    id: 1,
    name: 'Бонус за регистрацию',
    reward: '100 руб + Деревянная удочка',
    image: 'icon/6.png',
    description: 'Спасибо за регистрацию в игре!',
    canClaim: true,
    requirement: null,
  },
  {
    id: 2,
    name: 'Подписка на канал',
    reward: '200 руб + Наживка',
    image: 'icon/6.png',
    description: 'Подпишитесь на наш канал и получите награду',
    canClaim: true,
    requirement: null,
  },
  {
    id: 3,
    name: 'Лайк в группе VK',
    reward: '50 руб',
    image: 'icon/6.png',
    description: 'Поставьте лайк нашей группе ВКонтакте',
    canClaim: true,
    requirement: null,
  },
  {
    id: 4,
    name: 'Приведи друга',
    reward: '300 руб + Крючки',
    image: 'icon/6.png',
    description: 'Пригласите друга в игру',
    canClaim: false,
    requirement: 'Друг должен достичь 5 уровня',
  },
  {
    id: 5,
    name: 'Ежедневный вход',
    reward: '25 руб',
    image: 'icon/6.png',
    description: 'Ежедневная награда за вход в игру',
    canClaim: false,
    requirement: 'Зайдите в игру завтра',
  },
  {
    id: 6,
    name: 'Первая покупка',
    reward: '150 руб + Леска',
    image: 'icon/6.png',
    description: 'Совершите первую покупку в магазине',
    canClaim: false,
    requirement: 'Купите любой предмет в магазине',
  },
  {
    id: 7,
    name: 'Оценка в магазине',
    reward: '75 руб',
    image: 'icon/6.png',
    description: 'Оцените игру в магазине приложений',
    canClaim: true,
    requirement: null,
  },
  {
    id: 8,
    name: 'Поделиться игрой',
    reward: '100 руб',
    image: 'icon/6.png',
    description: 'Поделитесь игрой в социальных сетях',
    canClaim: true,
    requirement: null,
  },
];

export function RewardsMenu() {
  const navigate = useNavigate();
  const [claimedRewards, setClaimedRewards] = useState(() => new Set());

  const rewards = useMemo(
    () =>
      rewardsList.map(reward => ({
        ...reward,
        claimed: claimedRewards.has(reward.id),
      })),
    [claimedRewards],
  );

  const handleClaimReward = reward => {
    if (!reward.canClaim || reward.claimed) {
      return;
    }
    setClaimedRewards(prev => new Set(prev).add(reward.id));
    window.alert(`Получена награда: ${reward.reward}`);
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
            <p className="text-sky-200 text-sm">Забирайте бонусы за активность</p>
            <h1 className="text-3xl font-bold">Награды</h1>
          </div>
        </header>

        <section className="rounded-3xl border border-white/20 bg-white/10 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {rewards.map(reward => (
              <div
                key={reward.id}
                className={`flex flex-col gap-4 rounded-3xl border border-white/20 bg-black/30 p-4 transition ${
                  reward.claimed ? 'opacity-75 ring-2 ring-green-400/50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                    <img src={reward.image} alt={reward.name} className="h-12 w-12 object-contain" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold">{reward.name}</p>
                    <p className="text-sm text-sky-100">{reward.description}</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-amber-100/80 px-4 py-2 text-sm font-semibold text-amber-800">
                  🎁 {reward.reward}
                </div>

                {reward.requirement && !reward.canClaim && !reward.claimed && (
                  <div className="rounded-2xl bg-orange-100/80 px-3 py-2 text-sm text-orange-800">
                    📋 {reward.requirement}
                  </div>
                )}

                <button
                  onClick={() => handleClaimReward(reward)}
                  disabled={!reward.canClaim || reward.claimed}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    reward.claimed
                      ? 'bg-gray-400 text-gray-700'
                      : reward.canClaim
                        ? 'bg-green-500 text-gray-900 hover:bg-green-400'
                        : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {reward.claimed
                    ? '✓ Награда получена'
                    : reward.canClaim
                      ? 'Получить награду'
                      : 'Требования не выполнены'}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MenuShell>
  );
}
