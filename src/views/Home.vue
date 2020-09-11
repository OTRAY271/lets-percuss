<template>
  <v-container height="100%">
    <v-row class="logo" dense></v-row>
    <v-row class="btns" dense>
      <v-col v-for="card in cards" :key="card.title" :cols="card.cols" sm="4">
        <v-card height="100%" @click="$router.push(card.url)">
          <v-img
            :src="card.img"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="100%"
          >
            <v-card-title v-html="card.title"></v-card-title>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

Component.registerHooks(["beforeRouteEnter"]);

@Component({
  components: {},
})
export default class Home extends Vue {
  public cards = [
    {
      title: "メトロノーム",
      img: "https://cdn.vuetifyjs.com/images/cards/house.jpg",
      url: "/metronome",
      cols: 12,
    },
    {
      title: "<span class='no-wrap'>リズムで</span>フラッシュ",
      img: "https://cdn.vuetifyjs.com/images/cards/plane.jpg",
      url: "/rhythm_flash",
      cols: 6,
    },
    {
      title: "<span class='no-wrap'>テンポ当て</span>ゲーム",
      img: "https://cdn.vuetifyjs.com/images/cards/house.jpg",
      cols: 6,
    },
  ];
}
</script>

<style scoped>
.logo {
  height: 38%;
}
.btns {
  height: 62%;
}
</style>