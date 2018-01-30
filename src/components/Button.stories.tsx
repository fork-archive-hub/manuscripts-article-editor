import * as React from 'react'

import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'

import {
  Button,
  IconButton,
  LinkButton,
  PlainButton,
  PrimaryButton,
} from './Button'

import GoogleIcon from '../icons/google'

storiesOf('Button', module).add('with text', () => (
  <Button>Hello Button</Button>
))

storiesOf('PrimaryButton', module).add('with text', () => (
  <PrimaryButton onClick={action('clicked')}>primary</PrimaryButton>
))

storiesOf('PlainButton', module).add('with text', () => (
  <PlainButton onClick={action('clicked')}>primary</PlainButton>
))

storiesOf('LinkButton', module).add('with text', () => (
  <LinkButton to={'/example'}>primary</LinkButton>
))

storiesOf('IconButton', module).add('with text', () => (
  <IconButton onClick={action('clicked')}>
    <GoogleIcon />
  </IconButton>
))
