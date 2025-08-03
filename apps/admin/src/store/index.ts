import { createStore } from 'vuex';

const store = createStore({
  state: {
    auth: {
      role: 'manager', // Example role, replace with dynamic role fetching
    },
  },
  mutations: {},
  actions: {},
  getters: {},
});

export default store;
