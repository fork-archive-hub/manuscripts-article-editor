import { Formik, FormikActions, FormikErrors, FormikProps } from 'formik'
import * as React from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, RouteProps } from 'react-router'
import { RxDocument } from 'rxdb'
import { Subscription } from 'rxjs'
import {
  CollaboratorErrors,
  CollaboratorForm,
  CollaboratorValues,
} from '../components/CollaboratorForm'
import CollaboratorPage from '../components/CollaboratorPage'
import { FormPage } from '../components/Form'
import { waitForDB } from '../db'
import Spinner from '../icons/spinner'
import { ConnectedReduxProps } from '../store/types'
import { MANUSCRIPT } from '../transformer/object-types'
import { Collaborator, Manuscript } from '../types/components'
import { collaboratorSchema } from '../validation'

interface CollaboratorPageContainerState {
  collaborator: RxDocument<Collaborator> | null
  manuscripts: Array<RxDocument<Manuscript>> | null
  editing: boolean
  error: string | null
}

interface CollaboratorPageContainerProps {
  id: string
}

interface CollaboratorPageRoute extends Route<RouteProps> {
  id: string
}

class CollaboratorPageContainer extends React.Component<
  CollaboratorPageContainerProps &
    RouteComponentProps<CollaboratorPageRoute> &
    ConnectedReduxProps<{}>
> {
  public state: CollaboratorPageContainerState = {
    collaborator: null,
    manuscripts: null,
    editing: false,
    error: null,
  }

  private subs: Subscription[] = []

  public componentDidMount() {
    const { id } = this.props.match.params

    waitForDB
      .then(db => {
        this.subs.push(
          db.collaborators.findOne({ _id: id }).$.subscribe(collaborator => {
            this.setState({ collaborator })
          })
        )

        this.subs.push(
          db.components
            .find()
            .where('objectType')
            .eq(MANUSCRIPT)
            .and('collaborator')
            .eq(id) // TODO: does this mapping work?
            .$.subscribe(manuscripts => {
              this.setState({ manuscripts })
            })
        )
      })
      .catch((error: Error) => {
        this.setState({
          error: error.message,
        })
      })
  }

  public componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  public render() {
    const { collaborator, manuscripts, editing } = this.state

    if (collaborator === null || manuscripts === null) {
      return <Spinner />
    }

    if (editing) {
      return (
        <FormPage>
          <Formik
            initialValues={{
              name: collaborator.name || '',
              surname: collaborator.surname || '',
            }}
            validationSchema={collaboratorSchema}
            isInitialValid={true}
            onSubmit={this.handleSubmit}
            render={(
              formikProps: FormikProps<CollaboratorValues & CollaboratorErrors>
            ) => (
              <CollaboratorForm
                {...formikProps}
                stopEditing={this.stopEditing}
                deleteCollaborator={this.deleteCollaborator}
              />
            )}
          />
        </FormPage>
      )
    }

    return (
      <CollaboratorPage
        collaborator={collaborator}
        manuscripts={manuscripts}
        startEditing={this.startEditing}
      />
    )
  }

  private startEditing = () => {
    this.setState({
      editing: true,
    })
  }

  private stopEditing = () => {
    this.setState({
      editing: false,
    })
  }

  private deleteCollaborator = () => {
    // TODO: confirm

    const doc = this.state.collaborator as RxDocument<Collaborator>

    doc.remove().then(() => {
      this.props.history.push('/collaborators')
    })
  }

  private handleSubmit = (
    values: CollaboratorValues,
    {
      setSubmitting,
      setErrors,
    }: FormikActions<CollaboratorValues | CollaboratorErrors>
  ) => {
    const doc = this.state.collaborator as RxDocument<Collaborator>

    doc
      .update({
        $set: values,
      })
      .then(
        () => {
          setSubmitting(false)

          this.setState({
            editing: false,
          })
        },
        error => {
          setSubmitting(false)

          // TODO: handle database errors instead of axios errors

          const errors: FormikErrors<CollaboratorErrors> = {
            givenName: null,
            familyName: null,
            submit: error.response
              ? error.response.data.error
              : 'There was an error',
          }

          setErrors(errors)
        }
      )
  }
}

export default connect()(CollaboratorPageContainer)