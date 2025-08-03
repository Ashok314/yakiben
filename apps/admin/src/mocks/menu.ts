import type { MenuItem } from '../types/types';

export const MOCK_MENU_ITEMS: MenuItem[] = [
  { id: '1', name: 'Sushi Roll', price: 12.99, category: 'Sushi', description: 'Delicious sushi rolls.', imageUrl: '/public/images/sushi-roll.jpg', outOfStock: false },
  { id: '2', name: 'Ramen Bowl', price: 9.99, category: 'Noodles', description: 'Hot and tasty ramen.', imageUrl: '/public/images/ramen-bowl.jpg', outOfStock: false },
  { id: '3', name: 'Tempura', price: 8.99, category: 'Appetizers', description: 'Crispy tempura.', imageUrl: '/public/images/tempura.jpg', outOfStock: true },
];

export const categoriesApi = {
  async getCategories(): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return ['Sushi', 'Noodles', 'Appetizers', 'Desserts'];
  },
};
