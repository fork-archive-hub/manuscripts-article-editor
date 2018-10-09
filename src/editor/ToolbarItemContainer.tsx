import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React from 'react'
import Modal from 'react-modal'
import { styled } from '../theme'
import { ToolbarButton } from './Toolbar'

export const ToolbarItem = styled.div`
  display: inline-flex;
  position: relative;
`

export const StyledButton = styled.button<{
  'data-active'?: boolean
}>`
  background-color: ${props => (props['data-active'] ? '#eee' : '#fff')};
  border: 1px solid #d6d6d6;
  cursor: pointer;
  padding: 2px 12px;
  display: inline-flex;
  align-items: center;
  transition: 0.2s all;

  &:hover {
    background: ${props => (props['data-active'] ? '#eee' : '#f6f6f6')};
    z-index: 2;
  }

  &:active {
    background: #ddd;
  }

  &:disabled {
    opacity: 0.2;
  }
`

// const DropdownContainer = styled.div`
//   position: absolute;
//   top: 32px;
//   left: 0;
//   padding: 5px 0;
//   border: 1px solid #d6d6d6;
//   border-radius: 10px;
//   box-shadow: 0 4px 11px 0 rgba(0, 0, 0, 0.1);
//   background: #fff;
//   z-index: 10;
//   text-align: left;
//   overflow: hidden;
//   text-overflow: ellipsis;
// `

const modalStyle = {
  content: {
    fontFamily: 'sans-serif',
  },
  overlay: {
    zIndex: 10,
  },
}

interface State {
  open: boolean
}

interface Props {
  key: string
  item: ToolbarButton
  state: EditorState
  view: EditorView
}

class ToolbarItemContainer extends React.Component<Props, State> {
  public state = {
    open: false,
  }

  public render() {
    const { state, view, item } = this.props

    const Dropdown = item.dropdown

    return (
      <ToolbarItem>
        <StyledButton
          type={'button'}
          title={item.title}
          data-active={item.active && item.active(state)}
          disabled={item.enable && !item.enable(state)}
          onMouseDown={event => {
            event.preventDefault()
            if (item.dropdown) {
              this.toggleDropdown()
            } else if (item.run) {
              item.run(state, view.dispatch)
            } else {
              // console.warn('No dropdown or run')
            }
          }}
        >
          {item.content}
        </StyledButton>

        {item.dropdown && (
          <Modal
            isOpen={this.state.open}
            onRequestClose={this.toggleDropdown}
            style={modalStyle}
            ariaHideApp={false}
          >
            <Dropdown
              state={state}
              view={view}
              handleClose={this.toggleDropdown}
            />
          </Modal>
        )}

        {/*{this.state.open && (
          <DropdownContainer>
            <Dropdown state={state} dispatch={dispatch} />
          </DropdownContainer>
        )}*/}
      </ToolbarItem>
    )
  }

  private toggleDropdown = () => {
    this.setState({
      open: !this.state.open,
    })
  }
}

export default ToolbarItemContainer