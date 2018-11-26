import React from 'react'
import { Link } from 'react-router-dom'
import { styled } from '../theme'
import { Button } from './Button'

export const FooterBlock = styled('footer')`
  position: absolute;
  bottom: 7px;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  color: #777;
`

export const FooterLinks = styled('nav')`
  display: flex;
  justify-content: center;
`

export const FooterLink = styled(Link)`
  display: inline-flex;
  color: inherit;
  padding: 5px;
  text-decoration: none;
`

export const FooterLinkSeparator = styled.span`
  display: inline-flex;
  padding: 0 5px;
`

export const FooterTextButton = styled(Button)`
  background: transparent;
  color: white;
`

interface FooterLink {
  url: string
  text: string
}

interface FooterProps {
  links: FooterLink[]
}

export const Footer: React.FunctionComponent<FooterProps> = ({ links }) => (
  <FooterBlock>
    <FooterLinks>
      {links.map((link, index) => (
        <span key={link.url}>
          {!!index && <FooterLinkSeparator>|</FooterLinkSeparator>}
          <FooterLink to={link.url}>{link.text}</FooterLink>
        </span>
      ))}
    </FooterLinks>
  </FooterBlock>
)
