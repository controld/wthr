import React from 'react'
import { render } from 'react-dom'
import './styles.scss'
import WthrStatus from './wthrStatus'

// import fetchPointData from './wthrFetch'

const App = () => {
  // kicks off weather data fetch
  // fetchPointData()
  return (
    <div>
      <h3>Not Quite Ready for Prime Time</h3>
      <WthrStatus />
    </div>
  )
}

render(<App />, document.getElementById('app'))
