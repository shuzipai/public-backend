import React from 'react'
import { Modal } from 'antd'

import st from './index.scss'
import { observer } from 'mobx-react'
import { observable } from 'mobx'

@observer
export default class PreviewImage extends React.Component {
  @observable visible = false

  onClick() {
    this.visible = true
  }

  hide() {
    this.visible = false
  }

  render() {
    return (
      <div className={st['box']}>
        <img
          className={st['img']}
          {...this.props}
          onClick={this.onClick.bind(this)}
        />
        <Modal visible={this.visible} onOk={this.hide.bind(this)} onCancel={this.hide.bind(this)}>
          <img className={st['big-img']} src={this.props.src} />
        </Modal>
      </div>
    )
  }
}
