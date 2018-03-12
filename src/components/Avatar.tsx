import * as React from 'react'
import UserIcon from '../icons/user'
import { styled } from '../theme'

interface AvatarProps {
  src?: string
  size: number
  color?: string
}

const AvatarContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 4px;
  background: white;
`

const RoundedImage = styled.img`
  width: ${(props: AvatarProps) => props.size}px;
  height: ${(props: AvatarProps) => props.size}px;
  border-radius: 50%;
`

export const Avatar: React.SFC<AvatarProps> = props => (
  <AvatarContainer>
    {props.src ? <RoundedImage {...props} /> : <UserIcon {...props} />}
  </AvatarContainer>
)