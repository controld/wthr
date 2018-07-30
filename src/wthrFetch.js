const fetchPointData = async () => {
  // experiment with various NOAA weather APIs to see what they return
  const doSomething = async (lat, lon) => {
    console.log(`doSomething: lat=${lat} lon=${lon}`)
    let localPoints = 'https://api.weather.gov/points/'
    let gridPoints = 'https://api.weather.gov/gridpoints/'
    let forecast = 'https://api.weather.gov/points/'
    let wthrResults = new Map()

    const pointsUrl = `${localPoints}${lat},${lon}`
    let json
    try {
      const res = await window.fetch(pointsUrl)
      json = await res.json()
      wthrResults.set('localPoints', json)
      console.log(`cwa=${json.properties.cwa} gridX=${json.properties.gridX} gridY=${json.properties.gridY}`)
    } catch (err) {
      console.log(`fetch or JSON parse for ${pointsUrl} failed, err=%O`, err)
      return wthrResults
    }
    const gridPointsUrl = `${gridPoints}${json.properties.cwa}/${json.properties.gridX},${json.properties.gridY}`
    console.log(`gridPointsUrl=${gridPointsUrl}`)
    try {
      const gridPointsRes = await window.fetch(gridPointsUrl)
      const gridPointsJson = await gridPointsRes.json()
      wthrResults.set('gridPoints', gridPointsJson)
      console.log(`gridPointsJson=%O`, gridPointsJson)
    } catch (err) {
      console.log(`fetch or JSON parse for ${gridPointsUrl} failed, err=%O`, err)
      return wthrResults
    }
    const forecastUrl = `${forecast}${lat},${lon}`
    console.log(`forecastUrl=${forecastUrl}`)
    let forecastJson
    try {
      const pointsForecast = await window.fetch(forecastUrl)
      forecastJson = await pointsForecast.json()
      wthrResults.set('pointsForecast', forecastJson)
      console.log(`forecastJson=%O`, forecastJson)
    } catch (err) {
      console.log(`fetch or JSON parse for ${forecastUrl} failed, err=%O`, err)
      return wthrResults
    }
    const stationForecastUrl = forecastJson.properties.forecast
    console.log(`stationForecastUrl=${stationForecastUrl}`)
    try {
      const stationForecast = await window.fetch(stationForecastUrl)
      const stationForecastJson = await stationForecast.json()
      wthrResults.set('stationForecast', stationForecastJson)
      console.log(`stationForecastJson=%O`, stationForecastJson)
    } catch (err) {
      console.log(`fetch or JSON parse for ${stationForecastUrl} failed, err=%O`, err)
      return wthrResults
    }
    let stationsUrl = `${forecast}${lat},${lon}/stations`
    let stationListJson
    try {
      const stationList = await window.fetch(stationsUrl)
      stationListJson = await stationList.json()
      wthrResults.set('stationList', stationListJson)
      console.log(`stationListJson=%O`, stationListJson)
    } catch (err) {
      console.log(`fetch or JSON parse for ${stationsUrl} failed, err=%O`, err)
    }
    console.log(`wthrResults=%O`, wthrResults)
  }

  // kick off weather info fetch by first getting latitude and longitude
  navigator && navigator.geolocation.getCurrentPosition((position) => {
    doSomething(position.coords.latitude, position.coords.longitude)
  })
}

module.exports = fetchPointData
