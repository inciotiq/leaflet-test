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
    // map.setMaxBounds(L.latLngBounds(southWest, northEast))

    let indoorLayer0 = L.geoJSON(data.features, {
      filter: filterLevel(0),
      style: styleFeatures(),
      pointToLayer: pointMarkers(),
      onEachFeature: onEachFeature
    }).addTo(map)

    let indoorLayer1 = L.geoJSON(data.features, {
      filter: filterLevel(1),
      style: styleFeatures(),
      pointToLayer: pointMarkers(),
      onEachFeature: onEachFeature
    }).addTo(map)

    const layerControl = L.control.layers().addTo(map)

    layerControl.addOverlay(indoorLayer0, 'Level 0')
    layerControl.addOverlay(indoorLayer1, 'Level 1')
    let routeLayer = L.polyline(route.routes[0].decodedGeometry, { color: 'red' }).addTo(map)

    layerControl.addOverlay(routeLayer, 'route')

    //
    // doors.forEach(door => door.addTo(map))

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
      let door = feature.properties.door
      let highway = feature.properties.highway
      let level = feature.properties.level

      return level == tlevel && (!!indoor || !!door || !!highway)
    } catch (e) {
      // console.error('not an indoor feature')
    }
  }
}

let styleFeatures = () => {
  return (featuresKey) => {
    if (featuresKey.properties.highway === 'footway') {
      return { color: '#7b8e93' }
    // } else if (featuresKey.properties.door) {
    //   return { color: '#50b2d0' }
    } else if (featuresKey.properties.indoor == 'room') {
      return { color: '#b68573' }
    } else {
      return { color: '#fff' }
    }
  }
}

function pointMarkers () {
  return function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 6,
      fillColor: '#577983',
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    })
  }
}

function onEachFeature (feature, layer) {
  // does this feature have a property named popupContent?
  let latlng = feature.geometry.coordinates
  if (feature.geometry.type === 'Point' && latlng) {

    layer.bindPopup(`"latitude": ${latlng[1]}, "longitude": ${latlng[0]}, "level": ${feature.properties.level}`)
  }
}

export default App
