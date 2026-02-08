export const RESTAURANT_INFO = {
  name: '',
  address: {
    postal: '',
    prefecture: '',
    city: '',
    line1: '',
  },
  phone: '',
  email: '',
  hours: {
    open: 0,
    close: 0,
    orderDeadline: 0,
    minAdvanceTime: 30, // Default safety
    maxAdvanceDays: 0,
    businessDays: [],
  }
} as const;
