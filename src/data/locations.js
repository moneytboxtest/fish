import { fishCatalog } from './fish.js';

export const locations = [
  {
    id: 'icy-lake',
    name: 'Ледяное озеро',
    description: 'Спокойное озеро с прозрачным льдом и рыбой, прячущейся под корягами.',
    difficulty: 'Новичок',
    background: '/lunka.jpg',
    fishTable: [
      { fishId: 'perch', weight: 25 },
      { fishId: 'crucian', weight: 20 },
      { fishId: 'roach', weight: 18 },
      { fishId: 'bream', weight: 15 },
      { fishId: 'pike', weight: 12 },
      { fishId: 'zander', weight: 10 },
    ],
  },
  {
    id: 'north-river',
    name: 'Северная река',
    description: 'Быстрое течение и глубокие ямы. Здесь водится крупный хищник.',
    difficulty: 'Опытный',
    background: '/lunka1.jpg',
    fishTable: [
      { fishId: 'pike', weight: 18 },
      { fishId: 'zander', weight: 16 },
      { fishId: 'burbot', weight: 14 },
      { fishId: 'grayling', weight: 10 },
      { fishId: 'catfish', weight: 8 },
      { fishId: 'salmon', weight: 4 },
      { fishId: 'trout', weight: 6 },
      { fishId: 'ide', weight: 8 },
    ],
  },
  {
    id: 'mountain-lake',
    name: 'Горное озеро',
    description: 'Хрустальная вода и редкие виды рыбы, требующие особой сноровки.',
    difficulty: 'Профессионал',
    background: '/lunka.jpg',
    fishTable: [
      { fishId: 'trout', weight: 18 },
      { fishId: 'grayling', weight: 16 },
      { fishId: 'sterlet', weight: 10 },
      { fishId: 'salmon', weight: 6 },
      { fishId: 'perch', weight: 12 },
      { fishId: 'bream', weight: 8 },
      { fishId: 'pike', weight: 6 },
      { fishId: 'carp', weight: 10 },
    ],
  },
];

export const locationsMap = locations.reduce((acc, location) => {
  acc[location.id] = {
    ...location,
    fishDetails: location.fishTable
      .map(entry => {
        const fish = fishCatalog[entry.fishId];
        if (!fish) return null;
        return { ...fish, chanceWeight: entry.weight };
      })
      .filter(Boolean),
  };
  return acc;
}, {});
