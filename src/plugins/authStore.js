import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userId: null,
    username: null
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.userId
  },
  
  actions: {
    login(userId, username) {
      this.userId = userId
      this.username = username
    },
    
    logout() {
      this.userId = null
      this.username = null
    }
  },
  
  persist: {
    key: 'vuex-auth',
    paths: ['userId', 'username'],
    storage: localStorage
  }
})