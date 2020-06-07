import React from 'react'
import PropTypes from 'prop-types'
import { Input, Select } from 'antd'
import { observable, computed } from 'mobx'
import { observer, inject } from 'mobx-react'

const { Option } = Select

@observer
export default class InputItem extends React.Component {
  static propTypes = {
    attr: PropTypes.object,
    value: PropTypes.any,

    onChange: PropTypes.func
  }

  @observable attr = null

  componentDidMount() {
    const { attr } = this.props
    this.attr = attr
  }

  onChange(value) {
    const { onChange } = this.props

    onChange && onChange(value)
  }

  render() {
    const { value } = this.props

    if (!this.attr) {
      return null
    }

    switch (this.attr.type) {
      case 'hidden':
      case 'password':
      case 'string':
        return (
          <Input
            allowClear={true}
            type={this.attr.type}
            maxLength={this.attr.max_length || undefined}
            value={value}
            placeholder={this.attr.placeholder || ''}
            onChange={(e) => this.onChange(e.target.value)}
          />
        )
      case 'indexof':
        let default_value
        for (let item of this.attr.alternatives) {
          if (item.is_default) {
            default_value = item.value
          }
        }
        return (
          <Select
            defaultValue={default_value}
            value={value}
            onChange={this.onChange.bind(this)}
          >
            {this.attr.alternatives.map((obj, idx) => (
              <Option key={idx} value={obj.value}>
                {obj.name}
              </Option>
            ))}
          </Select>
        )
      default:
        return (
          <Input
            allowClear={true}
            value={value}
            placeholder={this.attr.placeholder || ''}
            onChange={(e) => this.onChange(e.target.value)}
          />
        )
    }
  }
}