// *** FROM: https://github.com/Holmesc16/holmesfitness/blob/master/src/utils/fetchFitbitData.js
// *** Holmes Fitness Dashboard

// import react, { useState } from 'react'
// import axios from 'axios'

// const FetchFitbitData  = (url, fitbitToken, key) => {
//     const [stateKey, setStateKey] = useState(null)

//     axios({
//       method: 'get',
//       url: 'https://api.fitbit.com/1/user/-/' + url,
//       headers: { 'Authorization': 'Bearer ' + fitbitToken },
//       mode: 'cors'
//     })
//       .then(response => {
//         console.log(response)
//         setStateKey(response.data)
//         return stateKey
//       })
//       .catch(error => console.log(error))
//   }

//   export default FetchFitbitData
