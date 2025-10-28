import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuShell } from '../components/MenuShell.jsx';

const questCategories = {
  daily: {
    title: 'Ежедневные квесты',
    quests: [
      {
        id: 1,
        name: 'Выловить рыбу',
        description: 'Поймайте любую рыбу',
        progress: 10,
        maxProgress: 10,
        reward: '50 руб + опыт',
        completed: true,
        icon: '🎣',
      },
      {
        id: 2,
        name: 'Ремонт снастей',
        description: 'Отремонтируйте снасти',
        progress: 1,
        maxProgress: 3,
        reward: '25 руб',
        completed: false,
        icon: '🔧',
      },
      {
        id: 3,
        name: 'Участвовать в турнире',
        description: 'Примите участие в любом турнире',
        progress: 1,
        maxProgress: 3,
        reward: '100 руб + крючки',
        completed: false,
        icon: '🏆',
      },
      {
        id: 4,
        name: 'Совершить покупку',
        description: 'Купите что-нибудь в магазине',
        progress: 1,
        maxProgress: 1,
        reward: '30 руб',
        completed: true,
        icon: '🛒',
      },
    ],
  },
  weekly: {
    title: 'Еженедельные квесты',
    quests: [
      {
        id: 1,
        name: 'Наполнить садок',
        description: 'Поймайте 25 рыб за неделю',
        progress: 11,
        maxProgress: 25,
        reward: '200 руб + наживка',
        completed: false,
        icon: '🐟',
      },
      {
        id: 2,
        name: 'Поделиться уловом',
        description: 'Поделитесь фото улова в соцсетях',
        progress: 1,
        maxProgress: 3,
        reward: '150 руб',
        completed: false,
        icon: '📸',
      },
      {
        id: 3,
        name: 'Исследовать локации',
        description: 'Посетите 5 разных мест для рыбалки',
        progress: 2,
        maxProgress: 5,
        reward: '300 руб + удочка',
        completed: false,
        icon: '🗺️',
      },
    ],
  },
  seasonal: {
    title: 'Сезонные квесты',
    quests: [
      {
        id: 1,
        name: 'Зимний рыбак',
        description: 'Поймайте 100 рыб зимой',
        progress: 45,
        maxProgress: 100,
        reward: '1000 руб + снегоход',
        completed: false,
        icon: '❄️',
      },
      {
        id: 2,
        name: 'Ледяной трофей',
        description: 'Поймайте редкую зимнюю рыбу',
        progress: 0,
        maxProgress: 1,
        reward: '500 руб + леска Premium',
        completed: false,
        icon: '🏅',
      },
      {
        id: 3,
        name: 'Мастер подледной ловли',
        description: 'Используйте все виды зимних снастей',
        progress: 2,
        maxProgress: 4,
        reward: '800 руб + крючки тройные',
        completed: false,
        icon: '🎯',
      },
    ],
  },
};

export function QuestMenu() {
  const navigate = useNavigate();
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('daily');

  const selectedCategory = useMemo(
    () => questCategories[selectedCategoryKey] ?? questCategories.daily,
    [selectedCategoryKey],
  );

  const handleClaimQuest = quest => {
    if (quest.completed) {
      window.alert(`Получена награда: ${quest.reward}`);
    } else {
      window.alert('Квест ещё не выполнен!');
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
            <p className="text-sky-200 text-sm">Выберите задания и заработайте награды</p>
            <h1 className="text-3xl font-bold">Меню квестов</h1>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 pb-10 lg:grid-cols-[220px_1fr]">
          <aside className="flex flex-col gap-3 rounded-3xl border border-white/20 bg-white/10 p-4">
            {Object.entries(questCategories).map(([key, category]) => (
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
              {selectedCategory.quests.map(quest => {
                const progressPercentage = Math.round(
                  (quest.progress / quest.maxProgress) * 100,
                );

                return (
                  <div
                    key={quest.id}
                    className={`flex flex-col gap-3 rounded-3xl border border-white/20 bg-black/30 p-4 shadow-lg transition ${
                      quest.completed ? 'ring-2 ring-green-400' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-2xl">
                        {quest.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-semibold">{quest.name}</p>
                        <p className="text-sm text-sky-100">{quest.description}</p>
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs text-sky-100">
                        <span>Прогресс</span>
                        <span>
                          {quest.progress}/{quest.maxProgress}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full ${
                            quest.completed ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-sm font-semibold text-amber-300">🎁 {quest.reward}</div>

                    <button
                      onClick={() => handleClaimQuest(quest)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        quest.completed
                          ? 'bg-green-500 text-gray-900 hover:bg-green-400'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {quest.completed ? 'Забрать награду' : `${progressPercentage}% выполнено`}
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
