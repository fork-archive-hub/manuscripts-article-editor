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

import { Resizer, ResizerDirection, ResizerSide } from '@manuscripts/resizer'
import React from 'react'
import layout, { Pane } from '../lib/layout'

interface PanelProps {
  name: string
  minSize?: number
  direction: ResizerDirection
  side: ResizerSide
  hideWhen?: string
}

interface PanelState {
  originalSize: number | null
  size: number | null
  collapsed: boolean
  hidden: boolean
}

interface InitializedPanelState extends PanelState {
  originalSize: number
  size: number
}

interface PanelStyle {
  position: 'relative'
  width: number | string
  height: number | string
}

class Panel extends React.Component<PanelProps, PanelState> {
  public state: PanelState = {
    originalSize: null,
    size: null,
    collapsed: false,
    hidden: false,
  }

  private hideWhenQuery?: MediaQueryList

  public componentDidMount() {
    if (this.props.hideWhen) {
      this.hideWhenQuery = window.matchMedia(
        `screen and (${this.props.hideWhen})`
      )

      // tslint:disable-next-line:deprecation
      this.hideWhenQuery.addListener(this.handleHideWhenChange)

      this.setState({
        hidden: this.hideWhenQuery.matches,
      })
    }

    this.updateState(layout.get(this.props.name))
  }

  public componentWillUnmount() {
    if (this.hideWhenQuery) {
      // tslint:disable-next-line:deprecation
      this.hideWhenQuery.removeListener(this.handleHideWhenChange)
    }
  }

  public render() {
    const { children, direction, side } = this.props
    const { collapsed, hidden, size, originalSize } = this.state

    if (size === null || originalSize === null) return null

    const style = this.buildStyle(direction, size)

    const resizer = hidden ? null : (
      <Resizer
        collapsed={collapsed}
        direction={direction}
        side={side}
        onResize={this.handleResize}
        onResizeEnd={this.handleResizeEnd}
        onResizeButton={this.handleResizeButton}
      />
    )

    return side === 'start' ? (
      <div style={style}>
        {resizer}
        {!collapsed && children}
      </div>
    ) : (
      <div style={style}>
        {!collapsed && children}
        {resizer}
      </div>
    )
  }

  private buildStyle = (direction: string | null, size: number): PanelStyle => {
    return {
      position: 'relative',
      width: direction === 'row' ? size : '100%',
      height: direction === 'row' ? '100%' : size,
    }
  }

  private handleHideWhenChange = (event: MediaQueryListEvent) => {
    this.setState({ hidden: event.matches })
    this.updateState(layout.get(this.props.name))
  }

  private handleResize = (resizeDelta: number) => {
    const { originalSize } = this.state as InitializedPanelState

    this.setState({
      size: originalSize + resizeDelta,
    })
  }

  private handleResizeEnd = (resizeDelta: number) => {
    const { originalSize } = this.state as InitializedPanelState

    const { name } = this.props

    const data = layout.get(name)
    data.size = resizeDelta < -originalSize ? 0 : originalSize + resizeDelta
    data.collapsed = data.size === 0
    layout.set(name, data)

    this.updateState(data)
  }

  private handleResizeButton = () => {
    const { name } = this.props

    const data = layout.get(name)
    data.collapsed = !data.collapsed
    layout.set(name, data)

    this.updateState(data)
  }

  private updateState(data: Pane) {
    const { hidden } = this.state

    const size = Math.max(this.props.minSize || 0, data.size)

    this.setState({
      originalSize: size,
      size: data.collapsed || hidden ? 0 : size,
      collapsed: data.collapsed || hidden,
    })
  }
}

export default Panel
