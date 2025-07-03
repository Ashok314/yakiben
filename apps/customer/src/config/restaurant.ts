export const RESTAURANT_INFO = {
  name: 'やきべん',
  address: {
    postal: '100-0005',
    prefecture: '東京都',
    city: '千代田区',
    line1: '丸の内1-1-1',
  },
  phone: '03-1234-5678',
  email: 'info@yakiben.jp',
  hours: {
    open: 10, // 24-hour format
    close: 21, // 24-hour format
    orderDeadline: 20, // Last order time
    minAdvanceTime: 30, // minutes
    maxAdvanceDays: 30,
    businessDays: [0, 1, 2, 3, 4, 5], // Monday-Friday (0 = Sunday)
  },
  support: {
    phone: '03-1234-5678',
    hours: '平日 9:00-21:00',
    email: 'support@yakiben.jp'
  }
} as const;
