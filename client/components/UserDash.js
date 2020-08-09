import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

// import {getFitbitProfile} from '../store/user'
import {Button, Link, Divider} from '@material-ui/core'

/**
 //* COMPONENT
 */
export const UserDash = props => {
  const {email} = props

  return (
    <div>
      <h3>Welcome, {email}</h3>
      {/* <div className='oauth'>
        <Button 
          variant='contained' 
          type='button'
          className='google'
          onClick={getFitbitProfile}
        >
          Connect Fitbit
        </Button>
      </div> */}
      <div className="oauth">
        <Button
          variant="contained"
          type="button"
          component={Link}
          href="/auth/fitbit"
          className="fitbit"
        >
          {/* {displayStatus} with Fitbit */}
          Connect Fitbit
        </Button>
      </div>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  console.log('Mapping State to Props: ', state)
  return {
    email: state.user.email
  }
}

export default connect(mapState)(UserDash)

/**
 * PROP TYPES
 */
UserDash.propTypes = {
  email: PropTypes.string
}
