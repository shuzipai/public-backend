import loadable from '@loadable/component'

export default {
  '/index/:name': loadable(() => import('./DataIndex'))
}
