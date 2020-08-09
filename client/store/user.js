import axios from 'axios'
import history from '../history'

/**
 //* ACTION TYPES
 */
const GET_USER = 'GET_USER'
const CONNECTED_STREAM = 'CONNECTED_STREAM'
const GOT_FITBIT_PROFILE = 'GET_FITBIT_PROFILE'
const REMOVE_USER = 'REMOVE_USER'

/**
 //* INITIAL STATE
 */
const defaultUser = {}

/**
 //* ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user})
const connectedStream = stream => ({type: CONNECTED_STREAM, stream})
const gotFitbitProfile = profile => ({type: GOT_FITBIT_PROFILE, profile})
const removeUser = () => ({type: REMOVE_USER})

/**
 //* THUNK CREATORS
 */
export const me = () => async dispatch => {
  try {
    const res = await axios.get('/auth/me')
    dispatch(getUser(res.data || defaultUser))
  } catch (err) {
    console.error(err)
  }
}
export const auth = (email, password, method) => async dispatch => {
  let res
  try {
    res = await axios.post(`/auth/${method}`, {email, password})
  } catch (authError) {
    return dispatch(getUser({error: authError}))
  }

  try {
    dispatch(getUser(res.data))
    history.push('/dash')
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}
export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout')
    dispatch(removeUser())
    history.push('/login')
  } catch (err) {
    console.error(err)
  }
}
export const connectStream = (dataStream, userId) => async dispatch => {
  try {
    const {data} = await axios.get(`/auth/${dataStream}/success/${userId}`)
    dispatch(connectedStream(data))
  } catch (error) {
    console.log(`Whoops, trouble connecting to ${dataStream}!`, error)
  }
}
export const getFitbitProfile = userId => {
  return async dispatch => {
    try {
      console.log('In Fitbit Profile THUNK ==>')
      // ? Do we want to do a direct external API call here?
      // const {data} = await axios.get('https://api.fitbit.com/1/user/-/profile.json')
      const {data} = await axios.get(`/api/fitbit/${userId}/profile`)
      console.log(data)
      dispatch(gotFitbitProfile(data))
    } catch (error) {
      console.log('Whoops, trouble getting Fitbit profile!', error)
    }
  }
}

/**
 //* REDUCER
 */
export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user
    case CONNECTED_STREAM:
      if (action.stream === 'fitbit') return {...state, fitbit: action.stream}
      else return {...state, stream: action.stream}
    case GOT_FITBIT_PROFILE:
      // return {...state, fitbit: {...state.fitbit, profile: action.profile}}
      return {...state, profile: action.profile}
    case REMOVE_USER:
      return defaultUser
    default:
      return state
  }
}
