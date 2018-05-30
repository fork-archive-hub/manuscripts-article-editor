import {
  // joinUp,
  // lift,
  setBlockType,
  toggleMark,
  // wrapIn,
} from 'prosemirror-commands'
import { wrapInList } from 'prosemirror-schema-list'
import LibraryPicker from '../../containers/LibraryPicker'
import { generateID } from '../../transformer/id'
import { AUXILIARY_OBJECT_REFERENCE } from '../../transformer/object-types'
import { AuxiliaryObjectReference } from '../../types/components'
// import { addColumnAfter, addColumnBefore } from 'prosemirror-tables'

import {
  blockActive,
  canInsert,
  insertBlock,
  insertInlineEquation,
  markActive,
} from './commands'
import icons from './icons'
import { componentsKey, INSERT } from './plugins/components'
import schema from './schema'
import { MenuButtonMap } from './types'

const styles: MenuButtonMap = {
  bold: {
    title: 'Toggle bold',
    content: icons.bold,
    active: markActive(schema.marks.bold),
    enable: toggleMark(schema.marks.bold),
    run: toggleMark(schema.marks.bold),
  },
  italic: {
    title: 'Toggle italic',
    content: icons.italic,
    active: markActive(schema.marks.italic),
    enable: toggleMark(schema.marks.italic),
    run: toggleMark(schema.marks.italic),
  },
  underline: {
    title: 'Toggle underline',
    content: icons.underline,
    active: markActive(schema.marks.underline),
    enable: toggleMark(schema.marks.underline),
    run: toggleMark(schema.marks.underline),
  },
}

const verticals: MenuButtonMap = {
  subscript: {
    title: 'Toggle subscript',
    content: icons.subscript,
    active: markActive(schema.marks.subscript),
    enable: toggleMark(schema.marks.subscript),
    run: toggleMark(schema.marks.subscript),
  },
  superscript: {
    title: 'Toggle superscript',
    content: icons.superscript,
    active: markActive(schema.marks.superscript),
    enable: toggleMark(schema.marks.superscript),
    run: toggleMark(schema.marks.superscript),
  },
}

const inlines: MenuButtonMap = {
  equation: {
    title: 'Insert inline equation',
    content: icons.equation,
    active: blockActive(schema.nodes.equation),
    enable: canInsert(schema.nodes.equation),
    run: insertInlineEquation,
  },
}

const blocks: MenuButtonMap = {
  // plain: {
  //   title: 'Change to paragraph',
  //   content: images.paragraph,
  //   active: blockActive(schema.nodes.paragraph),
  //   enable: setBlockType(schema.nodes.paragraph),
  //   run: setBlockType(schema.nodes.paragraph),
  // },
  code_block: {
    title: 'Change to code block',
    content: icons.highlight, // TODO: code block icon
    active: blockActive(schema.nodes.code_block),
    enable: setBlockType(schema.nodes.code_block),
    run: setBlockType(schema.nodes.code_block),
  },
  // h1: {
  //   title: 'Change to heading level 1',
  //   content: images.heading,
  //   active: blockActive(schema.nodes.heading, { level: 1 }),
  //   enable: setBlockType(schema.nodes.heading, { level: 1 }),
  //   run: setBlockType(schema.nodes.heading, { level: 1 }),
  // },
  // h2: {
  //   title: 'Change to heading level 2',
  //   content: 'H2',
  //   active: blockActive(schema.nodes.heading, { level: 2 }),
  //   enable: setBlockType(schema.nodes.heading, { level: 2 }),
  //   run: setBlockType(schema.nodes.heading, { level: 2 })
  // },
  // blockquote: {
  //   title: 'Wrap in block quote',
  //   content: images.blockquote,
  //   active: blockActive(schema.nodes.blockquote),
  //   enable: wrapIn(schema.nodes.blockquote),
  //   run: wrapIn(schema.nodes.blockquote),
  // },
  bullet_list: {
    title: 'Wrap in bullet list',
    content: icons.bullet_list,
    active: blockActive(schema.nodes.bullet_list),
    enable: wrapInList(schema.nodes.bullet_list),
    run: wrapInList(schema.nodes.bullet_list),
  },
  ordered_list: {
    title: 'Wrap in ordered list',
    content: icons.ordered_list,
    active: blockActive(schema.nodes.ordered_list),
    enable: wrapInList(schema.nodes.ordered_list),
    run: wrapInList(schema.nodes.ordered_list),
  },
  // lift: {
  //   title: 'Lift out of enclosing block',
  //   content: images.lift,
  //   enable: lift,
  //   run: lift,
  // },
  // join_up: {
  //   title: 'Join with above block',
  //   content: images.join_up,
  //   enable: joinUp,
  //   run: joinUp,
  // },
}

const insertCitation: MenuButtonMap = {
  citation: {
    title: 'Insert citation',
    content: icons.citation,
    enable: canInsert(schema.nodes.citation),
    dropdown: LibraryPicker,
  },
}

