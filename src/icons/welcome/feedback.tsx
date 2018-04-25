import React from 'react'
import { IconProps } from '../index'

const Feedback = (props: IconProps) => (
  <svg width={props.size} height={props.size} viewBox="0 0 60 51" {...props}>
    <title>{props.title}</title>
    <g fill="#93C1DC" fillRule="nonzero">
      <path d="M36.857 19h-1.714c-.629 0-1.143.675-1.143 1.5s.514 1.5 1.143 1.5h1.714c.629 0 1.143-.675 1.143-1.5s-.514-1.5-1.143-1.5zM29.842 19h-8.684C20.52 19 20 19.675 20 20.5s.521 1.5 1.158 1.5h8.684C30.48 22 31 21.325 31 20.5s-.521-1.5-1.158-1.5zM47.863 12H21.137c-.625 0-1.137.675-1.137 1.5s.512 1.5 1.137 1.5h26.726c.625 0 1.137-.675 1.137-1.5s-.512-1.5-1.137-1.5z" />
      <path d="M53.423 1H15.5c-3.067 0-5.577 2.506-5.577 5.568v12.25H4.346A3.353 3.353 0 0 0 1 22.16v17.818a3.353 3.353 0 0 0 3.346 3.341h5.577v5.568c0 .446.279.836.67 1.003.167.055.278.111.445.111.28 0 .558-.111.725-.278l6.916-6.125.056-.056c.167-.167.39-.223.725-.223h7.25a3.353 3.353 0 0 0 3.346-3.34v-7.796h1.004c.836 0 1.617.278 2.23.89l10.43 9.634c.222.167.501.278.78.278.167 0 .279-.056.446-.111a1.1 1.1 0 0 0 .67-1.003v-9.688h7.807c3.067 0 5.577-2.506 5.577-5.568V6.568C59 3.506 56.49 1 53.423 1zM27.825 39.977c0 .613-.502 1.114-1.115 1.114h-7.25c-.893 0-1.673.278-2.287.835l-5.02 4.455v-4.176c0-.613-.501-1.114-1.115-1.114H4.346a1.118 1.118 0 0 1-1.115-1.114V22.16c0-.612.502-1.114 1.115-1.114h5.577v5.569c0 3.062 2.51 5.568 5.577 5.568h12.325v7.795zm28.944-13.363a3.353 3.353 0 0 1-3.346 3.34h-7.808v-3.34c0-.613-.502-1.114-1.115-1.114s-1.115.501-1.115 1.114v12.695l-8.533-7.907c-1.004-.946-2.342-1.447-3.792-1.447H15.5a3.353 3.353 0 0 1-3.346-3.341V6.568a3.353 3.353 0 0 1 3.346-3.34h37.923a3.353 3.353 0 0 1 3.346 3.34v20.046z" />
    </g>
  </svg>
)

export default Feedback
