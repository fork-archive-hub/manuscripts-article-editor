jest.mock('../lib/token')
jest.mock('../lib/deviceId')
jest.mock('react-modal')

import initStoryshots, { renderOnly } from '@storybook/addon-storyshots'

initStoryshots({
  configPath: 'stories/config',
  test: renderOnly,
})
