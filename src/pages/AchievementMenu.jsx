import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuShell } from '../components/MenuShell.jsx';

const achievementCategories = {
  global: {
    title: 'Глобальные достижения',
    achievements: [
      {
        id: 1,
        name: 'Первый улов',
        description: 'Поймайте первую рыбу',
        progress: 1,
        maxProgress: 1,
        reward: 'Значок новичка',
        completed: true,
        icon: 'icon/9.png',
        rarity: 'common',
      },
      {
        id: 2,
        name: 'Коллекционер',
        description: 'Поймайте 50 разных видов рыб',
        progress: 23,
        maxProgress: 50,
        reward: 'Золотой значок + 500 руб',
        completed: false,
        icon: 'icon/4.png',
        rarity: 'epic',
      },
      {
        id: 3,
        name: 'Рыбак-легенда',
        description: 'Поймайте 1000 рыб',
        progress: 456,
        maxProgress: 1000,
        reward: 'Легендарная удочка',
        completed: false,
        icon: 'icon/9.png',
        rarity: 'legendary',
      },
      {
        id: 4,
        name: 'Торговец',
        description: 'Потратьте 10000 рублей в магазине',
        progress: 3450,
        maxProgress: 10000,
        reward: 'Скидка 20% навсегда',
        completed: false,
        icon: 'icon/2.png',
        rarity: 'rare',
      },
      {
        id: 5,
        name: 'Исследователь',
        description: 'Посетите все локации',
        progress: 8,
        maxProgress: 12,
        reward: 'Карта сокровищ',
        completed: false,
        icon: 'icon/2.png',
        rarity: 'epic',
      },
    ],
  },
  local: {
    title: 'Локальные достижения',
    achievements: [
      {
        id: 1,
        name: 'Хозяин пруда',
        description: 'Поймайте 100 рыб в городском пруду',
        progress: 100,
        maxProgress: 100,
        reward: 'Ключ от пруда',
        completed: true,
        icon: 'icon/9.png',
        rarity: 'rare',
      },
      {
        id: 2,
        name: 'Покоритель реки',
        description: 'Поймайте крупную рыбу в реке',
        progress: 3,
        maxProgress: 5,
        reward: 'Речная удочка',
        completed: false,
        icon: 'icon/5.png',
        rarity: 'common',
      },
      {
        id: 3,
        name: 'Морской волк',
        description: 'Поймайте редкую морскую рыбу',
        progress: 0,
        maxProgress: 1,
        reward: 'Морская леска + 1000 руб',
        completed: false,
        icon: 'icon/7.png',
        rarity: 'legendary',
      },
      {
        id: 4,
        name: 'Озерный мастер',
        description: 'Поймайте 25 рыб в горном озере',
        progress: 18,
        maxProgress: 25,
        reward: 'Горные крючки',
        completed: false,
        icon: 'icon/4.png',
        rarity: 'rare',
      },
      {
        id: 5,
        name: 'Ночной охотник',
        description: 'Поймайте рыбу ночью в болоте',
        progress: 1,
        maxProgress: 10,
        reward: 'Ночная наживка',
        completed: false,
        icon: 'icon/2.png',
        rarity: 'epic',
      },
    ],
  },
};

const rarityStyle = {
  common: {
    card: 'border-slate-300/70 bg-slate-100/70',
    bar: 'bg-slate-500',
    badge: 'bg-slate-200 text-slate-700',
  },
  rare: {
    card: 'border-sky-400/70 bg-sky-100/70',
    bar: 'bg-sky-500',
    badge: 'bg-sky-200 text-sky-700',
  },
  epic: {
    card: 'border-purple-400/70 bg-purple-100/70',
    bar: 'bg-purple-500',
    badge: 'bg-purple-200 text-purple-700',
  },
  legendary: {
    card: 'border-amber-400/70 bg-amber-100/70',
    bar: 'bg-amber-500',
    badge: 'bg-amber-200 text-amber-700',
  },
};

export function AchievementMenu() {
  const navigate = useNavigate();
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('global');

  const selectedCategory = useMemo(
    () => achievementCategories[selectedCategoryKey] ?? achievementCategories.global,
    [selectedCategoryKey],
  );

  const handleClaimAchievement = achievement => {
    if (achievement.completed) {
      window.alert(`Получена награда: ${achievement.reward}`);
    } else {
      window.alert('Достижение ещё не получено!');
    }
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
            <p className="text-sky-200 text-sm">Соберите коллекцию наград</p>
            <h1 className="text-3xl font-bold">Достижения</h1>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 pb-10 lg:grid-cols-[220px_1fr]">
          <aside className="flex flex-col gap-3 rounded-3xl border border-white/20 bg-white/10 p-4">
            {Object.entries(achievementCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategoryKey(key)}
                className={`rounded-2xl px-4 py-3 text-left font-semibold transition ${
                  key === selectedCategoryKey
                    ? 'bg-blue-600/90 shadow-lg'
                    : 'bg-blue-900/50 hover:bg-blue-800/80'
                }`}
              >
                {category.title}
              </button>
            ))}
          </aside>

          <section className="flex flex-col gap-4 rounded-3xl border border-white/20 bg-white/10 p-6">
            <h2 className="text-2xl font-bold">{selectedCategory.title}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {selectedCategory.achievements.map(achievement => {
                const progressPercentage = Math.round(
                  (achievement.progress / achievement.maxProgress) * 100,
                );
                const styles = rarityStyle[achievement.rarity] ?? rarityStyle.common;

                return (
                  <div
                    key={achievement.id}
                    className={`flex flex-col gap-3 rounded-3xl border-2 p-4 text-gray-900 shadow-lg ${
                      styles.card
                    } ${achievement.completed ? 'ring-2 ring-green-400/80' : ''}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80">
                        <img src={achievement.icon} alt={achievement.name} className="h-12 w-12 object-contain" />
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-gray-900">{achievement.name}</p>
                        <p className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles.badge}`}>
                          {achievement.completed ? 'Получено' : 'В процессе'}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700">{achievement.description}</p>

                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
                        <span>Прогресс</span>
                        <span>
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/60">
                        <div
                          className={`h-full rounded-full ${styles.bar}`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl bg-amber-100/80 px-3 py-2 text-sm font-semibold text-amber-800">
                      🎁 {achievement.reward}
                    </div>

                    <button
                      onClick={() => handleClaimAchievement(achievement)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        achievement.completed
                          ? 'bg-green-500 text-white hover:bg-green-400'
                          : 'bg-white/60 text-gray-800 hover:bg-white'
                      }`}
                    >
                      {achievement.completed ? 'Забрать награду' : `${progressPercentage}% выполнено`}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </MenuShell>
  );
}
