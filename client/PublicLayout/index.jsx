import React from 'react'
import { Layout, Menu, Breadcrumb, Popconfirm } from 'antd'
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons'
import { inject, observer } from 'mobx-react'
import schema from '../schema'

import st from './index.scss'
import { observable, computed } from 'mobx'

const { Header, Content, Footer, Sider } = Layout
const { SubMenu } = Menu

const schemaToMenu = (schema) => {
  const menu = []
  Object.keys(schema).map((key) => {
    schema[key].key = key
    menu.push(schema[key])
  })
  return {
    name: '数据管理',
    key: '/index',
    children: menu
  }
}

@inject('define', 'history', 'user')
@observer
export default class PublicLayout extends React.Component {
  @computed get menu_list() {
    const { define } = this.props
    return [schemaToMenu(schema)].concat(define.ROUTE || [])
  }
  state = {
    collapsed: false
  }

  getRouter(level = 1) {
    const {
      history: {
        location: { pathname }
      }
    } = this.props

    return (
      pathname
        .split('/')
        .slice(0, level + 1)
        .join('/') || '/'
    )
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed })
  }

  render() {
    const { define, history, user } = this.props

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className={st['system-name']}>{define.SYSTEM_NAME}</div>
          <Menu
            theme="dark"
            mode="inline"
            defaultOpenKeys={[this.getRouter(1)]}
            selectedKeys={[this.getRouter(2)]}
          >
            {this.menu_list.map((obj) => {
              if (obj.children && obj.children.length > 0) {
                return (
                  <SubMenu key={obj.key} title={obj.name}>
                    {obj.children.map((item) => {
                      let url = item.url
                      if (!url) {
                        if (!item.key) {
                          console.warn('路由没有指定地址', item)
                        } else {
                          url = `/index/${item.key}`
                        }
                      }
                      return (
                        <Menu.Item
                          key={`${obj.key}/${item.key}`}
                          onClick={() => (url ? history.push(url) : {})}
                        >
                          {item.name}
                        </Menu.Item>
                      )
                    })}
                  </SubMenu>
                )
              }
              return <Menu.Item key={`/${obj.name}`}>{obj.name}</Menu.Item>
            })}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className={st['header']}>
            <div className={st['_left']}>
              <span className={st['_title']}>自定义名称</span>
            </div>
            <div className={st['user-login']}>
              <Popconfirm
                title="确认要退出系统吗？"
                placement="bottomRight"
                onConfirm={() => user.logOut()}
              >
                <span className={st['logout']}>退出系统</span>
              </Popconfirm>
            </div>
          </Header>
          <Content style={{ margin: '0 16px' }}>{this.props.children}</Content>
        </Layout>
      </Layout>
    )
  }
}
