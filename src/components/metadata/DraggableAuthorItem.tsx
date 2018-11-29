import {
  UserProfileWithAvatar,
  withDragDropContext,
} from '@manuscripts/manuscript-editor'
import { Contributor } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import {
  DragSource,
  DragSourceCollector,
  DragSourceSpec,
  DropTarget,
  DropTargetCollector,
  DropTargetMonitor,
  DropTargetSpec,
} from 'react-dnd'
import { findDOMNode } from 'react-dom'
import { manuscriptsBlue } from '../../colors'
import CorrespondingAuthorBadge from '../../icons/corresponding-author-badge'
import JointFirstAuthorBadge from '../../icons/joint-first-author-badge'
import VerticalEllipsis from '../../icons/vertical-ellipsis'
import { isJointFirstAuthor } from '../../lib/authors'
import {
  AuthorItem,
  ConnectedDragSourceProps,
  ConnectedDropTargetProps,
  DragSourceProps,
  DropHandler,
  DropSide,
} from '../../lib/drag-drop-authors'
import { styled } from '../../theme'
import { Avatar } from '../Avatar'
import { AuthorName } from './AuthorName'

interface OpacityProps {
  opacity: number
}

const AuthorItemComponent = styled.div`
  padding: 4px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.25s;
  opacity: ${(props: OpacityProps) => props.opacity};

  &:hover,
  &.active {
    background: #e0eef9;
  }
`

const AuthorMetadata = styled.div`
  display: flex;
  align-items: center;
`

const AvatarContainer = styled.span`
  display: inline-flex;
  position: relative;
`

const AuthorBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

const AuthorNotes = styled.span`
  position: absolute;
  top: 0;
  right: 0;

  & ${AuthorBadge}:not(:last-child) {
    right: -20%;
  }
`

const AuthorNameSpace = styled.span`
  margin-left: 12px;
`

const Invited = styled.div`
  display: flex;
  font-size: 12px;
  color: #7fb5d5;
`

const InvitedContainer = styled.div`
  display: flex;
  align-items: center;
`

const AuthorDropPreview = styled.div`
  width: 100%;
  background: #65a3ff;
  height: 1px;
  position: relative;
`

const DragHandle = styled.div`
  margin-left: 12px;

  &:hover {
    cursor: move;
  }
`

type ConnectedProps = ConnectedDragSourceProps & ConnectedDropTargetProps

interface DragObject {
  authorItem: AuthorItem
}

interface Props {
  authorItem: AuthorItem
  onDrop: DropHandler
  author: Contributor
  authors: Contributor[]
  user: Partial<UserProfileWithAvatar>
  selectedAuthor: Contributor | null
  checkInvitations: (author: Contributor) => boolean
  selectAuthor: (item: Contributor) => void
}

interface State {
  dragPosition: DropSide
}

const dragSourceSpec: DragSourceSpec<Props & ConnectedProps, DragObject> = {
  beginDrag(props: Props) {
    return {
      authorItem: props.authorItem,
    }
  },
}

const dropTargetSpec: DropTargetSpec<Props & ConnectedProps> = {
  hover(
    _props: Props,
    monitor: DropTargetMonitor,
    component: React.Component<Props>
  ) {
    if (!monitor.isOver({ shallow: true })) return

    const hoveredNode = findDOMNode(component) as Element
    const { top, bottom } = hoveredNode.getBoundingClientRect()
    const offset = monitor.getClientOffset()

    if (!offset) return

    const verticalMiddle = (bottom - top) / 2
    const verticalHover = offset.y - top

    const item = monitor.getItem() as DragSourceProps

    item.position = verticalHover < verticalMiddle ? 'before' : 'after'

    component.setState({
      dragPosition: item.position,
    })
  },

  canDrop(props: Props, monitor: DropTargetMonitor) {
    const item = monitor.getItem() as DragSourceProps

    return props.authorItem._id !== item.authorItem._id
  },

  drop(props: Props, monitor: DropTargetMonitor) {
    if (monitor.didDrop()) return // already dropped on something else

    const item = monitor.getItem() as DragSourceProps

    props.onDrop(
      item.authorItem,
      props.authorItem,
      item.position,
      props.authors
    )
  },
}

