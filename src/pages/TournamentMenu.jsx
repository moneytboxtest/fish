import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InfoBar } from '../components/InfoBar.jsx';
import { useGame } from '../context/GameContext.jsx';
import {
  tournaments,
  tournamentTaskMap,
  tournamentTasksByTournament,
} from '../data/tournaments.js';

const statusStyles = {
  active: {
    badge: 'bg-green-200 text-green-800',
    card: 'border-green-400/80 bg-green-500/10',
  },
  ending_soon: {
    badge: 'bg-orange-200 text-orange-800',
    card: 'border-orange-400/80 bg-orange-500/10',
  },
  ended: {
    badge: 'bg-gray-200 text-gray-700',
    card: 'border-gray-400/80 bg-gray-500/10',
  },
  default: {
    badge: 'bg-blue-200 text-blue-800',
    card: 'border-blue-400/80 bg-blue-500/10',
  },
};

export function TournamentMenu() {
  const navigate = useNavigate();
  const {
    balance,
    spendBalance,
    earnBalance,
    joinTournament,
    joinedTournaments,
    tournamentTaskProgress,
    claimTournamentTask,
  } = useGame();

  const [activeTab, setActiveTab] = useState('tournaments');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timer = setTimeout(() => setMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [message]);

  const handleJoinTournament = tournament => {
    if (joinedTournaments.includes(tournament.id)) {
      setMessage({ type: 'info', text: `Вы уже участвуете в «${tournament.name}».` });
      return;
    }

    if (tournament.status !== 'active' && tournament.status !== 'ending_soon') {
      setMessage({ type: 'error', text: 'Турнир сейчас недоступен для участия.' });
      return;
    }

    if (balance < tournament.entryFee) {
      setMessage({ type: 'error', text: 'Недостаточно средств для вступительного взноса.' });
      return;
    }

    spendBalance(tournament.entryFee);
    joinTournament(tournament.id, tournamentTasksByTournament[tournament.id]);
    setMessage({
      type: 'success',
      text: `Вы записались в «${tournament.name}». Удачной рыбалки!`,
    });
  };

  const handleClaimReward = task => {
    const progress = tournamentTaskProgress[task.id];
    if (!progress || progress.progress < task.goal) {
      setMessage({ type: 'error', text: 'Задание ещё не выполнено.' });
      return;
    }

    if (progress.claimed) {
      setMessage({ type: 'info', text: 'Награда уже получена.' });
      return;
    }

    claimTournamentTask(task.id);
    earnBalance(task.reward);
    setMessage({
      type: 'success',
      text: `Награда за «${task.title}» получена: +${task.reward.toLocaleString('ru-RU')} ₽`,
    });
  };

  const joinedTasks = useMemo(() => {
    return joinedTournaments
      .map(id => tournaments.find(tournament => tournament.id === id))
      .filter(Boolean)
      .flatMap(tournament =>
        tournament.tasks.map(task => ({
          ...task,
          tournamentName: tournament.name,
          progress: tournamentTaskProgress[task.id]?.progress ?? 0,
          claimed: tournamentTaskProgress[task.id]?.claimed ?? false,
        })),
      );
  }, [joinedTournaments, tournamentTaskProgress]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <InfoBar />
      <div className="absolute inset-0 -z-20 bg-cover bg-center" style={{ backgroundImage: "url('/background/mb.jpg')" }} aria-hidden />
      <div className="absolute inset-0 -z-10 bg-slate-950/75 backdrop-blur" aria-hidden />

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-32 pb-12 flex flex-col gap-6 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/')}
              className="bg-blue-900/80 hover:bg-blue-800 transition rounded-full px-4 py-2 text-sm font-semibold"
            >
              ← На базу
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="bg-blue-900/80 hover:bg-blue-800 transition rounded-full px-4 py-2 text-sm font-semibold"
            >
              🛒 Снаряжение
            </button>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-sky-200">Баланс</p>
            <p className="text-2xl font-bold">{balance.toLocaleString('ru-RU')} ₽</p>
          </div>
        </div>

        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Турниры и задания</h1>
          <p className="text-sky-200 max-w-3xl">
            Участвуйте в сезонных турнирах, выполняйте задания и зарабатывайте награды. Весь прогресс сохраняется даже после выхода из игры.
          </p>
        </header>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab('tournaments')}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              activeTab === 'tournaments'
                ? 'bg-green-500 text-gray-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            🏆 Турниры
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              activeTab === 'tasks'
                ? 'bg-green-500 text-gray-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            📋 Задания
          </button>
        </div>

        {message && (
          <div
            className={`rounded-2xl px-4 py-3 text-white shadow-lg ${
              message.type === 'success'
                ? 'bg-green-600/80'
                : message.type === 'error'
                  ? 'bg-red-600/80'
                  : 'bg-blue-600/80'
            }`}
          >
            {message.text}
          </div>
        )}

        {activeTab === 'tournaments' ? (
          <div className="grid grid-cols-1 gap-5">
            {tournaments.map(tournament => {
              const style = statusStyles[tournament.status] ?? statusStyles.default;
              const isJoined = joinedTournaments.includes(tournament.id);
              const progressPercent = Math.min(
                100,
                Math.round((tournament.participants / tournament.maxParticipants) * 100),
              );

              return (
                <div
                  key={tournament.id}
                  className={`rounded-3xl border px-6 py-5 shadow-lg ${style.card}`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-white/40 bg-black/30 text-3xl">
                      {tournament.icon}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-white">{tournament.name}</h2>
                          <div className="mt-1 flex items-center gap-2 text-sm">
                            <span className={`rounded-full px-2 py-1 ${style.badge}`}>
                              {tournament.status === 'active'
                                ? '🟢 Активен'
                                : tournament.status === 'ending_soon'
                                  ? '🟡 Скоро завершится'
                                  : '🔴 Завершён'}
                            </span>
                            <span className="text-sky-100">⏰ {tournament.timeLeft}</span>
                            <span className="text-sky-100">💰 {tournament.entryFee.toLocaleString('ru-RU')} ₽</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleJoinTournament(tournament)}
                          disabled={tournament.status === 'ended' || isJoined}
                          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                            isJoined
                              ? 'bg-white/20 text-white cursor-default'
                              : tournament.status === 'ending_soon'
                                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                : tournament.status === 'ended'
                                  ? 'bg-gray-500/50 text-gray-200 cursor-not-allowed'
                                  : 'bg-green-500 hover:bg-green-600 text-gray-900'
                          }`}
                        >
                          {isJoined ? '✅ Вы участвуете' : '🎣 Принять участие'}
                        </button>
                      </div>

                      <p className="text-sm text-sky-100/90 md:max-w-3xl">{tournament.description}</p>

                      <div className="space-y-4">
                        <div>
                          <div className="mb-1 flex items-center justify-between text-xs text-sky-100">
                            <span>Участников</span>
                            <span className="font-semibold">
                              {tournament.participants.toLocaleString('ru-RU')}/
                              {tournament.maxParticipants.toLocaleString('ru-RU')}
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-white/20">
                            <div
                              className="h-2 rounded-full bg-green-400"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>

                        <div className="rounded-2xl border border-yellow-300/60 bg-yellow-200/10 p-4 text-sm text-yellow-100">
                          <h3 className="mb-2 font-semibold text-yellow-200">🏆 Призы</h3>
                          <div className="grid gap-1 sm:grid-cols-2">
                            {tournament.prizes.map(prize => (
                              <div key={`${tournament.id}-${prize.place}`} className="flex justify-between gap-2">
                                <span className="font-semibold text-yellow-100">{prize.place}</span>
                                <span className="text-right text-yellow-50">{prize.reward}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {joinedTasks.length === 0 ? (
              <div className="rounded-3xl border border-white/20 bg-white/10 px-6 py-8 text-center text-sky-100">
                <p className="text-lg font-semibold mb-2">Пока нет активных заданий</p>
                <p className="text-sm text-sky-200">
                  Примите участие в любом турнире, чтобы открыть доступ к его заданиям и начать зарабатывать награды.
                </p>
              </div>
            ) : (
              joinedTasks.map(task => {
                const progressRatio = task.goal > 0 ? task.progress / task.goal : 0;
                const progressPercent = Math.min(100, Math.round(progressRatio * 100));
                const taskInfo = tournamentTaskMap[task.id];

                return (
                  <div
                    key={task.id}
                    className="rounded-3xl border border-white/20 bg-white/10 px-6 py-5 shadow-lg"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-sky-200">{task.tournamentName}</p>
                        <h3 className="text-xl font-semibold text-white">{task.title}</h3>
                        <p className="text-sm text-sky-100/90">{task.description}</p>
                      </div>
                      <div className="text-right text-sm text-sky-100">
                        <p>
                          Награда:{' '}
                          <span className="font-semibold text-green-300">
                            {task.reward.toLocaleString('ru-RU')} ₽
                          </span>
                        </p>
                        {taskInfo?.type === 'catch_weight' && taskInfo?.minWeight ? (
                          <p className="text-xs text-sky-200/80">Зачёт с веса от {taskInfo.minWeight} кг</p>
                        ) : null}
                        {taskInfo?.type === 'catch_rarity' && taskInfo?.rarities ? (
                          <p className="text-xs text-sky-200/80">
                            Подходит рыба: {taskInfo.rarities.map(rarity => rarity.toUpperCase()).join(', ')}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-xs text-sky-200">
                        <span>Прогресс</span>
                        <span>
                          {task.progress}/{task.goal}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/15">
                        <div
                          className="h-2 rounded-full bg-green-400"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-sky-200">
                        Выполняйте задания во время рыбалки — прогресс обновляется автоматически.
                      </p>
                      <button
                        onClick={() => handleClaimReward(task)}
                        disabled={task.claimed || task.progress < task.goal}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                          task.claimed
                            ? 'bg-white/20 text-white cursor-default'
                            : task.progress < task.goal
                              ? 'bg-gray-500/50 text-gray-200 cursor-not-allowed'
                              : 'bg-green-500 hover:bg-green-600 text-gray-900'
                        }`}
                      >
                        {task.claimed ? '✅ Награда получена' : 'Забрать награду'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
