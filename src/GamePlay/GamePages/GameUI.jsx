import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext.jsx';
import { locationsMap } from '../../data/locations.js';
import { calculateCatchStats, rarityLabels } from '../../data/fish.js';

function useFreezeTimer(isActive, onFreeze) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return undefined;
    }

    timerRef.current = setInterval(onFreeze, 2000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, onFreeze]);

  return timerRef;
}

function rollFish(location, rareBonus) {
  if (!location?.fishDetails?.length) {
    return null;
  }

  const weights = location.fishDetails.map(fish => {
    const baseWeight = fish.chanceWeight;
    const rarityFactor = {
      common: 1,
      uncommon: 1 + rareBonus * 0.004,
      rare: 1 + rareBonus * 0.006,
      epic: 1 + rareBonus * 0.008,
      legendary: 1 + rareBonus * 0.01,
    }[fish.rarity] ?? 1;

    return Math.max(0.01, baseWeight * rarityFactor);
  });

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let roll = Math.random() * totalWeight;

  for (let index = 0; index < location.fishDetails.length; index += 1) {
    const fish = location.fishDetails[index];
    const weight = weights[index];
    if (roll < weight) {
      const stats = calculateCatchStats(fish);
      return {
        ...fish,
        ...stats,
        rarityLabel: rarityLabels[fish.rarity] ?? 'Неизвестная',
      };
    }
    roll -= weight;
  }

  const fallback = location.fishDetails.at(-1);
  if (!fallback) {
    return null;
  }
  const stats = calculateCatchStats(fallback);
  return {
    ...fallback,
    ...stats,
    rarityLabel: rarityLabels[fallback.rarity] ?? 'Неизвестная',
  };
}

