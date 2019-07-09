/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import data from '@manuscripts/examples/data/project-dump.json'
import {
  ActualManuscriptNode,
  SectionNode,
} from '@manuscripts/manuscript-transform'
import {
  Bundle,
  Manuscript,
  Section,
} from '@manuscripts/manuscripts-json-schema'
import { TabPanel, TabPanels, Tabs } from '@reach/tabs'
import '@reach/tabs/styles.css'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { InspectorTab, InspectorTabList } from '../src/components/Inspector'
import { ManuscriptStyleInspector } from '../src/components/inspector/ManuscriptStyleInspector'
import { ParagraphStyles } from '../src/components/inspector/ParagraphStyles'
import { SectionInspector } from '../src/components/inspector/SectionInspector'
import { SectionStyles } from '../src/components/inspector/SectionStyles'
import { StatisticsInspector } from '../src/components/inspector/StatisticsInspector'
import { ManuscriptInspector } from '../src/components/projects/ManuscriptInspector'
import { buildColors } from '../src/lib/colors'
import { findBodyTextParagraphStyles } from '../src/lib/styles'
import { buildModelMap } from '../src/pressroom/__tests__/util'
import { ProjectDump } from '../src/pressroom/importers'
import { doc } from './data/doc'

const manuscript: Manuscript = {
  _id: 'MPManuscript:1',
  containerID: 'MPProject:1',
  objectType: 'MPManuscript',
  createdAt: 0,
  updatedAt: 0,
}

const section: Section = {
  _id: 'MPSection:1',
  containerID: 'MPProject:1',
  manuscriptID: 'MPManuscript:1',
  objectType: 'MPSection',
  title:
    'Acetic acid activates distinct taste pathways in <i>Drosophila</i> to elicit opposing, state-dependent feeding responses',
  createdAt: 0,
  updatedAt: 0,
  sessionID: '1',
  priority: 1,
  path: ['MPSection:1'],
}

const bundle: Bundle = {
  _id: 'MPBundle:1',
  containerID: 'MPProject:1',
  objectType: 'MPBundle',
  csl: {
    title: 'Nature',
  },
  createdAt: 0,
  updatedAt: 0,
}

const modelMap = buildModelMap(data as ProjectDump)
const { colors, colorScheme } = buildColors(modelMap)
const bodyTextParagraphStyles = findBodyTextParagraphStyles(modelMap)

const defaultParagraphStyle = bodyTextParagraphStyles.find(
  style => style.kind === 'body'
)!

storiesOf('Inspector', module).add('tabs', () => (
  <div style={{ width: 500 }}>
    <Tabs>
      <InspectorTabList>
        <InspectorTab>Tab 1</InspectorTab>
        <InspectorTab>Tab 2</InspectorTab>
        <InspectorTab>Tab 3</InspectorTab>
      </InspectorTabList>

      <TabPanels>
        <TabPanel>Panel 1</TabPanel>
        <TabPanel>Panel 2</TabPanel>
        <TabPanel>Panel 3</TabPanel>
      </TabPanels>
    </Tabs>
  </div>
))

storiesOf('Inspector/Manuscript Inspector', module).add(
  'without requirements',
  () => (
    <div style={{ width: 500 }}>
      <ManuscriptInspector
        modelMap={modelMap}
        manuscript={manuscript}
        saveModel={action('save')}
      />
    </div>
  )
)

storiesOf('Inspector/Section Inspector', module).add(
  'without requirements',
  () => (
    <div style={{ width: 500 }}>
      <SectionInspector
        modelMap={modelMap}
        section={section}
        saveModel={action('save')}
        dispatchNodeAttrs={action('dispatch node attributes')}
      />
    </div>
  )
)

storiesOf('Inspector/Manuscript Style Inspector', module)
  .add('without bundle', () => (
    <div style={{ width: 500 }}>
      <ManuscriptStyleInspector
        bundle={undefined}
        openCitationStyleSelector={action('open citation style inspector')}
      />
    </div>
  ))
  .add('with bundle', () => (
    <div style={{ width: 500 }}>
      <ManuscriptStyleInspector
        bundle={bundle}
        openCitationStyleSelector={action('open citation style inspector')}
      />
    </div>
  ))

const manuscriptNode = doc as ActualManuscriptNode
const sectionNode = doc.child(0) as SectionNode

storiesOf('Inspector/Statistics Inspector', module)
  .add('without section', () => (
    <div style={{ width: 500 }}>
      <StatisticsInspector manuscriptNode={manuscriptNode} />
    </div>
  ))
  .add('with section', () => (
    <div style={{ width: 500 }}>
      <StatisticsInspector
        manuscriptNode={manuscriptNode}
        sectionNode={sectionNode}
      />
    </div>
  ))

storiesOf('Inspector/Paragraph Styles', module).add('with bundle', () => (
  <div style={{ width: 500 }}>
    <ParagraphStyles
      bodyTextParagraphStyles={bodyTextParagraphStyles}
      colors={colors}
      colorScheme={colorScheme!}
      defaultParagraphStyle={defaultParagraphStyle}
      deleteParagraphStyle={action('delete paragraph style')}
      duplicateParagraphStyle={action('duplicate paragraph style')}
      error={undefined}
      paragraphStyle={defaultParagraphStyle}
      renameParagraphStyle={action('rename paragraph style')}
      saveDebouncedParagraphStyle={action('save debounced paragraph style')}
      saveModel={action('save model')}
      saveParagraphStyle={action('save paragraph style')}
      setElementParagraphStyle={action('set element paragraph style')}
      setError={action('set error')}
    />
  </div>
))

storiesOf('Inspector/Section Styles', module).add('with bundle', () => (
  <div style={{ width: 500 }}>
    <SectionStyles
      colors={colors}
      colorScheme={colorScheme!}
      error={undefined}
      paragraphStyle={defaultParagraphStyle}
      saveDebouncedParagraphStyle={action('save debounced paragraph style')}
      saveModel={action('save model')}
      saveParagraphStyle={action('save paragraph style')}
      setError={action('set error')}
      title={'Section Heading Styles'}
    />
  </div>
))