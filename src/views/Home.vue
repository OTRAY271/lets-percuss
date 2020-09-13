<template>
  <v-container height="100%" class="main-container">
    <v-row class="logo" dense>
      <v-img :src="require('@/assets/logo_big.png')" height="100%" contain></v-img>
    </v-row>
    <v-row class="btns" dense>
      <v-col
        v-for="card in cards"
        :key="card.title"
        :cols="card.cols"
        sm="4"
        :class="isXs ?  'btnCol':''"
      >
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
      img: "https://cdn.vuetifyjs.com/images/cards/road.jpg",
      url: "/guess_tempo",
      cols: 6,
    },
  ];

  public get isXs() {
    return this.$vuetify.breakpoint.name === "xs";
  }
}
</script>

<style scoped>
.logo {
  height: 38%;
}
.btns {
  height: 62%;
}
.btnCol {
  height: 50%;
}
.main-container {
  background-color: #ff9800;
}
</style>