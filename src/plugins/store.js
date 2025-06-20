import { defineStore } from 'pinia'
import crypto from '@/plugins/crypto'
import { useAuthStore } from '@/plugins/authStore'

export const useMainStore = defineStore('main', {
  state: () => ({
    // boss属性
    boss: {
      name: '',
      text: '',
      time: 0,
      desc: '',
      level: 0,
      dodge: 0,
      attack: 0,
      health: 0,
      conquer: false,
      defense: 0,
      critical: 0,
      maxhealth: 0
    },
    // 玩家属性
    player: {
      zc: false,
      age: 1,
      pet: {},
      time: 0,
      name: '玩家',
      dark: false,
      npcs: [],
      wife: {},
      pets: [],
      wifes: [],
      props: {
        money: 0,
        flying: 0,
        qingyuan: 0,
        rootBone: 0,
        currency: 0,
        cultivateDan: 0,
        strengtheningStone: 0
      },
      score: 0,
      level: 0,
      dodge: 0,
      points: 0,
      attack: 10,
      health: 100,
      critical: 0,
      defense: 10,
      taskNum: 0,
      version: 0.8,
      currency: 0,
      maxHealth: 100,
      inventory: [],
      isNewbie: false,
      shopData: [],
      equipment: {
        sutra: {},
        armor: {},
        weapon: {},
        accessory: {}
      },
      achievement: {
        pet: [],
        monster: [],
        equipment: []
      },
      script: '',
      cultivation: 0,
      currentTitle: null,
      reincarnation: 0,
      maxCultivation: 100,
      backpackCapacity: 50,
      sellingEquipmentData: [],
      highestTowerFloor: 1,
      rewardedTowerFloors: [],
      nextGameTimes: {
        rps: null,
        dice: null,
        fortune: null,
        secretrealm: 0,
        gamblingStone: null
      },
      gameWins: 0,
      gameLosses: 0,
      checkinDays: 0,
      checkinStreak: 0,
      lastCheckinDate: null,
      fortuneTellingDate: null,
      checkedInToday: false
    },
    // 怪物信息
    monster: {
      name: '',
      // 气血
      health: 0,
      // 攻击
      attack: 0,
      // 防御
      defense: 0,
      // 闪避率
      dodge: 0,
      // 暴击
      critical: 0
    },
    mapData: {
      y: 0,
      x: 0,
      map: []
    },
    mapScroll: 0,
    fishingMap: []
  }),
  actions: {
    updatePlayerName(name) {
      this.player.name = name
    },
    initializePlayer(playerName) {
      const name = playerName || this.player.name || '玩家'
      
      // 重置玩家数据到初始状态
      this.$reset()
      
      // 设置名字
      this.player.name = name
    },
    syncPlayerNameFromAuth() {
      // 在 action 内部获取 authStore
      const authStore = useAuthStore()
      if (authStore.playerName) {
        this.player.name = authStore.playerName
      }
    }
  },
  persist: {
    key: 'vuex',
    paths: ['boss', 'player'],
    storage: localStorage,
    serializer: {
      serialize: state => {
        return JSON.stringify({
          boss: crypto.encryption(state.boss),
          player: crypto.encryption(state.player)
        })
      },
      deserialize: value => {
        const state = JSON.parse(value)
        return {
          boss: crypto.decryption(state.boss),
          player: crypto.decryption(state.player)
        }
      }
    }
  }
})