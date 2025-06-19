import map from '../views/mapExploration.vue'
import boss from '../views/bossPage.vue'
import home from '../views/homePage.vue'
import index from '../views/indexPage.vue'
import explore from '../views/explorePage.vue'
import cultivate from '../views/cultivatePage.vue'
import endlesstower from '../views/endlessPage.vue'
import game from '../views/game/game.vue'
import login from '../views/loginPage.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/plugins/authStore'

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: {
      keepAlive: false,
      requiresAuth: false
    },
    component: login
  },
  {
    path: '/',
    name: 'index',
    meta: {
      keepAlive: false,
      requiresAuth: true
    },
    component: index
  },
  {
    path: '/home',
    name: 'home',
    meta: {
      keepAlive: false,
      requiresAuth: true
    },
    component: home
  },
  {
    path: '/cultivate',
    name: 'cultivate',
    meta: {
      keepAlive: false,
      requiresAuth: true
    },
    component: cultivate
  },
  {
    path: '/map',
    name: 'map',
    meta: {
      keepAlive: false,
      requiresAuth: true
    },
    component: map
  },
  {
    path: '/explore',
    name: 'explore',
    meta: {
      keepAlive: false,
      requiresAuth: true
    },
    component: explore
  },
  {
    path: '/boss',
    name: 'boss',
    meta: {
      keepAlive: false,
      requiresAuth: true
    },
    component: boss
  },
  {
    path: '/endlesstower',
    name: 'endlesstower',
    meta: {
      keepAlive: false,
      requiresAuth: true
    },
    component: endlesstower
  },
  {
    path: '/game',
    name: 'game',
    meta: {
      keepAlive: false,
      requiresAuth: true
    },
    component: game
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 检查路由是否需要认证
  if (to.meta.requiresAuth) {
    // 检查用户是否已登录
    if (!authStore.isLoggedIn) { 
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
