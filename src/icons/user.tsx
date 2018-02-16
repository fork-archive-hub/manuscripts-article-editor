import * as React from 'react'
import { IconProps } from './'

const User = (props: IconProps) => (
  <svg
    viewBox="0 0 16 16"
    width={props.size || 45}
    height={props.size || 45}
    fill={props.color || '#fff'}
    className={props.className}
  >
    <path d="M9 11.041v-.825c1.102-.621 2-2.168 2-3.716C11 4.015 11 2 8 2S5 4.015 5 6.5c0 1.548.898 3.095 2 3.716v.825c-3.392.277-6 1.944-6 3.959h14c0-2.015-2.608-3.682-6-3.959z" />
  </svg>
)

export default User
