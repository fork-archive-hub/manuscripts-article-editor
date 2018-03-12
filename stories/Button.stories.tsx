import { action } from '@storybook/addon-actions'
import { withNotes } from '@storybook/addon-notes'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import {
  ActionButton,
  Button,
  IconButton,
  LinkButton,
  PrimaryButton,
} from '../src/components/Button'

import GoogleIcon from '../src/icons/google'

storiesOf('Buttons', module)
  .add('Button', () => <Button onClick={action('clicked')}>Make</Button>)
  .add('Primary Button', () => (
    <PrimaryButton onClick={action('clicked')}>Done</PrimaryButton>
  ))
  .add('Action Button', () => (
    <ActionButton onClick={action('clicked')}>+</ActionButton>
  ))
  .add('Link Button', () => (
    <LinkButton onClick={action('clicked')} to={'/'}>
      Foo
    </LinkButton>
  ))
  .add(
    'Icon Button',
    withNotes('This icon would usually be used in an AuthenticationButton.')(
      () => (
        <IconButton onClick={action('clicked')}>
          <GoogleIcon />
        </IconButton>
      )
    )
  )