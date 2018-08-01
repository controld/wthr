// See: https://forecast-v3.weather.gov/documentation?redirect=legacy
//
// TODO:
//  put URLs in constants
//  convert from fetch to Axios, because it's all the rage
//  test with https to see if Safari works
//  explore other APIs
//
const fetchPointData = async (lat, lon) => {
  // From https://forecast-v3.weather.gov/documentation?redirect=legacy:
  // Metadata about a point. This is the primary endpoint for forecast information for a location.
  // It contains linked data for the forecast, the hourly forecast, observation and other information.
  const localPoints = 'https://api.weather.gov/points/'
  const pointsUrl = `${localPoints}${lat},${lon}`
  return window.fetch(pointsUrl)
}
// wfo is the weather forecast office id
// See https://en.wikipedia.org/wiki/List_of_National_Weather_Service_Weather_Forecast_Offices
const fetchGridPointsData = async (wfo, gridX, gridY) => {
  // Raw (commonly referred to as "gridded") data provided by the Weather Office.
  // Every forecast request will use this data to build the forecast response.
  // The grid for a given location is determined by the "property.forecastGridData"
  // property in the /points/{lat},{lon} endpoint.
  const gridPoints = 'https://api.weather.gov/gridpoints/'
  const gridPointsUrl = `${gridPoints}${wfo}/${gridX},${gridY}`
  return window.fetch(gridPointsUrl)
}
// /points/{point}/forecast
// For instance: "https://api.weather.gov/gridpoints/MPX/109,69/forecast"
const fetchStationForecast = async (stationForecastUrl = 'https://api.weather.gov/gridpoints/MPX/109,69/forecast') => {
  return window.fetch(stationForecastUrl)
}
// /points/{point}/stations
// For instance: "https://api.weather.gov/gridpoints/MPX/109,69/stations"
// Stations nearest to a point in order of distance.
const fetchStationList = async (stationsUrl = 'https://api.weather.gov/gridpoints/MPX/109,69/stations') => {
  return window.fetch(stationsUrl)
}
const getLatLon = async () => {
  return new Promise(
    (resolve, reject) => {
      function positionOK (position) {
        resolve(position)
      }
      function err (error) {
        // failure is always an option with Safari w/o a secure web server
        console.log(`failed to geolocate: ERROR(${error.code}): ${error.message}`)
        reject(error)
      }
      window.navigator && window.navigator.geolocation.getCurrentPosition(positionOK, err)
    })
}

module.exports = { getLatLon, fetchPointData, fetchGridPointsData, fetchStationForecast, fetchStationList }
