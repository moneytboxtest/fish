import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuShell } from '../components/MenuShell.jsx';

const seasonalTabs = [
  { id: 'daily', label: 'Ежедневные', route: '/quickquest' },
  { id: 'weekly', label: 'Еженедельные', route: '/quickquest' },
  { id: 'seasonal', label: 'Сезонные', route: '/questseason' },
];

const seasonalQuests = [
  {
    id: 1,
    title: 'Зимний марафон',
    progress: 10,
    goal: 90,
    reward: '500 руб + ящик наживки',
  },
  {
    id: 2,
    title: 'Полярный трофей',
    progress: 1,
    goal: 3,
    reward: 'Редкая удочка',
  },
  {
    id: 3,
    title: 'Морозное соревнование',
    progress: 25,
    goal: 50,
    reward: '300 руб + снегомобиль',
  },
  {
    id: 4,
    title: 'Ледяная коллекция',
    progress: 8,
    goal: 12,
    reward: 'Карта редких мест',
  },
  {
    id: 5,
    title: 'Снежный эксперт',
    progress: 0,
    goal: 5,
    reward: 'Премиальные крючки',
  },
];

export function QuestSeason() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('seasonal');

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
            <p className="text-sky-200 text-sm">Соревнуйтесь за сезонные призы</p>
            <h1 className="text-3xl font-bold">Сезонные квесты</h1>
          </div>
        </header>

        <div className="flex flex-wrap gap-3">
          {seasonalTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.route !== '/questseason') {
                  navigate(tab.route);
                }
              }}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                tab.id === activeTab ? 'bg-green-500 text-gray-900' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <section className="rounded-3xl border border-white/20 bg-white/10 p-6">
          <div className="grid grid-cols-1 gap-4">
            {seasonalQuests.map(quest => {
              const progressPercentage = Math.min(100, Math.round((quest.progress / quest.goal) * 100));

              return (
                <div
                  key={quest.id}
                  className="flex flex-col gap-3 rounded-3xl border border-white/20 bg-black/30 p-4 shadow-lg md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-lg font-semibold">{quest.title}</p>
                    <p className="text-sm text-sky-100">Прогресс: {quest.progress}/{quest.goal}</p>
                    <div className="mt-2 h-2 w-full rounded-full bg-white/15 md:w-72">
                      <div className="h-full rounded-full bg-green-400" style={{ width: `${progressPercentage}%` }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-sky-200">Награда</p>
                    <p className="text-base font-semibold text-amber-300">{quest.reward}</p>
                    <button className="mt-3 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30">
                      Забрать
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </MenuShell>
  );
}
