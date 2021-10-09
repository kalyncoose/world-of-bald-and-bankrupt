<template>
  <div>
    <div id="modal" v-if="showModal">
      <v-card
          elevation="0"
          style="margin-top:100px;"
        >

        <v-card-title>
          {{ modalDetails.snippet.title }}
        </v-card-title>

        <v-card-subtitle>
          {{ convertDate(modalDetails.snippet.publishedAt) }}
        </v-card-subtitle>

        <v-skeleton-loader
            v-if="isLoading"
            class="loader mx-auto"
            width="100%"
            height="300"
            type="list-item-avatar, divider, image, image"
        ></v-skeleton-loader>

        <iframe class="video" :onload="loaded()" width="100%" height="300" :src="'https://www.youtube.com/embed/' + modalDetails.snippet.resourceId.videoId" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

        <v-divider></v-divider>

        <v-card-text style="overflow-wrap:normal">
          {{ modalDetails.snippet.description }}
        </v-card-text>

        <v-card-actions>
          <v-btn color="red" block text outlined @click="showModal = false">
            Close
          </v-btn>

          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </div>

    <div id="map" v-show="!showModal">

      <vl-map style="height:100vh;position:absolute;" :load-tiles-while-animating="true" :load-tiles-while-interacting="true"
              data-projection="EPSG:4326" @click="handleClick($event.coordinate);isLoading = true;">

        <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation" :min-zoom="4" :max-zoom="20"></vl-view>

        <vl-interaction-select>
          <vl-overlay
              v-for="marker in this.markers.filter(m => m.visible !== false)"
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

              <v-skeleton-loader
                  v-if="isLoading"
                  class="loader mx-auto"
                  width="560"
                  height="315"
                  type="list-item-avatar, divider, image, image"
              ></v-skeleton-loader>

              <iframe class="video" :onload="loaded()" width="560" height="315" :src="'https://www.youtube.com/embed/' + marker.snippet.resourceId.videoId" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

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
          <vl-geom-point v-if="checkForCoordinates([marker.geometry.coordinates[1],marker.geometry.coordinates[0]])" :coordinates="[marker.geometry.coordinates[1],marker.geometry.coordinates[0]]"></vl-geom-point>
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
      showModal: false,
      modalDetails: {},
      url: 'https://api.mapbox.com/styles/v1/mapbox/cjzeo5d850gca1cquit3q8gs0/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpemc0YWlpNzAwcXUyd21ldDV6OWpxMGwifQ.A92RQZpwUgtGtCmdSE4-ow',
      center: [18.6328125, 31.952162238024975],
      rotation: 0,
      clickCoord: undefined,
      marker: 'https://i.ibb.co/fnV6t3t/bald-marker.png',
      markerOutlined: 'https://i.ibb.co/JtDTKN6/bald-marker-black-outline.png', // 'https://i.ibb.co/1GvXSnX/bald-marker-outlined.png',
      markers: items,
      isLoading: false,
      isError: false
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

      // Check for Mobile
      if (this.$vuetify.breakpoint.mobile && !this.$vuetify.breakpoint.mdAndUp) {
        this.showModal = true;
      } else {
        this.showModal = false;
      }

      var givenLat = givenCoord[1]
      var givenLong = givenCoord[0]

      for (let i = 0; i < this.markers.length; i++) {
        var point = this.markers[i]
        var lat = point.geometry.coordinates[0]
        var long = point.geometry.coordinates[1]

        if (this.checkCloseCoord(givenLat, givenLong, lat, long)) {
          this.markers[i].visible = true

          // Copy marker details for Mobile
          if (this.showModal) {
            this.modalDetails = this.markers[i]
          } else {
            this.modalDetails = {}
          }
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
          if (this.markers[i].visible === true)
            return false
        }
        console.log('lat: ' + resultLat + ' long: ' + resultLong);
        return true
      }
      return false
    },

    checkForCoordinates(coordinates) {
      // Don't show markers if the coordinates are default 0,0
      if (coordinates[1] === 0 && coordinates[0] === 0) {
        return false
      } else { // Show all markers with non-default coordinates
        return true
      }
    },

    sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    },

    loaded() {
      //DEBUG ONLY
      //console.log('Loading video')
      this.sleep(500).then(() => {
        //console.log('Video loaded')
        this.isLoading = false;
      })
    }
  }
}
</script>

<style scoped>

#map {
  width:100%;
  height:100%;
}

#modal {
  z-index: 2;
}

.video {
  z-index: 1;
  position: relative;
}

.loader {
  z-index: 0;
  position:absolute;
}

</style>