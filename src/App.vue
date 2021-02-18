<template>
  <v-app>
    <v-system-bar
        dark
        color="dark"
        style="z-index:999;bottom:0;left:0;position:fixed;opacity:70%;"
        @click="openGH"
    >
      <span style="margin-right:5px;">Made with</span>
      <v-icon style="color:red;">mdi-heart</v-icon>
      <span style="margin-left:5px;">by <u>Kalyn</u></span>
    </v-system-bar>

    <v-system-bar
        dark
        color="dark"
        style="z-index:999;bottom:0;right:0;position:fixed;opacity:70%;"
    >
      <span style="margin-right:5px;">Using</span>
      <v-icon>mdi-wrench</v-icon>
      <span style="margin-left:5px;"><a href="https://vuejs.org/" target="_blank">Vue.js</a> <b>&middot;</b> <a href="https://openlayers.org/" target="_blank">OpenLayers</a> <b>&middot;</b> <a href="https://www.mapbox.com/" target="_blank">Mapbox</a></span>
    </v-system-bar>

    <v-app-bar
        absolute
        color="#ff0000"
        dark
        dense
        shrink-on-scroll
        prominent
        src="./assets/banner.png"
        fade-img-on-scroll
        scroll-target="#scrolling-techniques-5"
        scroll-threshold="500"
    >
      <template v-slot:img="{ props }">
        <v-img
            v-bind="props"
            gradient="to top, rgba(255,0,0,.6), rgba(255,0,0,.5)"
        ></v-img>
      </template>

      <v-list-item style="max-width:30%;margin:auto;">
        <v-list-item-avatar>
          <v-img
              class="elevation-6"
              alt=""
              src="https://yt3.ggpht.com/ytc/AAUvwng0J8dnyjFIL2Ppu68MaztExk427GuIgZ8OuTiwBA=s88-c-k-c0x00ffffff-no-rj"
          ></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title><b>bald and bankrupt &middot;</b> 2.67M subscribers</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-spacer></v-spacer>

      <div style="margin:auto;">
        <v-btn icon @click="openYT">
          <v-icon>mdi-youtube</v-icon>
        </v-btn>

        <v-btn icon @click="openIG">
          <v-icon>mdi-instagram</v-icon>
        </v-btn>

        <v-btn icon @click="openTS">
          <v-icon>mdi-tshirt-crew</v-icon>
        </v-btn>

        <v-btn icon @click="openAMZ">
          <v-icon>mdi-amazon</v-icon>
        </v-btn>
      </div>
    </v-app-bar>
    <v-main id="main">
      <Map id="map" />
    </v-main>
  </v-app>
</template>

<script>
import Map from './components/Map'

export default {
  name: 'App',
  components: {
    Map,
  },

  data: () => ({
    //
  }),
  methods: {
    openYT () {
      window.open('https://www.youtube.com/channel/UCxDZs_ltFFvn0FDHT6kmoXA', '_blank');
    },
    openIG () {
      window.open('https://www.instagram.com/realbaldandbankrupt', '_blank');
    },
    openAMZ () {
      window.open('https://www.amazon.com/BURNING-EDGE-TRAVELS-THROUGH-IRRADIATED-ebook/dp/B07C56KSV1/ref=sr_1_1?dchild=1&keywords=the+burning+edge&qid=1587541259&sr=8-1', '_blank');
    },
    openTS () {
      window.open('https://teespring.com/stores/bald-and-bankrupt', '_blank');
    },
    openGH () {
      window.open('https://github.com/kalyncoose/world-of-bald', '_blank');
    },
  }
};
</script>

<style>

#main {
  height:100%;
  width:100%;
  display:block;
}

#map {
  height:100%;
  width:100%;
  display:block;
}

</style>
