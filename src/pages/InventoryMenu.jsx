import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuShell } from '../components/MenuShell.jsx';
import { useGame } from '../context/GameContext.jsx';
import { shopCategories } from '../data/shopItems.js';

function getEquippedSummary(equippedIds, categories) {
  const equippedNames = categories
    .map(category => {
      const equippedId = equippedIds[category.id];
      if (!equippedId) {
        return null;
      }
      const item = category.items.find(candidate => candidate.id === equippedId);
      return item ? item.name : null;
    })
    .filter(Boolean);

  if (!equippedNames.length) {
    return 'Ничего не экипировано';
  }
  return equippedNames.join(', ');
}

export function InventoryMenu() {
  const navigate = useNavigate();
  const { ownedEquipment } = useGame();
  const [selectedCategoryId, setSelectedCategoryId] = useState(shopCategories[0]?.id ?? 'rods');
  const [equippedIds, setEquippedIds] = useState({});

  const ownedIds = useMemo(() => new Set(ownedEquipment.map(item => item.id)), [ownedEquipment]);

  const categories = useMemo(
    () =>
      shopCategories.map(category => ({
        ...category,
        items: category.items.map(item => ({
          ...item,
          isOwned: ownedIds.has(item.id),
          isEquipped: equippedIds[category.id] === item.id,
        })),
      })),
    [equippedIds, ownedIds],
  );

  const selectedCategory =
    categories.find(category => category.id === selectedCategoryId) ?? categories[0];

  const equippedSummary = useMemo(
    () => getEquippedSummary(equippedIds, categories),
    [equippedIds, categories],
  );

  const handleEquip = (categoryId, itemId, isOwned) => {
    if (!isOwned) {
      return;
    }
    setEquippedIds(prev => ({ ...prev, [categoryId]: itemId }));
  };

  const handleUnequip = categoryId => {
    setEquippedIds(prev => {
      const next = { ...prev };
      delete next[categoryId];
      return next;
    });
  };

  return (
    <MenuShell>
      <div className="flex flex-col gap-8 text-white">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => navigate('/')}
            className="self-start rounded-full bg-blue-900/80 px-4 py-2 text-sm font-semibold transition hover:bg-blue-800"
          >
            ← На базу
          </button>
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm shadow-lg backdrop-blur">
            <p className="text-sky-200">Экипировано</p>
            <p className="text-base font-semibold">{equippedSummary}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 pb-10 lg:grid-cols-[240px_1fr]">
          <aside className="flex flex-col gap-3 rounded-3xl border border-white/20 bg-white/10 p-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className={`rounded-2xl px-4 py-3 text-left font-semibold transition ${
                  selectedCategoryId === category.id
                    ? 'bg-blue-600/90 shadow-lg'
                    : 'bg-blue-900/50 hover:bg-blue-800/80'
                }`}
              >
                {category.title}
              </button>
            ))}
          </aside>

          <section className="flex flex-col gap-5 rounded-3xl border border-white/20 bg-white/10 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedCategory?.title}</h2>
                <p className="text-sm text-sky-100">
                  Выберите предмет, чтобы экипировать его перед выходом на лёд.
                </p>
              </div>
              {selectedCategory && equippedIds[selectedCategory.id] && (
                <button
                  onClick={() => handleUnequip(selectedCategory.id)}
                  className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/30"
                >
                  Снять экипировку
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {selectedCategory?.items.map(item => (
                <div
                  key={item.id}
                  className={`flex flex-col gap-4 rounded-3xl border border-white/20 bg-black/30 p-4 transition ${
                    item.isEquipped ? 'ring-2 ring-sky-400' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 flex-shrink-0 object-contain"
                    />
                    <div className="flex flex-col gap-1">
                      <p className="text-lg font-semibold">{item.name}</p>
                      <p className="text-xs text-sky-200">Бонус к редкой рыбе: +{item.rareChance}%</p>
                    </div>
                  </div>

                  <p className="flex-1 text-sm text-sky-100">{item.description}</p>

                  <div className="flex flex-col gap-2">
                    {item.isOwned ? (
                      <button
                        onClick={() => handleEquip(selectedCategory.id, item.id, item.isOwned)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          item.isEquipped
                            ? 'bg-green-500 text-gray-900 hover:bg-green-400'
                            : 'bg-blue-500 text-gray-900 hover:bg-blue-400'
                        }`}
                      >
                        {item.isEquipped ? 'Экипировано' : 'Экипировать'}
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate('/shop')}
                        className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/30"
                      >
                        Купить в магазине
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </MenuShell>
  );
}
