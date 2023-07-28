import React, { useEffect } from 'react'
import { MapContainer, useMap } from 'react-leaflet'
import L from 'leaflet'

// import data from './map/114.json'
const TileLayer = () => {

  let map = useMap()

  useEffect(() => {
    if (!map) return

    const NewTileLayer = L.TileLayer.extend({
      getTileUrl: () => {
        return `https://tile.openstreetmap.org/{z}/{x}/{y}.png`
      }
    })

    map.addControl(new NewTileLayer())

  }, [map])

  return null
}

export const MapRenderer = () => {
  return <MapContainer
    crs={L.CRS.Simple}
    center={[0, 0]}
    zoom={5}
    scrollWheelZoom={false}
  >
    <TileLayer/>
  </MapContainer>
}

// export default MapRenderer

// componentDidMount () {

// let map = L.map('map').setView([39.8819, 32.7952], 18)
// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   maxZoom: 19,
//   attribution: '© OpenStreetMap'
// }).addTo(map)

// L.geoJSON(data.features, {
//   filter: (feature, layer) => {
//     try {
//       let indoor = feature.properties.indoor
//       return !!indoor
//     } catch (e) {
//       // console.error('not an indoor feature')
//     }
//   }
// }).addTo(map)

// const layerControl = L.control.layers().addTo(map)
//
// let layerGroup = L.layerGroup([indoorLayer])
//
// layerControl.addOverlay(layerGroup, 'indoor')
// }