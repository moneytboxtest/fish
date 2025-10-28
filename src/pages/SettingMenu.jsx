import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuShell } from '../components/MenuShell.jsx';

const toggleOptions = [
  {
    id: 'fullscreen',
    label: 'Полноэкранный режим',
    description: 'Автоматически разворачивать игру при запуске',
  },
  {
    id: 'hints',
    label: 'Подсказки по геймплею',
    description: 'Показывать советы во время рыбалки',
  },
  {
    id: 'notifications',
    label: 'Уведомления о событиях',
    description: 'Получать напоминания о турнирах и заданиях',
  },
];

export function SettingMenu() {
  const navigate = useNavigate();
  const [volume, setVolume] = useState(60);
  const [music, setMusic] = useState(70);
  const [toggles, setToggles] = useState(() => ({
    fullscreen: true,
    hints: true,
    notifications: false,
  }));

  const handleToggle = id => {
    setToggles(prev => ({ ...prev, [id]: !prev[id] }));
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
            <p className="text-sky-200 text-sm">Настройте игру под себя</p>
            <h1 className="text-3xl font-bold">Настройки</h1>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-3xl border border-white/20 bg-white/10 p-6">
            <h2 className="text-xl font-semibold">Звук</h2>
            <div>
              <div className="flex items-center justify-between text-sm text-sky-100">
                <span>Громкость интерфейса</span>
                <span className="font-semibold text-white">{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={event => setVolume(Number(event.target.value))}
                className="mt-2 w-full cursor-pointer accent-sky-400"
              />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm text-sky-100">
                <span>Громкость музыки</span>
                <span className="font-semibold text-white">{music}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={music}
                onChange={event => setMusic(Number(event.target.value))}
                className="mt-2 w-full cursor-pointer accent-sky-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl border border-white/20 bg-white/10 p-6">
            <h2 className="text-xl font-semibold">Интерфейс</h2>
            {toggleOptions.map(option => (
              <label
                key={option.id}
                className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl bg-black/30 p-4 transition hover:bg-black/40"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{option.label}</p>
                  <p className="text-xs text-sky-100">{option.description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={toggles[option.id] ?? false}
                  onChange={() => handleToggle(option.id)}
                  className="h-5 w-5 rounded border-white/40 bg-transparent accent-sky-400"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/20 bg-white/10 p-6">
          <h2 className="text-xl font-semibold">Управление</h2>
          <p className="mt-2 text-sm text-sky-100">
            Используйте мышь или сенсорное управление для очистки лунки и подсечки рыбы. Клавиши 1-3 переключают быстрые
            наборы снастей.
          </p>
          <div className="mt-4 grid gap-3 text-sm text-sky-100 md:grid-cols-2">
            <p>␣ Пробел — подсечь рыбу</p>
            <p>R — обновить снаряжение</p>
            <p>M — включить/выключить музыку</p>
            <p>Esc — открыть меню паузы</p>
          </div>
        </section>
      </div>
    </MenuShell>
  );
}