const insertCrossReference: MenuButtonMap = {
  citation: {
    title: 'Insert cross reference',
    content: icons.citation, // TODO
    enable: canInsert(schema.nodes.cross_reference),
    run: (state, dispatch) => {
      // TODO: open form/picker instead
      const referencedObject: { [key: string]: string } = {
        id: 'foo', // TODO: get the id of the referenced object from a picker
      }

      const containingObject = state.tr.selection.$anchor.parent // TODO: is this enough/needed?

      const auxiliaryObjectReference: AuxiliaryObjectReference = {
        id: generateID('cross_reference') as string,
        objectType: AUXILIARY_OBJECT_REFERENCE,
        containingObject: containingObject.attrs.id,
        referencedObject: referencedObject.id,
      }

      // TODO: add this in the form/picker

      const crossReferenceNode = schema.nodes.cross_reference.create({
        rid: auxiliaryObjectReference.id,
      })

      const tr = state.tr
        .setMeta(componentsKey, { [INSERT]: [auxiliaryObjectReference] })
        .insert(state.tr.selection.to, crossReferenceNode)

      dispatch(tr)
    },
  },
}

const insertFigure: MenuButtonMap = {
  figure: {
    title: 'Insert figure',
    content: icons.figure,
    enable: canInsert(schema.nodes.figure),
    run: insertBlock(schema.nodes.figure),
  },
}

const insertEquationBlock: MenuButtonMap = {
  equation_block: {
    title: 'Insert equation block',
    content: icons.equation_block,
    enable: canInsert(schema.nodes.equation_block),
    run: insertBlock(schema.nodes.equation_block),
  },
}

const insertTable: MenuButtonMap = {
  table: {
    title: 'Insert table',
    content: icons.table,
    enable: canInsert(schema.nodes.table_figure),
    run: insertBlock(schema.nodes.table_figure),
    // run: (state, dispatch) => {
    //   const columnCount = 2
    //   const rowCount = 2
    //
    //   const thead = schema.nodes.thead.create(
    //     {},
    //     Array.from(Array(1), () =>
    //       state.schema.nodes.table_header_row.create(
    //         {},
    //         Array.from(Array(columnCount), () =>
    //           state.schema.nodes.table_header.create()
    //         )
    //       )
    //     )
    //   )
    //
    //   const tbody = schema.nodes.tbody.create(
    //     {},
    //     Array.from(Array(rowCount), () =>
    //       state.schema.nodes.table_row.create(
    //         {},
    //         Array.from(Array(columnCount), () =>
    //           state.schema.nodes.table_cell.create()
    //         )
    //       )
    //     )
    //   )
    //
    //   const tfoot = schema.nodes.tfoot.create(
    //     {},
    //     Array.from(Array(1), () =>
    //       state.schema.nodes.table_row.create(
    //         {},
    //         Array.from(Array(columnCount), () =>
    //           state.schema.nodes.table_cell.create()
    //         )
    //       )
    //     )
    //   )
    //
    //   const table = state.schema.nodes.table.createAndFill() as ProsemirrorNode
    //
    //   const figcaption = schema.nodes.figcaption.create()
    //
    //   const tableFigure = schema.nodes.table_figure.create({}, [
    //     table,
    //     figcaption,
    //   ])
    // },
  },
}

// const insert: MenuButtonMap = {
//   footnote: {
//     title: 'Insert footnote',
//     content: images.footnote,
//     enable: canInsert(schema.nodes.footnote),
//     run: (state, dispatch) => {
//       const footnote = schema.nodes.footnote.create()
//       dispatch(state.tr.insert(state.tr.selection.to, footnote))
//     },
//   },
//   hr: {
//     title: 'Insert horizontal rule',
//     content: 'HR',
//     enable: canInsert(schema.nodes.horizontal_rule),
//     run: (state, dispatch) => {
//       const hr = schema.nodes.horizontal_rule.create()
//       dispatch(state.tr.insert(state.tr.selection.anchor, hr))
//     }
//   },
// }
//
// const history: MenuButtonMap = {
//   undo: {
//     title: 'Undo last change',
//     content: images.undo,
//     enable: undo,
//     run: undo,
//   },
//   redo: {
//     title: 'Redo last undone change',
//     content: images.redo,
//     enable: redo,
//     run: redo,
//   },
// }
//
// const table: MenuButtonMap = {
//   addColumnBefore: {
//     title: 'Insert column before',
//     content: images.after,
//     active: addColumnBefore, // TOOD: active -> select
//     run: addColumnBefore
//   },
//   addColumnAfter: {
//     title: 'Insert column before',
//     content: images.before,
//     active: addColumnAfter, // TOOD: active -> select
//     run: addColumnAfter
//   }
// }

export default {
  styles,
  verticals,
  inlines,
  blocks,
  insertCitation,
  insertCrossReference,
  insertFigure,
  insertEquationBlock,
  insertTable,
}