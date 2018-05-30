import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React from 'react'
import { parse, plugins, schema } from './lib/title'

export const createEditorState = (value: string) =>
  EditorState.create({
    doc: parse(value),
    schema,
    plugins,
  })

interface Props {
  value: string
  handleChange?: (value: string) => void
  className?: string
  autoFocus?: boolean
}

interface State {
  value: string
}

class Title extends React.Component<Props, State> {
  public state = {
    value: this.props.value,
  }

  protected view: EditorView

  public componentDidMount() {
    this.setState({
      value: this.props.value,
    })
  }

  public componentWillReceiveProps(nextProps: Props) {
    const value = nextProps.value

    if (value !== this.state.value) {
      this.setState({ value })

      if (this.view) {
        const state = createEditorState(value)
        this.view.updateState(state)
      }
    }
  }

  public render() {
    return <div ref={this.createEditorView} className={this.props.className} />
  }

  protected createEditorView = (node: HTMLDivElement) => {
    if (!node) return

    while (node.firstChild) {
      node.removeChild(node.firstChild)
    }

    this.view = new EditorView(node, {
      state: createEditorState(this.props.value),
      editable: () => false,
      attributes: {
        class: 'plain',
      },
    })
  }
}

export default Title