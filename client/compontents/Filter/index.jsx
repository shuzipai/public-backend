import React from 'react'
import PropTypes from 'prop-types'
import { Button, Select } from 'antd'
import { observable, computed } from 'mobx'
import { observer, inject } from 'mobx-react'

import { InputItem } from '../index.js'

import st from './index.scss'

@inject('utils', 'history')
@observer
export default class Filter extends React.Component {
  static propTypes = {
    schema: PropTypes.object,

    onChange: PropTypes.func,
    onSearch: PropTypes.func
  }

  static defaultProps = {
    schema: {}
  }

  @observable attr = null
  @computed get attr_list() {
    if (this.attr === null) {
      return []
    }
    return [...this.attr.values()]
  }

  componentDidMount() {
    this.init()
  }

  init() {
    const {
      schema,
      utils,
      history: {
        location: { search }
      }
    } = this.props
    const { attriutes, show_rule } = schema
    const url_params = utils.getQuery(search)

    if (attriutes) {
      let attr = JSON.parse(JSON.stringify(attriutes))
      // 如果有search的规则
      if (show_rule && 'search' in show_rule) {
        attr = attr.filter(
          (attr) => show_rule.search.indexOf(attr.name) !== -1
        )
        const attr_obj = new Map()
        attr.forEach((atr) => {
          if (url_params && url_params[atr.name]) {
            atr.value = url_params[atr.name]
          }
          attr_obj.set(atr.name, atr)
        })
        this.attr = attr_obj
      }
    } else {
      console.warn('schema.attriutes is undefined')
    }
    this.onSearch()
  }

  onChange(atr_name, value) {
    const { onChange } = this.props

    const n_map = new Map(this.attr)
    const atr = n_map.get(atr_name)
    atr.value = value
    n_map.set(atr_name, atr)
    this.attr = n_map

    onChange && onChange(this.attr_list)
  }

  onSearch() {
    const { onSearch } = this.props

    onSearch && onSearch(this.attr_list)
  }

  render() {
    if (this.attr === null) {
      return null
    }

    return (
      <div className={st['box']}>
        {this.attr_list.map((atr) => (
          <div className={st['input-box']} key={atr.name}>
            <InputItem
              attr={atr}
              value={atr.value}
              onChange={(value) => this.onChange(atr.name, value)}
            />
          </div>
        ))}
        <div className={st['input-box']}>
          <Button type="primary" onClick={this.onSearch.bind(this)}>
            搜索
          </Button>
        </div>
      </div>
    )
  }
}
