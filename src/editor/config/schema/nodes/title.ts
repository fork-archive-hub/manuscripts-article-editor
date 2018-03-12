import { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'

export const title: NodeSpec = {
  content: 'text*',
  marks: 'em superscript subscript', // TODO: small-caps
  attrs: {
    id: { default: '' },
  },
  group: 'metadata',
  parseDOM: [
    {
      tag: 'h1',
    },
  ],
  toDOM: (node: ProsemirrorNode) => {
    return ['h1', {}, 0]
  },
}