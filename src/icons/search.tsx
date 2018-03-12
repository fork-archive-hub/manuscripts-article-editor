import * as React from 'react'
import { IconProps } from './'

const Search = (props: IconProps) => (
  <svg
    viewBox="0 0 16 16"
    width={props.size}
    height={props.size}
    fill={props.color || '#fff'}
    {...props}
  >
    <path d="M15.504 13.616l-3.79-3.223c-.392-.353-.811-.514-1.149-.499a6 6 0 1 0-.672.672c-.016.338.146.757.499 1.149l3.223 3.79c.552.613 1.453.665 2.003.115s.498-1.452-.115-2.003zM6 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
  </svg>
)

export default Search