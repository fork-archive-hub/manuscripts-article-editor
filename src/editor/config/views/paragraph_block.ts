import { NodeViewCreator } from '../types'
import Block from './block'

// tslint:disable:max-classes-per-file

class ParagraphBlock extends Block {
  protected get elementType() {
    return 'p'
  }

  protected get objectName() {
    return 'Paragraph'
  }
}

const paragraphBlock: NodeViewCreator = (node, view, getPos, decorations) => {
  // TODO: set a node property instead?
  for (const decoration of decorations) {
    if (decoration.spec.element) {
      return new ParagraphBlock(node, view, getPos)
    }
  }

  const dom = document.createElement('p')
  dom.id = node.attrs.id

  return {
    dom,
    contentDOM: dom,
  }
}

export default paragraphBlock