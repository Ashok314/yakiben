import type { MenuItem } from '../types';

const ORDER_CONSTANTS = {
  TRACKING_ID_LENGTH: 6,
  TRACKING_ID_CHARS: '23456789ABCDEFGHJKLMNPQRSTUVWXYZ',
  MIN_ORDER_AMOUNT: 500,
  MAX_ITEMS_PER_ORDER: 20,
} as const;

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: '唐揚げ弁当',
    description: '揚げたての唐揚げ、季節の野菜添え',
    price: 850,
    category: '弁当',
    image: '/assets/menu/placeholder.jpeg',
    customizations: [
      { id: '1-1', name: '大盛り', price: 100, available: true },
      { id: '1-2', name: 'ご飯少なめ', price: 0, available: true },
      { id: '1-3', name: '唐揚げ増量', price: 200, available: true }
    ],
    available: true
  },
  {
    id: '2',
    name: 'サーモン弁当',
    description: '新鮮なサーモン、わさび添え',
    price: 950,
    category: '弁当',
    image: '/assets/menu/placeholder.jpeg',
    customizations: [
      { id: '2-1', name: 'わさび抜き', price: 0, available: true },
      { id: '2-2', name: '大盛り', price: 100, available: true }
    ],
    available: true
  },
  {
    id: '3',
    name: '味噌汁',
    description: 'あっさりとした味噌仕立て',
    price: 150,
    category: 'サイド',
    image: '/assets/menu/placeholder.jpeg',
    available: true
  },
  {
    id: '4',
    name: 'お茶',
    description: '香り高い緑茶',
    price: 100,
    category: 'ドリンク',
    image: '/assets/menu/placeholder.jpeg',
    available: true
  },
  {
    id: '5',
    name: 'カレーライス',
    description: '濃厚なカレールーと特製スパイス',
    price: 800,
    category: 'カレー',
    image: '/assets/menu/placeholder.jpeg',
    customizations: [
      { id: '5-1', name: '大盛り', price: 100, available: true },
      { id: '5-2', name: '辛さ増し', price: 50, available: true },
      { id: '5-3', name: '温泉卵トッピング', price: 80, available: true }
    ],
    available: true
  },
  {
    id: '6',
    name: 'キーマカレー',
    description: 'ひき肉たっぷり、スパイシーな味わい',
    price: 850,
    category: 'カレー',
    image: '/assets/menu/placeholder.jpeg',
    customizations: [
      { id: '6-1', name: '大盛り', price: 100, available: true },
      { id: '6-2', name: '辛さ増し', price: 50, available: true }
    ],
    available: true
  },
  {
    id: '7',
    name: 'もも焼き（2本）',
    description: '塩とタレが選べる定番の焼き鳥',
    price: 300,
    category: '焼き鳥',
    image: '/assets/menu/placeholder.jpeg',
    customizations: [
      { id: '7-1', name: 'タレ', price: 0, available: true },
      { id: '7-2', name: '塩', price: 0, available: true }
    ],
    available: true
  },
  {
    id: '8',
    name: 'つくね（2本）',
    description: '特製つくね、玉子黄身添え',
    price: 350,
    category: '焼き鳥',
    image: '/assets/menu/placeholder.jpeg',
    customizations: [
      { id: '8-1', name: 'タレ', price: 0, available: true },
      { id: '8-2', name: '塩', price: 0, available: true },
      { id: '8-3', name: '玉子黄身なし', price: 0, available: true }
    ],
    available: true
  }
];

export function getCategories(): string[] {
  return Array.from(new Set(menuItems.map(item => item.category)));
}

export function getMenuItemsByCategory(category: string): MenuItem[] {
  return menuItems.filter(item => item.category === category);
}


// Generate tracking ID
export function generateTrackingId(): string {
  return Array.from({ length: ORDER_CONSTANTS.TRACKING_ID_LENGTH }, () => 
    ORDER_CONSTANTS.TRACKING_ID_CHARS.charAt(Math.floor(Math.random() * ORDER_CONSTANTS.TRACKING_ID_CHARS.length))
  ).join('');
}
