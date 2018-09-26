import {
  MarkType,
  Node as ProsemirrorNode,
  NodeType,
  ResolvedPos,
} from 'prosemirror-model'
import {
  AllSelection,
  EditorState,
  NodeSelection,
  TextSelection,
} from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { isElementNode } from '../../transformer/node-types'
import schema from './schema'
import { Dispatch } from './types'

type AnySelection = NodeSelection & TextSelection & AllSelection

export const markActive = (type: MarkType) => (state: EditorState): boolean => {
  const { from, $from, to, empty } = state.selection as AnySelection

  return empty
    ? type.isInSet(state.storedMarks || $from.marks())
    : state.doc.rangeHasMark(from, to, type)
}

export const blockActive = (type: NodeType, attrs = {}) => (
  state: EditorState
) => {
  const { $from, to, node } = state.selection as AnySelection

  if (node) {
    return node.hasMarkup(type, attrs)
  }

  return to <= $from.end() && $from.parent.hasMarkup(type, attrs)
}

export const canInsert = (type: NodeType) => (state: EditorState) => {
  const { $from } = state.selection as AnySelection

  for (let d = $from.depth; d >= 0; d--) {
    const index = $from.index(d)

    if ($from.node(d).canReplaceWith(index, index, type)) {
      return true
    }
  }

  return false
}

const findBlockInsertPosition = (state: EditorState) => {
  const { $from } = state.selection as AnySelection

  for (let d = $from.depth; d >= 0; d--) {
    const node = $from.node(d)

    if (isElementNode(node)) {
      return $from.after(d)
    }
  }

  return null
}

export const createSelection = (
  nodeType: NodeType,
  position: number,
  doc: ProsemirrorNode
) => {
  if (nodeType.name.endsWith('_block')) {
    return NodeSelection.create(doc, position)
  }

  return TextSelection.near(doc.resolve(position + 1))
}

export const createBlock = (
  nodeType: NodeType,
  position: number,
  state: EditorState,
  dispatch: Dispatch
) => {
  const node = nodeType.createAndFill() as ProsemirrorNode

  let tr = state.tr.insert(position, node)

  const selection = createSelection(nodeType, position, tr.doc)

  tr = tr.setSelection(selection).scrollIntoView()

  dispatch(tr)
}

export const insertBlock = (nodeType: NodeType) => (
  state: EditorState,
  dispatch: Dispatch
) => {
  const position = findBlockInsertPosition(state)

  if (position === null) return false

  createBlock(nodeType, position, state, dispatch)

  return true
}

export const insertInlineEquation = (
  state: EditorState,
  dispatch: Dispatch
) => {
  dispatch(
    state.tr.replaceSelectionWith(
      schema.nodes.equation.create({
        latex: window
          .getSelection()
          .toString()
          .replace(/^\$/, '')
          .replace(/\$$/, ''),
      })
    )
  )

  return true
}

/**
 * Call the callback (a prosemirror-tables command) if the current selection is in the table body
 */
export const ifInTableBody = (command: (state: EditorState) => boolean) => (
  state: EditorState
): boolean => {
  const $head = state.selection.$head

  for (let d = $head.depth; d > 0; d--) {
    if ($head.node(d).type.name === 'tbody_row') {
      return command(state)
    }
  }

  return false
}

// Copied from prosemirror-commands
const findCutBefore = ($pos: ResolvedPos) => {
  if (!$pos.parent.type.spec.isolating) {
    for (let i = $pos.depth - 1; i >= 0; i--) {
      if ($pos.index(i) > 0) return $pos.doc.resolve($pos.before(i + 1))
      if ($pos.node(i).type.spec.isolating) break
    }
  }
  return null
}

// Ignore atom blocks (as backspace handler), instead of deleting them.
// Adapted from selectNodeBackward in prosemirror-commands
export const ignoreAtomBlockNodeBackward = (
  state: EditorState,
  dispatch?: Dispatch,
  view?: EditorView
): boolean => {
  const { $cursor } = state.selection as TextSelection

  if (!$cursor) return false

  // ignore empty blocks
  if ($cursor.parent.content.size === 0) return false

  // handle cursor at start of textblock
  if (
    view ? !view.endOfTextblock('backward', state) : $cursor.parentOffset > 0
  ) {
    return false
  }

  const $cut = findCutBefore($cursor)

  if (!$cut) return false

  const node = $cut.nodeBefore

  if (!node) return false

  return node.isBlock && node.isAtom
}
