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
      filter: filterLevel(0)
    }).addTo(map)

    // let indoorLayer1 = L.geoJSON(data.features, {
    //   filter: filterLevel(1)
    // }).addTo(map)

    const layerControl = L.control.layers().addTo(map)

    layerControl.addOverlay(indoorLayer0, 'Level 0')
    // layerControl.addOverlay(indoorLayer1, 'Level 1')

    let doors = []

    for (let featuresKey of data.features) {
      if (featuresKey.geometry.type === 'LineString' && featuresKey.properties.highway === 'footway') {
        let latlngs = featuresKey.geometry.coordinates.map((lonlat) => [lonlat[1], lonlat[0]])

        L.polyline(latlngs, { color: 'green' }).addTo(map)

        for (const latlng of latlngs) {
          L.circle(latlng, {
            color: 'green',
            radius: .3, stroke: false, fillOpacity: 1
          }).bindPopup(`"latitude": ${latlng[0]}, "longitude": ${latlng[1]}`).addTo(map)
        }
      } else if (featuresKey.geometry.type === 'Point' && featuresKey.properties.door) {
        let latlng = featuresKey.geometry.coordinates

        let door = L.circle({
          lat: latlng[1],
          lon: latlng[0]
        }, {
          radius: .3,
          fillColor: 'black',
          fillOpacity: 1,
          stroke: false
        }).bindPopup(`"latitude": ${latlng[1]}, "longitude": ${latlng[0]}`)
        doors.push(door)
      }
    }

    L.polyline(route.routes[0].decodedGeometry, { color: 'red' }).addTo(map)

    doors.forEach(door => door.addTo(map))

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
