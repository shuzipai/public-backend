import React from 'react'
import renderer from 'react-test-renderer'

import PageB from '../../../client/page/PageB'

test('<PageB> html', () => {
  const component = renderer.create(
    <PageB></PageB>,
  )
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
