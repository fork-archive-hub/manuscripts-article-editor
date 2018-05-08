import { storiesOf } from '@storybook/react'
import React from 'react'
import { UserInfo } from '../src/components/UserInfo'
import { styled } from '../src/theme'
import avatar from './assets/melnitz.jpg'

const user = {
  givenName: 'Foo',
  familyName: 'Bar',
  email: 'foo@example.com',
  tel: '',
  affiliations: [],
}

const userWithAvatar = {
  ...user,
  avatar,
}

const Container = styled.div`
  width: 300px;
  background-color: rgba(145, 196, 255, 0.12);
`

storiesOf('UserInfo', module)
  .add('user', () => (
    <Container>
      <UserInfo user={user} />
    </Container>
  ))
  .add('open', () => (
    <Container>
      <UserInfo user={user} />
    </Container>
  ))
  .add('with avatar', () => (
    <Container>
      <UserInfo user={userWithAvatar} />
    </Container>
  ))
