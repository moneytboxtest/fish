export const tournaments = [
  {
    id: 'speed',
    name: 'Турнир на скорость',
    description: 'Поймайте как можно больше рыбы за ограниченное время.',
    icon: '⚡',
    timeLeft: '2 дня 14 часов',
    entryFee: 50,
    status: 'active',
    participants: 156,
    maxParticipants: 200,
    prizes: [
      { place: '1 место', reward: '1000 ₽ + Золотая удочка' },
      { place: '2 место', reward: '500 ₽ + Серебряная удочка' },
      { place: '3 место', reward: '250 ₽ + Бронзовая удочка' },
      { place: '4-10 место', reward: '100 ₽ + набор наживки' },
    ],
    tasks: [
      {
        id: 'speed-catch-total',
        title: 'Разогреться',
        description: 'Поймайте 10 любых рыб в режиме турнира.',
        type: 'catch_total',
        goal: 10,
        reward: 150,
      },
      {
        id: 'speed-rare-chain',
        title: 'Редкая полоса',
        description: 'Поймайте 3 редких или лучше рыб.',
        type: 'catch_rarity',
        rarities: ['rare', 'epic', 'legendary'],
        goal: 3,
        reward: 220,
      },
    ],
  },
  {
    id: 'weight',
    name: 'Турнир на вес',
    description: 'Цель — поймать самую тяжёлую рыбу.',
    icon: '⚖️',
    timeLeft: '5 дней 8 часов',
    entryFee: 100,
    status: 'active',
    participants: 89,
    maxParticipants: 150,
    prizes: [
      { place: '1 место', reward: '2000 ₽ + Профессиональная удочка' },
      { place: '2 место', reward: '1000 ₽ + Углепластиковая удочка' },
      { place: '3 место', reward: '500 ₽ + Крючки тройные' },
      { place: '4-10 место', reward: '200 ₽ + Леска Premium' },
    ],
    tasks: [
      {
        id: 'weight-heavy-hunter',
        title: 'Охотник за трофеями',
        description: 'Поймайте 5 рыб весом более 3 кг.',
        type: 'catch_weight',
        minWeight: 3,
        goal: 5,
        reward: 260,
      },
      {
        id: 'weight-epic',
        title: 'Эпический улов',
        description: 'Поймайте 2 эпические или легендарные рыбы.',
        type: 'catch_rarity',
        rarities: ['epic', 'legendary'],
        goal: 2,
        reward: 320,
      },
    ],
  },
  {
    id: 'quantity',
    name: 'Турнир на количество',
    description: 'Максимум рыбы за один день!',
    icon: '🐟',
    timeLeft: '1 день 3 часа',
    entryFee: 30,
    status: 'ending_soon',
    participants: 234,
    maxParticipants: 300,
    prizes: [
      { place: '1 место', reward: '800 ₽ + Снегоход' },
      { place: '2 место', reward: '400 ₽ + Наживка х50' },
      { place: '3 место', reward: '200 ₽ + Крючки х20' },
      { place: '4-15 место', reward: '50 ₽ + Опыт х2' },
    ],
    tasks: [
      {
        id: 'quantity-burst',
        title: 'Серийная ловля',
        description: 'Поймайте 12 рыб за участие в турнире.',
        type: 'catch_total',
        goal: 12,
        reward: 180,
      },
      {
        id: 'quantity-keepers',
        title: 'Выборочный улов',
        description: 'Поймайте 4 необычные или редкие рыбы.',
        type: 'catch_rarity',
        rarities: ['uncommon', 'rare', 'epic', 'legendary'],
        goal: 4,
        reward: 240,
      },
    ],
  },
];

export const tournamentTaskMap = tournaments
  .flatMap(tournament => tournament.tasks)
  .reduce((acc, task) => {
    acc[task.id] = { ...task };
    return acc;
  }, {});

export const tournamentTasksByTournament = tournaments.reduce((acc, tournament) => {
  acc[tournament.id] = tournament.tasks.map(task => task.id);
  return acc;
}, {});
