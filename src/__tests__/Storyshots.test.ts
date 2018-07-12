jest.mock('../lib/token')
jest.mock('../lib/deviceId')

import initStoryshots, { renderOnly } from '@storybook/addon-storyshots'

initStoryshots({
  configPath: 'stories/config',
  storyKindRegex: /^(Application Menu|Authentication|Avatar|Button|Cross References|Dropdown|Footer|Forms|Hero|Menu|MenuBar|Page|PageHeading|Pages|Panel|TextField|TextFieldContainer)$/,
  test: renderOnly,
})