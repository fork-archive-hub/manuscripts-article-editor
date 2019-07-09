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

import {
  ContainerInvitation,
  ObjectTypes,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import CollectionManager from '../sync/CollectionManager'
import { DataComponent } from './DataComponent'

interface Props {
  children: (data: ContainerInvitation[]) => React.ReactNode
  containerID: string
}

interface State {
  data?: ContainerInvitation[]
}

class ContainerInvitationsData extends DataComponent<
  ContainerInvitation,
  Props,
  State
> {
  public constructor(props: Props) {
    super(props)

    this.state = {}

    this.collection = CollectionManager.getCollection<ContainerInvitation>(
      `project-${props.containerID}` /* 'invitations' */
    )
  }

  public componentDidMount() {
    const { containerID } = this.props

    this.collection.addEventListener('complete', this.handleComplete)
    this.sub = this.subscribe(containerID)
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { containerID } = nextProps

    if (containerID !== this.props.containerID) {
      this.sub.unsubscribe()

      this.setState({ data: undefined })

      this.collection.addEventListener('complete', this.handleComplete)

      this.collection = CollectionManager.getCollection<ContainerInvitation>(
        `project-${containerID}`
      )

      this.collection.removeEventListener('complete', this.handleComplete)

      this.sub = this.subscribe(containerID)
    }
  }

  public componentWillUnmount() {
    this.collection.removeEventListener('complete', this.handleComplete)
    this.sub.unsubscribe()
  }

  private subscribe = (containerID: string) =>
    this.collection
      .find({
        containerID,
        objectType: ObjectTypes.ContainerInvitation,
      })
      .$.subscribe(docs => {
        if (docs) {
          this.setState({
            data: docs.map(doc => doc.toJSON()),
          })
        }
      })
}

export default ContainerInvitationsData