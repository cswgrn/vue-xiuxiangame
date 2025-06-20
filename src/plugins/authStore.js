import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userId: null,
    username: null,
    playerName: null
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.userId,
    getPlayerName: (state) => state.playerName
  },
  
  actions: {
    login(userData) {
      this.userId = userData.id
      this.username = userData.username
      this.playerName = userData.player_name
    },
    updatePlayerName(newPlayerName) {
      this.playerName = newPlayerName
    },
    logout() {
      this.userId = null
      this.username = null
      this.playerName = null
    }
  },
  
  persist: {
    key: 'vuex-auth',
    paths: ['userId', 'username', 'playerName'],
    storage: localStorage
  }
})