class AuthorComponent extends React.Component<Props & ConnectedProps, State> {
  public state: State = {
    dragPosition: null,
  }

  public render() {
    const { dragPosition } = this.state

    const {
      isDragging,
      connectDragSource,
      connectDropTarget,
      selectAuthor,
      author,
      authors,
      user,
      authorItem,
      checkInvitations,
    } = this.props

    const opacity = isDragging ? 0 : 1

    return connectDragSource(
      <div>
        <AuthorDropPreview
          style={this.topPreviewStyles(this.mightDrop(), dragPosition)}
        />
        {connectDropTarget(
          <div>
            <AuthorItemComponent
              key={author._id}
              onClick={() => selectAuthor(author)}
              className={this.selectedAuthorClass()}
              opacity={opacity}
            >
              <AuthorMetadata>
                <AvatarContainer>
                  <Avatar src={user.avatar} size={48} color={'#788faa'} />
                  <AuthorNotes>
                    {author.isCorresponding && (
                      <AuthorBadge>
                        <CorrespondingAuthorBadge />
                      </AuthorBadge>
                    )}
                    {isJointFirstAuthor(authors, authorItem.index) && (
                      <AuthorBadge>
                        <JointFirstAuthorBadge />
                      </AuthorBadge>
                    )}
                  </AuthorNotes>
                </AvatarContainer>

                <AuthorNameSpace>
                  <AuthorName name={author.bibliographicName} />
                </AuthorNameSpace>
              </AuthorMetadata>

              <InvitedContainer>
                {checkInvitations(author) && <Invited>Invited</Invited>}
                {this.selectedAuthorClass() && (
                  <DragHandle>
                    <VerticalEllipsis color={manuscriptsBlue} />
                  </DragHandle>
                )}
              </InvitedContainer>
            </AuthorItemComponent>
          </div>
        )}
        <AuthorDropPreview
          style={this.bottomPreviewStyles(this.mightDrop(), dragPosition)}
        />
      </div>
    )
  }

  private mightDrop = () =>
    this.props.item && this.props.isOverCurrent && this.props.canDrop

  private selectedAuthorClass = () => {
    const { selectedAuthor, author } = this.props

    return selectedAuthor && selectedAuthor._id === author._id ? 'active' : ''
  }

  private topPreviewStyles = (
    mightDrop: boolean,
    dragPosition: DropSide
  ): React.CSSProperties => ({
    top: '0px',
    visibility: mightDrop && dragPosition === 'before' ? 'visible' : 'hidden',
  })

  private bottomPreviewStyles = (
    mightDrop: boolean,
    dragPosition: DropSide
  ): React.CSSProperties => ({
    bottom: '-1px',
    visibility: mightDrop && dragPosition === 'after' ? 'visible' : 'hidden',
  })
}

const dragSourceCollector: DragSourceCollector<ConnectedDragSourceProps> = (
  connect,
  monitor
) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
  item: monitor.getItem() as DragSourceProps,
})

const dropTargetCollector: DropTargetCollector<ConnectedDropTargetProps> = (
  connect,
  monitor
) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop(),
})

const dragType = 'authorItem'

const dragSource = DragSource<Props, ConnectedDragSourceProps, DragObject>(
  dragType,
  dragSourceSpec,
  dragSourceCollector
)

const dropTarget = DropTarget<Props, ConnectedDropTargetProps>(
  dragType,
  dropTargetSpec,
  dropTargetCollector
)

const DraggableAuthorItem = dragSource(dropTarget(AuthorComponent))

export default withDragDropContext(DraggableAuthorItem)