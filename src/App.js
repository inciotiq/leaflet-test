import './App.css'
import React, { useEffect } from 'react'
import L from 'leaflet'
import data from './map/114.json'

function App () {
  useEffect(() => {
    let map = L.map('map').setView([39.8819, 32.7952], 18)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map)

    let indoorLayer0 = L.geoJSON(data.features, {
      filter: filterLevel(0)
    }).addTo(map)

    let indoorLayer1 = L.geoJSON(data.features, {
      filter: filterLevel(1)
    }).addTo(map)

    const layerControl = L.control.layers().addTo(map)

    layerControl.addOverlay(indoorLayer0, 'Level 0')
    layerControl.addOverlay(indoorLayer1, 'Level 1')

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