export function GameUi() {
  const navigate = useNavigate();
  const {
    selectedLocationId,
    earnBalance,
    totalRareChance,
    ownedEquipment,
    tutorialSeen,
    markTutorialSeen,
    balance,
  } = useGame();

  const location = selectedLocationId ? locationsMap[selectedLocationId] : null;

  useEffect(() => {
    if (!location) {
      navigate('/gamemenu');
    }
  }, [location, navigate]);

  const [isHoleCleared, setIsHoleCleared] = useState(true);
  const [isRodCast, setIsRodCast] = useState(false);
  const [isBiting, setIsBiting] = useState(false);
  const [fillPercentage, setFillPercentage] = useState(0);
  const [caughtFish, setCaughtFish] = useState(null);
  const [showCatchModal, setShowCatchModal] = useState(false);
  const [fishNet, setFishNet] = useState([]);
  const [showNetModal, setShowNetModal] = useState(false);
  const [showTutorial, setShowTutorial] = useState(!tutorialSeen);

  const biteTimerRef = useRef(null);
  const freezeHandledRef = useRef(false);

  const handleFreezeTick = useCallback(() => {
    setFillPercentage(prev => Math.min(prev + 8, 100));
  }, []);

  useFreezeTimer(isHoleCleared, handleFreezeTick);

  useEffect(() => {
    if (!freezeHandledRef.current && fillPercentage >= 100) {
      freezeHandledRef.current = true;
      setIsHoleCleared(false);
      setIsRodCast(false);
      setIsBiting(false);
    }
  }, [fillPercentage]);

  useEffect(
    () => () => {
      if (biteTimerRef.current) {
        clearTimeout(biteTimerRef.current);
      }
    },
    [],
  );

  const equipmentSummary = useMemo(() => {
    if (!ownedEquipment.length) {
      return 'Бонусы отсутствуют';
    }
    return ownedEquipment
      .map(item => `${item.name} (+${item.rareChance}% к редкой рыбе)`)
      .join(', ');
  }, [ownedEquipment]);

  const resetBiteTimer = () => {
    if (biteTimerRef.current) {
      clearTimeout(biteTimerRef.current);
      biteTimerRef.current = null;
    }
  };

  const handleCast = () => {
    if (!isHoleCleared) {
      window.alert('Сначала нужно очистить лунку.');
      return;
    }

    setIsRodCast(true);
    setIsBiting(false);

    const baseDelay = 4000;
    const bonusReduction = Math.min(2000, totalRareChance * 20);
    const waitTime = Math.max(1500, baseDelay - bonusReduction + Math.random() * 2000);

    resetBiteTimer();
    biteTimerRef.current = setTimeout(() => {
      setIsBiting(true);
    }, waitTime);
  };

  const handleReel = () => {
    if (!isBiting) {
      window.alert('Пока нет поклёвки, подождите немного.');
      return;
    }

    const result = rollFish(location, totalRareChance);
    if (!result) {
      window.alert('Кажется, рыба сорвалась...');
      return;
    }

    setCaughtFish(result);
    setShowCatchModal(true);
    setIsRodCast(false);
    setIsBiting(false);
    resetBiteTimer();
  };

  const handleFishing = () => {
    if (!isRodCast) {
      handleCast();
    } else {
      handleReel();
    }
  };

  const handleClearHole = () => {
    if (isRodCast) {
      window.alert('Сначала вытащите удочку, затем очищайте лунку.');
      return;
    }

    resetBiteTimer();
    setIsHoleCleared(true);
    setFillPercentage(0);
    freezeHandledRef.current = false;
  };

  const closeCatchModal = () => {
    setShowCatchModal(false);
    setCaughtFish(null);
  };

  const handleSellFish = fish => {
    earnBalance(fish.price);
    closeCatchModal();
  };

  const handleKeepFish = fish => {
    setFishNet(prev => [...prev, fish]);
    closeCatchModal();
  };

  const handleReleaseFish = () => {
    closeCatchModal();
  };

  const sellFishFromNet = index => {
    setFishNet(prev => {
      const updated = [...prev];
      const [fish] = updated.splice(index, 1);
      if (fish) {
        earnBalance(fish.price);
      }
      return updated;
    });
  };

  const releaseFishFromNet = index => {
    setFishNet(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const confirmTutorial = () => {
    setShowTutorial(false);
    markTutorialSeen();
  };

  if (!location) {
    return null;
  }

  return (
    <div
      style={{ backgroundImage: `url('${location.background}')` }}
      className="flex flex-col min-h-screen bg-cover bg-center text-white"
    >
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-black/40 px-4 py-3">
        <div>
          <p className="uppercase tracking-wide text-xs text-sky-200">Локация</p>
          <h1 className="text-2xl font-bold text-white">{location.name}</h1>
          <p className="text-sm text-sky-100 max-w-xl">{location.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-blue-900/80 rounded-xl px-4 py-2 text-sm leading-tight">
            <p className="font-semibold text-white">Баланс</p>
            <p className="text-lg text-sky-200">{balance.toLocaleString('ru-RU')} ₽</p>
          </div>
          <button
            onClick={() => setShowNetModal(true)}
            className="bg-blue-900/80 hover:bg-blue-800 transition rounded-xl px-4 py-2 text-sm font-semibold"
          >
            🎣 Садок ({fishNet.length})
          </button>
          <div className="bg-blue-900/80 rounded-xl px-4 py-2 text-sm leading-tight">
            <p className="font-semibold text-white">Снаряжение</p>
            <p className="text-sky-200 max-w-xs text-xs sm:text-sm">{equipmentSummary}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-900/80 hover:bg-blue-800 transition rounded-xl px-4 py-2 text-sm font-semibold"
          >
            ⛺ На базу
          </button>
        </div>
      </header>

      <main className="relative flex-1 flex flex-col items-center justify-end pb-8">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <div className="bg-black/30 border border-white/20 rounded-2xl p-4 w-56">
            <div className="flex items-center gap-2 mb-4">
              <img src="/snow.png" width={36} height={36} alt="Обморожение" />
              <p className="font-semibold">Обморожение</p>
            </div>
            <div className="bg-white/20 border border-white/40 w-12 h-56 rounded-2xl mx-auto relative overflow-hidden">
              <div
                style={{ height: `${fillPercentage}%` }}
                className="bg-sky-500/90 w-full rounded-2xl absolute bottom-0 transition-all duration-500"
              />
            </div>
            <button
              onClick={handleClearHole}
              className="mt-4 w-full bg-blue-900/80 hover:bg-blue-800 transition rounded-xl px-3 py-2 text-sm font-semibold"
            >
              Очистить лунку
            </button>
          </div>

          <div className="relative">
            {isBiting ? (
              <img className="w-64 md:w-80" src="video/a2.gif" alt="Рыба клюёт" />
            ) : (
              <img className="w-64 md:w-80" src="video/road.png" alt="Удочка" />
            )}
            <div className="absolute -bottom-12 inset-x-0 flex justify-center">
              <button
                onClick={handleFishing}
                className="bg-blue-900/80 hover:bg-blue-800 transition rounded-2xl px-6 py-3 text-lg font-bold"
              >
                {isRodCast ? 'Подсечь' : 'Забросить'}
              </button>
            </div>
          </div>
        </div>

        <section className="bg-black/40 w-full max-w-4xl rounded-2xl px-6 py-4">
          <h2 className="text-lg font-semibold mb-3">Рыба в локации</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {location.fishDetails.map(fish => (
              <div
                key={fish.id}
                className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 flex items-center gap-2"
              >
                <img src={fish.image} alt={fish.name} className="w-12 h-12 object-contain" />
                <div>
                  <p className="font-semibold text-sm">{fish.name}</p>
                  <p className="text-xs text-sky-100">{rarityLabels[fish.rarity]}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {showCatchModal && caughtFish && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white text-gray-900 rounded-3xl shadow-xl max-w-3xl w-full overflow-hidden">
            <div className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold">Улов!</h3>
              <button onClick={closeCatchModal} className="text-2xl font-bold hover:text-sky-200">
                ×
              </button>
            </div>
            <div className="p-6 grid gap-6 md:grid-cols-[1fr_auto] items-center">
              <div className="space-y-3">
                <p className="text-xl font-semibold">{caughtFish.name}</p>
                <p className="text-lg text-sky-600">{caughtFish.rarityLabel}</p>
                <p className="text-lg">Вес: {caughtFish.weight} кг</p>
                <p className="text-lg">Цена: {caughtFish.price.toLocaleString('ru-RU')} ₽</p>
              </div>
              <img
                className="w-52 h-52 object-contain"
                src={caughtFish.image}
                alt={caughtFish.name}
              />
            </div>
            <div className="bg-slate-100 px-6 py-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => handleSellFish(caughtFish)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl px-4 py-3"
              >
                Продать ({caughtFish.price.toLocaleString('ru-RU')} ₽)
              </button>
              <button
                onClick={() => handleKeepFish(caughtFish)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-4 py-3"
              >
                В садок
              </button>
              <button
                onClick={handleReleaseFish}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-xl px-4 py-3"
              >
                Отпустить
              </button>
            </div>
          </div>
        </div>
      )}

      {showNetModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-40">
          <div className="bg-white text-gray-900 rounded-3xl shadow-xl max-w-3xl w-full overflow-hidden">
            <div className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold">Содержимое садка</h3>
              <button onClick={() => setShowNetModal(false)} className="text-2xl font-bold hover:text-sky-200">
                ×
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {fishNet.length === 0 ? (
                <p className="text-lg text-center text-gray-600">Садок пуст. Ловите рыбу и сохраняйте её здесь!</p>
              ) : (
                fishNet.map((fish, index) => (
                  <div
                    key={`${fish.id}-${index}`}
                    className="flex flex-col sm:flex-row items-center gap-4 bg-slate-100 rounded-2xl p-4"
                  >
                    <img src={fish.image} alt={fish.name} className="w-24 h-24 object-contain" />
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-lg font-semibold">{fish.name}</p>
                      <p className="text-sky-600">Вес: {fish.weight} кг</p>
                      <p className="text-sky-600">Цена: {fish.price.toLocaleString('ru-RU')} ₽</p>
                    </div>
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => sellFishFromNet(index)}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl px-4 py-2"
                      >
                        Продать
                      </button>
                      <button
                        onClick={() => releaseFishFromNet(index)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-xl px-4 py-2"
                      >
                        Отпустить
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {showTutorial && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-white text-gray-900 rounded-3xl max-w-2xl w-full overflow-hidden">
            <div className="bg-blue-900 text-white px-6 py-4">
              <h3 className="text-2xl font-bold">Добро пожаловать на рыбалку!</h3>
            </div>
            <div className="p-6 space-y-3 text-lg">
              <p>1. Очистите лунку, чтобы подготовиться к рыбалке.</p>
              <p>2. Нажмите «Забросить», чтобы закинуть снасть. Дождитесь поклёвки.</p>
              <p>3. Когда рыба клюёт — жмите «Подсечь», чтобы вытащить улов.</p>
              <p>4. Рыбу можно продать, оставить в садке или отпустить.</p>
              <p>5. Покупайте снаряжение в магазине — оно увеличивает шанс редкой рыбы.</p>
            </div>
            <div className="bg-slate-100 px-6 py-4 text-right">
              <button
                onClick={confirmTutorial}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-6 py-3"
              >
                Понятно!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
