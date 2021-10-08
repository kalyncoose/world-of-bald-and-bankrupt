<template>
  <div id="map">
    <vl-map style="height:100vh;position:absolute;" :load-tiles-while-animating="true" :load-tiles-while-interacting="true"
            data-projection="EPSG:4326" @click="handleClick($event.coordinate)">

      <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation" :min-zoom="4" :max-zoom="20"></vl-view>

      <vl-interaction-select>
        <vl-overlay
            v-for="marker in this.markers.filter(m => m.visible != false)"
            :key="marker.snippet.position"
            :id="marker.snippet.position"
            :position="pointOnSurface({ type: 'Point', coordinates:[marker.geometry.coordinates[1],marker.geometry.coordinates[0]]})"
            :auto-pan="true"
            :offset="[-20,-20]"
            style="padding: 10px">

          <v-card
              v-show="$vuetify.breakpoint.mdAndUp"
              elevation="2"
              outlined
              shaped
              style="max-width:562px;">

            <v-card-title>
              {{ marker.snippet.title }}
            </v-card-title>

            <v-card-subtitle>
              {{ convertDate(marker.snippet.publishedAt) }}
            </v-card-subtitle>

            <iframe width="560" height="315" :src="'https://www.youtube.com/embed/' + marker.snippet.resourceId.videoId" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

            <v-card-actions>
              <v-btn color="red" text @click="marker.visible = false">
                Close
              </v-btn>

              <v-spacer></v-spacer>

              <v-btn icon @click="show = !show">
                <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
            </v-card-actions>

            <v-expand-transition>
              <div v-show="show">
                <v-divider></v-divider>

                <v-card-text style="overflow-wrap:normal">
                  {{ marker.snippet.description }}
                </v-card-text>
              </div>
            </v-expand-transition>
          </v-card>

          <v-card
              v-show="$vuetify.breakpoint.mobile && !$vuetify.breakpoint.mdAndUp"
              elevation="2"
              outlined
              shaped
              style="width:100vw;">

            <v-card-title>
              {{ marker.snippet.title }}
            </v-card-title>

            <v-card-subtitle>
              {{ convertDate(marker.snippet.publishedAt) }}
            </v-card-subtitle>

            <iframe width="100%" height="315" :src="'https://www.youtube.com/embed/' + marker.snippet.resourceId.videoId" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

            <v-card-actions>
              <v-btn color="red" text @click="marker.visible = false">
                Close
              </v-btn>

              <v-spacer></v-spacer>

              <v-btn icon @click="show = !show">
                <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
            </v-card-actions>

            <v-expand-transition>
              <div v-show="show">
                <v-divider></v-divider>

                <v-card-text style="overflow-wrap:normal">
                  {{ marker.snippet.description }}
                </v-card-text>
              </div>
            </v-expand-transition>
          </v-card>

        </vl-overlay>
      </vl-interaction-select>

      <vl-feature v-for="marker in markers" :key="marker.snippet.position">
        <vl-geom-point :coordinates="[marker.geometry.coordinates[1],marker.geometry.coordinates[0]]"></vl-geom-point>
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
import items from '../assets/items.json'

export default {
  name: 'Map',
  data () {
    return {
      i: 0,
      zoom: 4,
      show: false,
      url: 'https://api.mapbox.com/styles/v1/mapbox/cjzeo5d850gca1cquit3q8gs0/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpemc0YWlpNzAwcXUyd21ldDV6OWpxMGwifQ.A92RQZpwUgtGtCmdSE4-ow',
      center: [18.6328125, 31.952162238024975],
      rotation: 0,
      clickCoord: undefined,
      marker: 'https://i.ibb.co/fnV6t3t/bald-marker.png',
      markerOutlined: 'https://i.ibb.co/JtDTKN6/bald-marker-black-outline.png', // 'https://i.ibb.co/1GvXSnX/bald-marker-outlined.png',
      markers: items
    }
  },
  methods: {
    pointOnSurface: findPointOnSurface,

    convertDate(utc) {
      let date = new Date(utc)
      let dateString = '' + date.toString().slice(0,15)
      return dateString
    },

    handleClick(givenCoord) {
      this.clickCoord = givenCoord

      //DEBUG ONLY
      //console.log(this.markers)
      console.log(this.clickCoord)
      //console.log(this.zoom)

      var givenLat = givenCoord[1]
      var givenLong = givenCoord[0]

      for (let i = 0; i < this.markers.length; i++) {
        var point = this.markers[i]
        var lat = point.geometry.coordinates[0]
        var long = point.geometry.coordinates[1]

        if (this.checkCloseCoord(givenLat, givenLong, lat, long)) {
          this.markers[i].visible = true
        } else {
          this.markers[i].visible = false
        }
      }
    },

    checkCloseCoord(lat1, long1, lat2, long2) {
      var resultLat = Math.abs(lat1-lat2)
      var resultLong = Math.abs(long1-long2)
      var desiredDistance;

      if (Math.abs(this.zoom-4) <= 0.5) {
        desiredDistance = 2.75
      } else if (Math.abs(this.zoom-5) <= 0.5) {
        desiredDistance = 1.75
      } else if (Math.abs(this.zoom-6) <= 0.5) {
        desiredDistance = 0.75
      } else if (Math.abs(this.zoom-7) <= 0.5) {
        desiredDistance = 0.5
      } else if (Math.abs(this.zoom-8) <= 0.5) {
        desiredDistance = 0.25
      } else if (Math.abs(this.zoom-9) <= 0.5) {
        desiredDistance = 0.125
      } else if (Math.abs(this.zoom-10) <= 0.5) {
        desiredDistance = 0.0625
      } else if (Math.abs(this.zoom-11) <= 0.5) {
        desiredDistance = 0.03125
      } else if (Math.abs(this.zoom-12) <= 0.5) {
        desiredDistance = 0.015625
      } else if (Math.abs(this.zoom-13) <= 0.5) {
        desiredDistance = 0.0078125
      } else if (Math.abs(this.zoom-14) <= 0.5) {
        desiredDistance = 0.00390625
      } else if (Math.abs(this.zoom-15) <= 0.5) {
        desiredDistance = 0.001953125
      } else if (Math.abs(this.zoom-16) <= 0.5) {
        desiredDistance = 0.0009765625
      } else if (Math.abs(this.zoom-17) <= 0.5) {
        desiredDistance = 0.00048828125
      } else if (Math.abs(this.zoom-18) <= 0.5) {
        desiredDistance = 0.00024414062
      } else if (Math.abs(this.zoom-19) <= 0.5) {
        desiredDistance = 0.00012207031
      } else if (Math.abs(this.zoom-20) <= 0.5) {
        desiredDistance = 0.00006103515
      }

      if (resultLat <= desiredDistance && resultLong <= desiredDistance) {
        for (let i = 0; i < this.markers.length; i++) {
          if (this.markers[i].visible == true)
            return false
        }
        console.log('lat: ' + resultLat + ' long: ' + resultLong);
        return true
      }
      return false
    },
  },
}
</script>

<style scoped>

#map {
  width:100%;
  height:100%;
}

</style>