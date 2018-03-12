import { DOMSerializer, Node as ProsemirrorNode } from 'prosemirror-model'
import { options } from '../editor/config'
import { Component } from '../types/components'
import * as ObjectTypes from './object-types'

const { schema } = options

const serializer = DOMSerializer.fromSchema(schema)

const contents = (node: ProsemirrorNode): string =>
  (serializer.serializeNode(node) as Element).outerHTML

const childComponentNodes = (node: ProsemirrorNode): ProsemirrorNode[] => {
  const nodes: ProsemirrorNode[] = []

  node.forEach(node => {
    const objectType = node.attrs['data-object-type']

    if (objectType && objectType !== ObjectTypes.SECTION) {
      nodes.push(node)
    }
  })

  return nodes
}

// TODO: return HTML instead of text
const textOfNodeType = (node: ProsemirrorNode, type: string): string => {
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i)

    if (child.type.name === type) {
      return child.textContent
      // return (serializer.serializeNode(child) as Element).innerHTML
    }
  }

  return ''
}

type ComponentData = (
  objectType: string,
  node: ProsemirrorNode,
  path: string[],
  priority: PrioritizedValue
) => object

const componentData: ComponentData = (objectType, node, path, priority) => {
  switch (objectType) {
    case ObjectTypes.MANUSCRIPT:
      return {
        title: textOfNodeType(node, 'title'),
      }

    case ObjectTypes.SECTION:
      return {
        priority: priority.value++,
        title: textOfNodeType(node, 'section_title'),
        path: path.concat([node.attrs.id]),
        elementIDs: childComponentNodes(node).map(node => node.attrs.id),
      }

    case ObjectTypes.PARAGRAPH_ELEMENT:
      return {
        contents: contents(node),
      }

    default:
      return {}
  }
}

type ComponentBuilder = (
  node: ProsemirrorNode,
  path: string[],
  priority: PrioritizedValue
) => any // tslint:disable-line:no-any

export const componentFromNode: ComponentBuilder = (node, path, priority) => {
  const {
    id, // TODO: in handlePaste, filter out non-standard IDs
    'data-object-type': objectType,
    'data-element-type': elementType,
    createdAt,
    updatedAt,
  } = node.attrs

  return {
    id,
    objectType,
    elementType,
    createdAt,
    updatedAt,
    ...componentData(objectType, node, path, priority),
  }
}

interface PrioritizedValue {
  value: number
}

export const encode = (node: ProsemirrorNode) => {
  const components: Component[] = []

  const priority: PrioritizedValue = {
    value: 0,
  }

  const addComponent = (path: string[]) => (child: ProsemirrorNode) => {
    const objectType = child.attrs['data-object-type']

    if (objectType) {
      const component = componentFromNode(child, path, priority)
      components.push(component)

      const id = child.attrs.id
      child.forEach(addComponent(path.concat(id)))
    }
  }

  node.forEach(addComponent([]))

  return components
}