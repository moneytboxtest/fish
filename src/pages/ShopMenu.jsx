import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuShell } from '../components/MenuShell.jsx';
import { useGame } from '../context/GameContext.jsx';
import { shopCategories } from '../data/shopItems.js';

export function ShopMenu() {
  const navigate = useNavigate();
  const { balance, spendBalance, addEquipment, ownedEquipment } = useGame();
  const [selectedCategory, setSelectedCategory] = useState(shopCategories[0].id);
  const [message, setMessage] = useState(null);

  const activeCategory = shopCategories.find(category => category.id === selectedCategory);

  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timer = setTimeout(() => setMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [message]);

  const handleBuyItem = item => {
    const alreadyOwned = ownedEquipment.some(equipment => equipment.id === item.id);
    if (alreadyOwned) {
      setMessage({ type: 'info', text: 'Этот предмет уже куплен.' });
      return;
    }

    if (balance < item.price) {
      setMessage({ type: 'error', text: 'Недостаточно средств для покупки.' });
      return;
    }

    spendBalance(item.price);
    addEquipment(item);
    setMessage({
      type: 'success',
      text: `${item.name} добавлен в инвентарь. Бонус к редкой рыбе: +${item.rareChance}%`,
    });
  };

  return (
    <MenuShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 text-white sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => navigate('/')}
            className="self-start bg-blue-900/80 hover:bg-blue-800 transition rounded-full px-4 py-2 text-sm font-semibold"
          >
            ← На базу
          </button>
          <div className="text-left sm:text-right">
            <p className="text-sm text-sky-200">Баланс</p>
            <p className="text-2xl font-bold">{balance.toLocaleString('ru-RU')} ₽</p>
          </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 pb-8 text-white">
          <aside className="bg-white/10 border border-white/20 rounded-3xl p-4 text-white flex flex-col gap-3">
            {shopCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`text-left rounded-2xl px-4 py-3 transition font-semibold ${
                  selectedCategory === category.id
                    ? 'bg-blue-600/90 shadow-lg'
                    : 'bg-blue-900/50 hover:bg-blue-800/80'
                }`}
              >
                {category.title}
              </button>
            ))}
            <div className="mt-4 bg-black/30 border border-white/20 rounded-2xl px-4 py-3 text-sm">
              <p className="font-semibold mb-2">Купленное снаряжение</p>
              {ownedEquipment.length === 0 ? (
                <p className="text-sky-200">Пока ничего нет. Сделайте свою первую покупку!</p>
              ) : (
                <ul className="space-y-1 text-sky-100 text-sm">
                  {ownedEquipment.map(item => (
                    <li key={item.id}>• {item.name}</li>
                  ))}
                </ul>
              )}
            </div>
          </aside>

          <section className="bg-white/10 border border-white/20 rounded-3xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">{activeCategory.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCategory.items.map(item => {
                const alreadyOwned = ownedEquipment.some(eq => eq.id === item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-black/30 border border-white/20 rounded-3xl p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-contain" />
                      <div>
                        <p className="font-semibold text-lg">{item.name}</p>
                        <p className="text-sky-200 text-sm">Бонус к редкой рыбе: +{item.rareChance}%</p>
                      </div>
                    </div>
                    <p className="text-sm text-sky-100">{item.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-lg font-bold">{item.price} ₽</span>
                      <button
                        onClick={() => handleBuyItem(item)}
                        disabled={alreadyOwned}
                        className={`px-4 py-2 rounded-full font-semibold transition ${
                          alreadyOwned
                            ? 'bg-gray-400/70 text-gray-200 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 text-gray-900'
                        }`}
                      >
                        {alreadyOwned ? 'Куплено' : 'Купить'}
                      </button>
                    </div>
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
