import React from 'react'
import path from 'path'
import { renderToStaticNodeStream, renderToNodeStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { ChunkExtractor } from '@loadable/server'
import Env from './nunjucksEnv.js'

const node_stats = path.resolve('./webpack_server/loadable-stats.json')
const client_stats = path.resolve('./webpack_client/loadable-stats.json')

export default (url, debug = false) => {
  const nodeExtractor = new ChunkExtractor({
    statsFile: node_stats,
    entrypoints: ['app'],
  })
  const App = nodeExtractor.requireEntrypoint()

  const context = {}
  const webExtractor = new ChunkExtractor({
    statsFile: client_stats,
    entrypoints: ['app'],
  })
  const jsx = webExtractor.collectChunks(
    <StaticRouter context={context} location={url}>
      <App />
    </StaticRouter>
  )

  const render = debug ? renderToStaticNodeStream : renderToNodeStream
  const body = render(jsx).read()
  const script_tags = webExtractor.getScriptTags()
  const link_tags = webExtractor.getLinkTags()
  const style_tags = webExtractor.getStyleTags()
  const helmet = Helmet.renderStatic()
  const title = helmet.title.toString()
  const meta = helmet.meta.toString()
  const link = helmet.link.toString()

  return Env.render('index.html', {
    body,
    title,
    meta,
    link,
    script_tags,
    link_tags,
    style_tags,
  })
}
