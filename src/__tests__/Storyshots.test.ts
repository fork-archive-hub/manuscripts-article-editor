jest.mock('../lib/token')
jest.mock('../lib/db')
jest.mock('../lib/device-id')

import initStoryshots, { renderOnly } from '@storybook/addon-storyshots'

initStoryshots({
  configPath: 'stories/config',
  test: renderOnly,
})
