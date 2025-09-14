export const restaurantSettings = {
  name: "Yakiben Restaurant",
  address: "123 Main Street",
  phone: "123-456-7890",
  email: "info@yakiben.com",
  hours: {
    open: "08:00",
    close: "22:00",
    orderDeadline: "21:30",
    minAdvanceTime: 30,
    maxAdvanceDays: 7,
    businessDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
};

export const menuSettings = {
  categories: ["Appetizers", "Main Course", "Desserts", "Beverages"],
  items: [
    { id: "1", name: "Spring Rolls", price: 5.99, category: "Appetizers" },
    { id: "2", name: "Grilled Chicken", price: 12.99, category: "Main Course" },
    { id: "3", name: "Ice Cream", price: 3.99, category: "Desserts" },
    { id: "4", name: "Lemonade", price: 2.99, category: "Beverages" },
  ],
};

export const sensitiveSettings = {
  orderingEnabled: true,
  paymentProcessing: "Stripe",
};
