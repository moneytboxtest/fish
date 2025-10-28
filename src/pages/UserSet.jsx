import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuShell } from '../components/MenuShell.jsx';

const avatars = ['vite.svg', 'иконки/3.png', 'иконки/2.png', 'иконки/4.png'];

export function UserSet() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('Player #200');
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

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
            <p className="text-sky-200 text-sm">Персонализируйте профиль</p>
            <h1 className="text-3xl font-bold">Настройки профиля</h1>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
          <div className="flex flex-col gap-4 rounded-3xl border border-white/20 bg-white/10 p-6">
            <h2 className="text-xl font-semibold">Аватар</h2>
            <div className="grid grid-cols-2 gap-3">
              {avatars.map(avatar => (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`flex items-center justify-center rounded-2xl border-2 bg-black/30 p-3 transition ${
                    selectedAvatar === avatar ? 'border-green-400' : 'border-transparent hover:border-white/50'
                  }`}
                >
                  <img src={avatar} alt="avatar" className="h-16 w-16 object-contain" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl border border-white/20 bg-white/10 p-6">
            <h2 className="text-xl font-semibold">Информация</h2>
            <label className="flex flex-col gap-2 text-sm text-sky-100">
              Никнейм
              <input
                type="text"
                value={nickname}
                onChange={event => setNickname(event.target.value)}
                className="rounded-2xl border border-white/20 bg-black/30 px-4 py-2 text-white focus:border-sky-400 focus:outline-none"
              />
            </label>
            <button className="mt-2 self-start rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-green-400">
              Сохранить изменения
            </button>

            <div className="mt-4 rounded-2xl bg-black/30 p-4 text-sm text-sky-100">
              <h3 className="mb-2 text-base font-semibold text-white">Статистика</h3>
              <p className="flex justify-between">Турниров: <span>10</span></p>
              <p className="flex justify-between">Максимальный улов: <span>3.28 кг</span></p>
              <p className="flex justify-between">Любимая рыба: <span>Карп</span></p>
              <p className="flex justify-between">Максимальная выручка: <span>5 000 ₽</span></p>
            </div>
          </div>
        </section>
      </div>
    </MenuShell>
  );
}
