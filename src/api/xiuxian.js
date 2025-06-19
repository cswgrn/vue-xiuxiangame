import request from './request'

// 修仙相关API
const xiuxianApi = {
  /**
   * 用户登录
   * @param {Object} data - 登录信息
   * @param {string} data.username - 用户名
   * @param {string} data.password - 密码
   * @returns {Promise}
   */
  login(data) {
    return request({
      url: '/xiuxian/login',
      method: 'post',
      data
    })
  },

  /**
   * 注册新用户
   * @param {Object} data - 注册信息
   * @param {string} data.username - 用户名
   * @param {string} data.password - 密码
   * @param {string} data.playerName - 游戏昵称
   * @returns {Promise}
   */
  register(data) {
    return request({
      url: '/xiuxian/register',
      method: 'post',
      data
    })
  },

  /**
   * 保存游戏存档
   * @param {Object} data - 存档信息
   * @param {number} data.userId - 用户ID
   * @param {string} data.saveData - 存档数据（JSON字符串）
   * @returns {Promise}
   */
  saveGame(data) {
    return request({
      url: '/xiuxian/save',
      method: 'post',
      data
    })
  },

  /**
   * 删除游戏存档
   * @param {number} userId - 用户ID
   * @returns {Promise}
   */
  deleteSave(userId) {
    return request({
      url: `/xiuxian/save/${userId}`,
      method: 'delete'
    })
  },

  /**
   * 更新玩家昵称
   * @param {Object} data - 更新信息
   * @param {number} data.userId - 用户ID
   * @param {string} data.playerName - 新的玩家昵称
   * @returns {Promise}
   */
  updatePlayerName(data) {
    return request({
      url: '/xiuxian/player-name',
      method: 'put',
      data
    })
  }
}

export default xiuxianApi