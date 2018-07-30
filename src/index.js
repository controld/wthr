import React from 'react'
import { render } from 'react-dom'
import './styles.scss'
import fetchPointData from './wthrFetch'

const App = () => {
  // kicks off weather data fetch
  fetchPointData()
  return (
    <div>
      <h3>Mark's Application Is Not Quite Ready for Prime Time</h3>
    </div>
  )
}

render(<App />, document.getElementById('app'))
