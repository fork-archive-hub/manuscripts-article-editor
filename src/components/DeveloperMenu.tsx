import React from 'react'
import config from '../config'
import { createToken, createUserProfile } from '../lib/developer'
import { removeDB } from '../lib/rxdb'
import { getCurrentUserId } from '../store/UserProvider'
import { styled } from '../theme'

const DropdownAction = styled.div`
  padding: 10px 20px;
  display: block;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: #7fb5d5;
    color: white;
  }
`

const DropdownInfo = styled.div`
  padding: 10px 20px;
  white-space: nowrap;
`

export const MenuLabel = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  text-decoration: none;
  color: inherit;
  border-radius: 4px;
  margin-left: 20px;
`

const PlainLink = styled.a`
  color: inherit;
  text-decoration: none;
`

export const DeveloperMenu = () => (
  <React.Fragment>
    <DropdownAction
      onClick={async () => {
        await removeDB()
        alert('Removed database')
        window.location.reload(true)
      }}
    >
      Delete database
    </DropdownAction>

    {config.git.version && (
      <DropdownInfo>Version: {config.git.version}</DropdownInfo>
    )}

    {config.git.commit && (
      <DropdownInfo>Commit: {config.git.commit}</DropdownInfo>
    )}

    <DropdownInfo>
      <PlainLink href={`${config.api.url}/app/version`}>API version</PlainLink>
    </DropdownInfo>
  </React.Fragment>
)

export const DeveloperActions = () => (
  <React.Fragment>
    <DropdownAction
      onClick={() => {
        createToken('demo@example.com')
        alert('Created token')
      }}
    >
      Create token
    </DropdownAction>

    <DropdownAction
      onClick={async () => {
        const userId = getCurrentUserId()

        await createUserProfile(userId as string, {
          given: 'Example',
          family: 'User',
        })

        alert('Created user profile')
      }}
    >
      Create user profile
    </DropdownAction>
  </React.Fragment>
)