import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {getFitbitProfile, connectStream} from '../store/user'
// import fitbit from '../../server/api/fitbit'
import {Button, Link, Divider} from '@material-ui/core'

/**
 //* COMPONENT
 */
export const FitbitDash = props => {
  // const {user} = props
  // props.isLoggedIn ? getFitbitProfile(props.userId) : getFitbitProfile(null)
  // props.isLoggedIn ? connectStream('fitbit') : connectStream('nada')

  // if (props.fitbit.loading) return <div>loading...</div>
  // if (props.fitbit) {
  return (
    <div>
      {/* <h3>Welcome, {props.fitbit.fitbitId}</h3> */}
      <h3>Welcome, {props.user.email}</h3>
      <h4>You are currently viewing the Fitbit Dash.</h4>

      <div className="oauth">
        <Button
          variant="contained"
          type="button"
          className="fitbit"
          // onClick={getFitbitProfile()}
          onClick={() => props.connectStream('fitbit', props.userId)}
        >
          Connect Fitbit (double-check connection)
        </Button>
      </div>
      <div className="oauth">
        <Button
          variant="contained"
          type="button"
          className="fitbit_profile"
          // onClick={getFitbitProfile()}
          onClick={() => props.getFitbitProfile(props.userId)}
        >
          Import Fitbit Profile
        </Button>
      </div>
    </div>
  )
  // }
}

//TODO: Clean up state!
/**
 //* CONTAINER
 */
const mapState = state => {
  console.log('Mapping State to Props: ', state)
  return {
    userId: state.user.id,
    user: state.user,
    // profile: state.fitbit.profile,
    profile: state.profile,
    // fitbit: state.fitbit,
    // loading: state.fitbit.loading,
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  console.log('Mapping dispatch to props')
  return {
    getFitbitProfile: userId => dispatch(getFitbitProfile(userId)),
    connectStream: (dataStream, userId) =>
      dispatch(connectStream(dataStream, userId))
  }
}

export default connect(mapState, mapDispatch)(FitbitDash)

/**
 //* PROP TYPES
 */
FitbitDash.propTypes = {
  user: PropTypes.object
}
