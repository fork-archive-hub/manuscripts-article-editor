import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const figureElement: NodeSpec = {
  content: 'figcaption',
  attrs: {
    id: { default: '' },
    containedObjectIDs: { default: [] },
    rows: { default: 1 },
    columns: { default: 1 },
    figureStyle: { default: '' },
    figureLayout: { default: '' },
    label: { default: '' },
    suppressCaption: { default: false },
  },
  group: 'block element',
  parseDOM: [
    {
      tag: 'figure',
      getAttrs: (dom: HTMLElement) => {
        return {
          id: dom.getAttribute('id'),
          figureStyle: dom.getAttribute('data-figure-style'),
          figureLayout: dom.getAttribute('data-figure-layout'),
        }
      },
    },
  ],
  toDOM: (node: ProsemirrorNode) => [
    'figure',
    {
      id: node.attrs.id,
      'data-figure-style': node.attrs.figureStyle,
      'data-figure-layout': node.attrs.figureLayout,
    },
    0,
  ],
}