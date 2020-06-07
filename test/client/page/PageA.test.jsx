import React from 'react'
import renderer from 'react-test-renderer'

import PageA from '../../../client/page/PageA'

test('<PageA> html', () => {
  const component = renderer.create(
    <PageA></PageA>,
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
