import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import { ObjectTypes, UserProfile } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { buildUser } from '../lib/data'
import { Collection } from '../sync/Collection'
import CollectionManager from '../sync/CollectionManager'
import { DataComponent } from './DataComponent'

interface Props {
  children: (
    data: UserProfileWithAvatar,
    collection: Collection<UserProfileWithAvatar>
  ) => React.ReactNode
  placeholder?: React.ReactNode
  userID: string
}

interface State {
  data?: UserProfileWithAvatar
}

class UserData extends DataComponent<UserProfile, Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {}

    this.collection = CollectionManager.getCollection<UserProfile>('user')
  }

  public componentDidMount() {
    const { userID } = this.props

    this.collection.addEventListener('complete', this.handleComplete)

    this.sub = this.subscribe(userID)
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { userID } = nextProps

    if (userID !== this.props.userID) {
      this.sub.unsubscribe()

      this.setState({ data: undefined })

      this.sub = this.subscribe(userID)
    }
  }

  public componentWillUnmount() {
    this.collection.removeEventListener('complete', this.handleComplete)

    this.sub.unsubscribe()
  }

  private subscribe = (userID: string) =>
    this.collection
      .findOne({
        userID, // NOTE: finding by `userID` not `_id`
        objectType: ObjectTypes.UserProfile,
      })
      .$.subscribe(async doc => {
        if (doc) {
          this.setState({
            data: await buildUser(doc),
          })
        }
      })
}

export default UserData
