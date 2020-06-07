/**
 * 前端入口
 * tzw 2017年8月21日17:33:18
 */

import React from 'react'
import { Helmet } from 'react-helmet'
import { render, hydrate } from 'react-dom'
import { Provider, observer } from 'mobx-react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import loadable, { loadableReady } from '@loadable/component'
import { loadableRouter } from './utils.jsx'

import workers from './worker'
import schema from './schema'
import './public/scss/core.scss'

import PublicLayout from './PublicLayout'
import pages from './page'
import { Login } from './compontents'

@observer
export default class PageManager extends React.Component {
  renderPublic() {
    return (
      <PublicLayout>
        <Switch>
          {loadableRouter(pages).map((item) => (
            <Route
              key={item.key}
              path={item.key}
              render={(props) => (
                <item.component {...props} fallback={<div>页面加载中</div>} />
              )}
            />
          ))}
        </Switch>
      </PublicLayout>
    )
  }

  render() {
    const { history } = this.props

    return (
      <Provider {...workers} schema={schema} history={history}>
        <React.Fragment>
          <Helmet>
            <meta charSet="utf-8" />
            <title>通用后台管理</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, minimal-ui"
            />
            <meta name="full-screen" content="yes" />
            <meta name="x5-fullscreen" content="true" />
          </Helmet>
          {workers.user.is_login ? this.renderPublic() : <Login />}
        </React.Fragment>
      </Provider>
    )
  }
}

if (typeof document !== 'undefined') {
  // render方式
  const render_fun = process.env.IS_SSR ? hydrate : render
  const async = process.env.IS_SSR ? loadableReady : (f) => f()
  async(() => {
    render_fun(
      <Router>
        <Route component={PageManager} />
      </Router>,
      document.getElementById('wrap')
    )
  })
}
