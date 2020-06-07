import React from 'react'
import { inject, observer } from 'mobx-react'
import { Input, Button } from 'antd'
import { observable } from 'mobx'
import cn from 'classnames'

import st from './index.scss'

@inject('define', 'user')
@observer
export default class Login extends React.Component {
  @observable username = ''
  @observable password = ''

  async login() {
    const { user } = this.props

    const res = await user.login({
      name: this.username,
      password: this.password
    })
  }

  render() {
    const { define } = this.props

    return (
      <div className={st['page']}>
        <div className={st['login-box']}>
          <div>{define.SYSTEM_NAME}</div>
          <Input
            className={st['item']}
            type="text"
            placeholder="请输入账号"
            value={this.username}
            onChange={(e) => (this.username = e.target.value)}
          />
          <Input
            className={st['item']}
            type="password"
            placeholder="请输入密码"
            value={this.password}
            onChange={(e) => (this.password = e.target.value)}
          />
          <Button
            type="primary"
            className={cn(st['item'], st['login-btn'])}
            onClick={this.login.bind(this)}
          >
            登录
          </Button>
        </div>
      </div>
    )
  }
}
