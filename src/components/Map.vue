<template>
  <div id="map">
    <vl-map style="height:100vh;position:absolute;" :load-tiles-while-animating="true" :load-tiles-while-interacting="true"
            data-projection="EPSG:4326" @click="handleClick($event.coordinate)">

      <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation"></vl-view>

      <vl-interaction-select>
        <vl-overlay
            v-for="point in this.points.filter(result => result.visible === true)"
            :key="point.id"
            :id="point.id"
            :position="pointOnSurface(point.geometry)"
            :auto-pan="true"
            :offset="[-20,-20]"
            :auto-pan-animation="{ duration: 300 }"
            style="padding: 10px">

            <v-card
                elevation="2"
                outlined
                shaped
                style="max-width:562px;">

              <v-card-title>
                Solo In Estonia's East
              </v-card-title>

              <v-card-subtitle>
                14 February 2021
              </v-card-subtitle>

              <iframe width="560" height="315" src="https://www.youtube.com/embed/1ltZR9IWXaE" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

              <v-card-actions>
                <v-btn
                    color="red"
                    text
                    @click="point.visible = false"
                >
                  Close
                </v-btn>

                <v-spacer></v-spacer>

                <v-btn
                    icon
                    @click="show = !show"
                >
                  <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="show">
                  <v-divider></v-divider>

                  <v-card-text style="overflow-wrap:normal">
                    🇪🇪 We all know about Tallinn the vibrant capital of Estonia with its tech start-ups and modern infrastructure. It's lauded as a miracle of the post-Soviet sphere and rightly so. But what about the rest of the country? Is that reaping the benefits of EU accession too? I jumped on a train heading east to find out...
                  </v-card-text>
                </div>
              </v-expand-transition>
            </v-card>

        </vl-overlay>
      </vl-interaction-select>

      <vl-feature v-for="point in points" :key="point.id">
        <vl-geom-point :coordinates="[point.geometry.coordinates[1], point.geometry.coordinates[0]]"></vl-geom-point>
        <vl-style-box>
          <vl-style-icon
              :src="markerOutlined"
              :scale="0.2"
              :anchor="[1,1]"
          ></vl-style-icon>
        </vl-style-box>
      </vl-feature>

      <vl-layer-tile>
        <vl-source-xyz :url="url"></vl-source-xyz>
      </vl-layer-tile>

    </vl-map>
  </div>
</template>

<script>
import { findPointOnSurface } from 'vuelayers/lib/ol-ext'

export default {
  name: 'Map',
  data () {
    return {
      i: 0,
      zoom: 3,
      show: false,
      url: 'https://api.mapbox.com/styles/v1/mapbox/cjzeo5d850gca1cquit3q8gs0/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpemc0YWlpNzAwcXUyd21ldDV6OWpxMGwifQ.A92RQZpwUgtGtCmdSE4-ow',
      center: [18.6328125, 31.952162238024975],
      rotation: 0,
      clickCoord: undefined,
      marker: 'https://i.ibb.co/fnV6t3t/bald-marker.png',
      markerOutlined: 'https://i.ibb.co/1GvXSnX/bald-marker-outlined.png',
      points: [
        { id: 1, visible: true, geometry: { type: 'Point', coordinates: [0,0] } },
        { id: 2, visible: false, geometry: { type: 'Point', coordinates: [1,1] } },
        { id: 3, visible: false, geometry: { type: 'Point', coordinates: [2,2] } },
        { id: 4, visible: false, geometry: { type: 'Point', coordinates: [3,3] } },
      ],
      selectedFeatures: []
    }
  },
  methods: {
    pointOnSurface: findPointOnSurface,

    handleClick(givenCoord) {
      this.clickCoord = givenCoord
      //console.log(this.clickCoord)
      var givenLat = givenCoord[1]
      var givenLong = givenCoord[0]

      for (let i = 0; i < this.points.length; i++) {
        var point = this.points[i]
        var lat = point.geometry.coordinates[0]
        var long = point.geometry.coordinates[1]

        if (this.checkCloseCoord(givenLat, givenLong, lat, long)) {
          this.points[i].visible = true
        }
      }
    },

    checkCloseCoord(lat1, long1, lat2, long2) {
      var resultLat = Math.abs(lat1-lat2)
      var resultLong = Math.abs(long1-long2)

      if (resultLat <= 0.5 && resultLong <= 0.5)
        return true

      return false
    }
  },
}
</script>

<style scoped>

#map {
  width:100%;
  height:100%;
}

</style>