import './App.css'
import React from 'react'
import L from 'leaflet'
import data from './map/114.json'

// import {MapRenderer}  from './MapRenderer'

function App () {

  let map = L.map('map').setView([39.8819, 32.7952], 18)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map)

  let indoorLayer0 = L.geoJSON(data.features, {
    filter: (feature, layer) => {
      try {
        let indoor = feature.properties.indoor
        let level = feature.properties.level
        return !!indoor && level == 0
      } catch (e) {
        // console.error('not an indoor feature')
      }
    }
  }).addTo(map)

  let indoorLayer1 = L.geoJSON(data.features, {
    filter: (feature, layer) => {
      try {
        let indoor = feature.properties.indoor
        let level = feature.properties.level

        return !!indoor && level == 1
      } catch (e) {
        // console.error('not an indoor feature')
      }
    }
  }).addTo(map)

  const layerControl = L.control.layers().addTo(map)

  let layerGroup = L.layerGroup([indoorLayer0, indoorLayer1])

  layerControl.addOverlay(layerGroup, 'indoor')

  return (
    <div className="App">
      {/*<MapRenderer/>*/}
    </div>
  )
}

export default App
