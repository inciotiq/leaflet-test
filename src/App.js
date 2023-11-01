import './App.css'
import React, { useEffect } from 'react'
import L from 'leaflet'
import data from './map/114.json'
import route from './map/route.json'

function App () {
  useEffect(() => {
    let map = L.map('map').setView([39.9397184, 32.8584139], 21)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxNativeZoom: 19,
      maxZoom: 22,
      minZoom: 17,
      attribution: '© OpenStreetMap'
    }).addTo(map)

    let northEast = L.latLng(39.9398983, 32.8577927)
    let southWest = L.latLng(39.9391385, 32.8590184)
    map.setMaxBounds(L.latLngBounds(southWest, northEast))

    L.polyline(route.routes[0].decodedGeometry, { color: 'red' }).addTo(map)
    let indoorLayer0 = L.geoJSON(data.features, {
      filter: filterLevel(0)
    }).addTo(map)

    // let indoorLayer1 = L.geoJSON(data.features, {
    //   filter: filterLevel(1)
    // }).addTo(map)

    const layerControl = L.control.layers().addTo(map)

    layerControl.addOverlay(indoorLayer0, 'Level 0')
    // layerControl.addOverlay(indoorLayer1, 'Level 1')

    return () => {
      map.remove()
    }
  }, [])

  return (
    <div className="App">
    </div>
  )
}

let filterLevel = (tlevel) => {
  return (feature, layer) => {
    try {
      let indoor = feature.properties.indoor
      let level = feature.properties.level

      return !!indoor && level == tlevel
    } catch (e) {
      // console.error('not an indoor feature')
    }
  }
}

export default App
