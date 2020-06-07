import axios from 'axios'
import utils from './utils'
import { message } from 'antd'
import { observable } from 'mobx'

axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.resolve(error.response)
  }
)

class User {
  @observable is_login = false
  user_info = {}
  CancelToken = axios.CancelToken

  constructor() {
    if (typeof document !== 'undefined') {
      let userinfo = localStorage.getItem('userinfo')
      if (userinfo) {
        userinfo = JSON.parse(userinfo)
        this.user_info = userinfo
        if (this.user_info.access_token) {
          this.is_login = true
        }
      }
    }
  }

  async login({ name, password }) {
    const res = await this.post({
      url: utils.getLoginUrl(),
      data: {
        name,
        password
      }
    })

    if (res.status === 200) {
      localStorage.setItem('userinfo', JSON.stringify(res.data))
      this.user_info = res.data
      this.is_login = true
    } else {
      message.error(res.data ? res.data.message : '用户名或密码错误')
    }

    return res
  }

  logOut() {
    localStorage.removeItem('userinfo')
    this.user_info = {}
    this.is_login = false
  }

  async get(obj) {
    obj.method = 'GET'
    return await this.request(obj)
  }

  async post(obj) {
    obj.method = 'POST'
    return await this.request(obj)
  }

  async request(obj) {
    obj.headers = Object.assign({}, obj.headers, {
      Authorization: this.user_info.access_token
    })
    return await axios.request(obj).then((res) => {
      if (res && res.status === 401) {
        message.error('登录过期或权限不够，请重新登录')
        this.logOut()
      }
      return res
    })
  }
}

const user = new User()
export default user
