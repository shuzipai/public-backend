import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, message } from 'antd'
import { observer, inject } from 'mobx-react'
import { observable, computed } from 'mobx'

import { InputItem } from '../index.js'
import utils from './utils'

@inject('history', 'utils', 'user')
@observer
export default class CreateItem extends React.Component {
  static propTypes = {
    schema: PropTypes.object
  }

  static defaultProps = {
    schema: {}
  }
  @observable visible = false
  @observable attr = null
  @computed get attr_list() {
    if (this.attr === null) {
      return []
    }
    return [...this.attr.values()]
  }
  @computed get params() {
    const params = {}

    if (this.attr) {
      ;[...this.attr.values()].forEach((param) => {
        if ('value' in param) {
          params[param.name] = param.value
        }
      })
    }

    return params
  }

  componentDidMount() {
    this.attr = utils.initData(this.props)
  }

  onChange(atr_name, value) {
    const n_map = new Map(this.attr)
    const atr = n_map.get(atr_name)
    atr.value = value
    n_map.set(atr_name, atr)
    this.attr = n_map
  }

  hide() {
    this.visible = false
  }

  show() {
    this.visible = true
  }

  async onCreate() {
    const { user, utils: sys_utils, schema } = this.props
    const url = sys_utils.getSchemaApi(schema, 'create')

    const res = await user.post({
      url,
      data: this.params
    })

    if (res.status === 200) {
      message.success('创建成功')
      this.attr = utils.initData(this.props)
      this.hide()
    } else {
      message.error(res.data || '创建失败')
    }
  }

  render() {
    const { children, schema } = this.props

    return [
      <Button
        key="btn"
        size="large"
        style={{ backgroundColor: 'green', color: '#fff' }}
        onClick={this.show.bind(this)}
      >
        {children}
      </Button>,
      <Modal
        key="modal"
        visible={this.visible}
        onCancel={this.hide.bind(this)}
        onOk={this.onCreate.bind(this)}
        title={`创建${schema.name || ''}`}
      >
        {this.attr_list.map((atr) => {
          if (atr.type === 'hidden') {
            return null
          }
          return (
            <div key={atr.name}>
              <div>{atr.alias}</div>
              <InputItem
                attr={atr}
                value={atr.value}
                onChange={(value) => this.onChange(atr.name, value)}
              />
            </div>
          )
        })}
      </Modal>
    ]
  }
}
