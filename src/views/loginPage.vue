<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">我的文字修仙全靠刷</h2>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名（英文+数字）" prefix-icon="User" size="large" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock" size="large"
            @keyup.enter="handleLogin" />
        </el-form-item>
        <el-form-item>
          <el-button class="login-button" type="primary" size="large" :loading="loading" @click="handleLogin">
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 设置玩家昵称的对话框 -->
    <el-dialog v-model="showPlayerNameDialog" title="设置游戏昵称" width="400px" :close-on-click-modal="false"
      :close-on-press-escape="false" :show-close="false">
      <el-form ref="playerNameFormRef" :model="playerNameForm" :rules="playerNameRules">
        <el-form-item prop="playerName">
          <el-input v-model="playerNameForm.playerName" placeholder="请输入游戏昵称" maxlength="10" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" :loading="creating" @click="handleCreateUser">
          {{ creating ? '创建中...' : '确定' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 欢迎页面 -->
    <div v-if="showWelcome" class="welcome-overlay">
      <div class="welcome-content">
        <h2>欢迎回来</h2>
        <h3>{{ welcomePlayerName }}</h3>
        <div class="loading-spinner">
          <el-icon class="is-loading" :size="40">
            <Loading />
          </el-icon>
          <p>正在加载游戏数据...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/plugins/store'
import { ElMessage } from 'element-plus'
import { xiuxianApi } from '@/api' // 导入封装的API

const router = useRouter()
const store = useMainStore()

const loading = ref(false)
const creating = ref(false)
const showPlayerNameDialog = ref(false)
const showWelcome = ref(false)
const welcomePlayerName = ref('')
const loginFormRef = ref()
const playerNameFormRef = ref()

const loginForm = reactive({
  username: '',
  password: ''
})

const playerNameForm = reactive({
  playerName: ''
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]+$/, message: '用户名只能包含英文和数字', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const playerNameRules = {
  playerName: [
    { required: true, message: '请输入游戏昵称', trigger: 'blur' },
    { min: 1, max: 10, message: '昵称长度在 1 到 10 个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      // 使用封装的API
      const response = await xiuxianApi.login({
        username: loginForm.username,
        password: loginForm.password
      })

      const { data } = response

      if (data.exists) {
        // 用户存在，显示欢迎页面
        store.userId = data.user.id
        store.username = data.user.username
        store.player.name = data.user.player_name
        welcomePlayerName.value = data.user.player_name
        showWelcome.value = true

        // 如果有存档数据，恢复存档
        if (data.save_data) {
          try {
            const saveData = JSON.parse(data.save_data)
            // 恢复玩家数据
            Object.assign(store.player, saveData.player)
            // 恢复boss数据
            if (saveData.boss) {
              Object.assign(store.boss, saveData.boss)
            }
          } catch (e) {
            console.error('存档数据解析失败', e)
            ElMessage.warning('存档数据解析失败，将使用默认数据')
          }
        }

        // 延迟跳转，显示欢迎动画
        setTimeout(() => {
          // 检查是否有重定向参数
          const redirect = route.query.redirect || '/home'
          router.push(redirect)
        }, 1200)
      } else {
        // 用户不存在，显示创建玩家对话框
        showPlayerNameDialog.value = true
      }
    } catch (error) {
      console.error('登录失败', error)
      // 错误消息已在拦截器中处理，这里可以做额外处理
    } finally {
      loading.value = false
    }
  })
}

const handleCreateUser = async () => {
  await playerNameFormRef.value.validate(async (valid) => {
    if (!valid) return

    creating.value = true
    try {
      // 使用封装的API
      const response = await xiuxianApi.register({
        username: loginForm.username,
        password: loginForm.password,
        playerName: playerNameForm.playerName
      })

      const { data } = response

      // 保存用户信息
      store.userId = data.user.id
      store.username = data.user.username
      store.player.name = data.user.player_name

      ElMessage.success('账号创建成功！')
      showPlayerNameDialog.value = false

      // 跳转到游戏首页
      router.push('/home')
    } catch (error) {
    } finally {
      creating.value = false
    }
  })
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 400px;
  max-width: 90%;
}

.login-title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
}

.login-form {
  width: 100%;
}

.login-button {
  width: 100%;
}

.welcome-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.welcome-content {
  text-align: center;
  color: white;
}

.welcome-content h2 {
  font-size: 36px;
  margin-bottom: 10px;
}

.welcome-content h3 {
  font-size: 24px;
  margin-bottom: 30px;
  color: #ffd700;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.loading-spinner p {
  font-size: 16px;
  opacity: 0.8;
}
</style>