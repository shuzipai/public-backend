import React from 'react'
import { observer, inject } from 'mobx-react'
import { observable, computed } from 'mobx'
import { Table } from 'antd'
import moment from 'moment'

import { Filter, PageLoading, PreviewImage, Curd } from '../../compontents'

const { CreateItem, UpdateItem } = Curd

import st from './index.scss'

@inject('schema', 'utils', 'user', 'define')
@observer
export default class DataIndex extends React.Component {
  @observable name = null
  @observable list = []
  @observable loading = false
  @observable total = 0
  @observable params_array = []
  @computed get params() {
    const params = {
      page: this.page,
      per_page: this.per_page
    }

    if (this.params_array) {
      this.params_array.forEach((param) => {
        if ('value' in param) {
          params[param.name] = param.value
        }
      })
    }

    return params
  }
  page = 1
  per_page = 10
  action_obj = {
    view: (data, record, idx) => {
      return <div key="view">查看</div>
    },
    delete: (data, record, idx) => {
      return <div key="delete">删除</div>
    },
    update: (schema) => {
      return (data, record, idx) => {
        return (
          <UpdateItem schema={schema} data={record} onSuccess={this.getList.bind(this)} key="update">
            更新
          </UpdateItem>
        )
      }
    }
  }

  componentDidMount() {
    this.init()
  }

  componentDidUpdate() {
    this.init()
  }

  init() {
    const { utils, schema } = this.props
    const params = utils.getMatchParams(this.props)

    if (
      'name' in params &&
      typeof params.name === 'string' &&
      schema[params.name] &&
      this.name !== params.name
    ) {
      this.dateInit()
      this.name = params.name
    }
  }

  getSchemaAttrForTable(schema, rule) {
    const { show_rule, attriutes, action } = schema
    const attr_obj = {}
    let rule_obj = null
    attriutes.forEach((attr) => {
      attr_obj[attr.name] = attr
    })

    if (show_rule && show_rule[rule]) {
      rule_obj = {}
      show_rule[rule].forEach((r) => {
        if (typeof r === 'string') {
          rule_obj[r] = {
            name: r
          }
        } else {
          rule_obj[r.name] = r
        }
      })
    }

    const mathAttr = (attr) => {
      const row = {
        title: attr['alias'],
        key: attr['name'],
        dataIndex: attr['name'],
        ellipsis: true
      }
      switch (attr.type) {
        case 'datetime':
          row.render = (value) => moment(value).format('YYYY-MM-DD HH:mm:ss')
          break
        case 'image_array':
          row.render = (value) => (
            <div>
              {value &&
                value.map((src, idx) => (
                  <PreviewImage
                    key={idx}
                    height="50px"
                    width="50px"
                    src={src}
                  />
                ))}
            </div>
          )
          break
        case 'indexof':
          row.render = (value, rec) => {
            if ('alternatives' in attr) {
              for (let item of attr.alternatives) {
                if (value == item.value) {
                  value = item.name
                }
              }
            }
            return value
          }
      }
      return row
    }

    const coulmns = []
    if (rule_obj) {
      attriutes.forEach((attr) => {
        // console.log(rule_obj, attr.name)
        if (rule_obj && rule_obj[attr.name]) {
          const row = mathAttr(attr)
          if (rule_obj[attr.name].render) {
            row.render = rule_obj[attr.name].render
          }
          coulmns.push(row)
        }
      })
    } else {
      attriutes.forEach((attr) => {
        coulmns.push(mathAttr(attr))
      })
    }

    if (action) {
      const action_list = []
      action.forEach((act) => {
        if (this.action_obj[act]) {
          action_list.push(this.action_obj[act])
        }
      })
      if (action_list.length > 0) {
        coulmns.push({
          title: '操作',
          key: '_sys_action',
          dataIndex: '_sys_action',
          ellipsis: true,
          render(data, record, idx) {
            return action_list.map((func) => func(schema)(data, record, idx))
          }
        })
      }
    }

    return coulmns
  }

  dateInit() {
    this.page = 1
    this.per_page = 10
    this.params_array = []
  }

  getColumns() {
    const { schema } = this.props

    return this.getSchemaAttrForTable(schema[this.name], 'index')
  }

  async onSearch(params) {
    this.dateInit()
    this.params_array = params
    this.getList()
  }

  async getList() {
    const { user, schema, utils } = this.props
    const url = utils.getSchemaApi(schema[this.name], 'index')

    this.loading = true
    const res = await user.get({
      url,
      params: this.params
    })

    if (res.status === 200) {
      this.list = res.data
      this.total = res.headers['x-pagination-total-count'] || this.total
    } else {
      this.list = []
      this.total = 0
    }
    this.loading = false
  }

  async pageChange(page, page_sie) {
    this.page = page
    this.per_page = page_sie
    await this.getList()
  }

  async pageSizeChange(page_now, page_size) {
    const page = Math.round((this.page * this.per_page) / page_size)
    this.page = page
    this.per_page = page_size
    await this.getList()
  }

  render() {
    const { schema } = this.props

    if (!this.name) {
      return <PageLoading />
    }

    return (
      <div key={this.name}>
        <Filter
          schema={schema[this.name]}
          onSearch={this.onSearch.bind(this)}
        />
        <div className={st['table-title']}>
          <div>{schema[this.name].name}</div>
          <div className={st['action-box']}>
            {schema[this.name].action &&
              schema[this.name].action.indexOf('create') !== -1 && (
                <CreateItem schema={schema[this.name]}>
                  创建{schema[this.name].name || ''}
                </CreateItem>
              )}
          </div>
        </div>
        <div className={st['table']}>
          <Table
            rowKey="id"
            loading={this.loading}
            dataSource={this.list.slice()}
            columns={this.getColumns()}
            pagination={{
              current: this.page,
              pageSize: this.per_page,
              total: this.total,
              responsive: true,
              showTotal: (total) => `共计${total}个查询结果`,
              onChange: this.pageChange.bind(this),
              onShowSizeChange: this.pageSizeChange.bind(this)
            }}
          />
        </div>
      </div>
    )
  }
}
