import React from 'react'
import { getLatLon, fetchPointData, fetchGridPointsData, fetchStationForecast, fetchStationList } from './wthrFetch'

class WthrStatus extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      position: null,
      pointData: null,
      gridPointsData: null
    }
  }
  async getPointData (lat, lon) {
    try {
      let res = await fetchPointData(lat, lon)
      let json = await res.json()
      this.setState({pointData: json})
    } catch (error) {
      console.log(`getPointData: fetchPointData returned error: ${error.code}: ${error.message}`)
    }
  }
  async getGridPointsData (lat, lon, wfo) {
    try {
      let gridPointsData = await fetchGridPointsData(lat, lon, wfo)
      let json = await gridPointsData.json()
      this.setState({getGridPointsData: json})
    } catch (error) {
      console.log(`getGridPointsData: fetchGridPointsData returned error: ${error.code}: ${error.message}`)
    }
  }
  async getPosition () {
    try {
      let latLon = await getLatLon()
      this.setState({position: latLon})
    } catch (error) {
      console.log(`getPosition: getLatLon returned error: ${error.code}: ${error.message}`)
    }
  }
  componentDidMount () {
    this.getPosition()
  }
  componentWillUpdate (nextProps, nextState) {
    // states:
    // + have no position and no point and grid points data
    // + have position but no point and grid points data
    // + have position and point and no grid points data
    // + have position, point and grid points data
    // TODO: hacky, make less so, like store in redux
    //
    console.log(`componentWillUpdate: this.state=%O nextState=%O`, this.state, nextState)
    const { position, pointData } = this.state
    const nextPosition = nextState.position
    if (position === null && nextPosition !== null) {
      this.getPointData(nextPosition.coords.latitude, nextPosition.coords.longitude)
    } else {
      if (position !== null && (pointData === null && nextState.pointData !== null)) {
        const { cwa, gridX, gridY } = nextState.pointData.properties
        this.getGridPointsData(cwa, gridX, gridY)
      }
    }
  }
  renderWthrInfo () {
    const { pointData, position } = this.state
    const { city, state } = pointData.properties.relativeLocation.properties
    return (
      <div>
        <div>latitude: {position.coords.latitude}</div>
        <div>longitude: {position.coords.longitude}</div>
        <div>{pointData.properties.cwa}</div>
        <div>{city}</div>
        <div>{state}</div>
      </div>
    )
  }
  render () {
    const { pointData, position } = this.state
    const havePosition = position !== null
    const haveWthrInfo = pointData !== null
    let msg
    if (!havePosition) {
      msg = 'getting latitude/longitude'
    } else if (!haveWthrInfo) {
      msg = `latitude: ${position.coords.latitude} longitude: ${position.coords.longitude}, getting weather info`
    }
    return (havePosition && haveWthrInfo) ? this.renderWthrInfo()
      : (
        <span>Loading {msg}</span>
      )
  }
}

module.exports = WthrStatus
