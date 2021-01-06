<template>
  <v-container height="100%" class="main-container">
    <div class="background"></div>

    <information></information>

    <v-row class="logo" dense>
      <v-img
        :src="require('@/assets/logo_big.png')"
        height="100%"
        contain
      ></v-img>
    </v-row>
    <v-row class="btns" dense>
      <v-col
        v-for="card in cards"
        :key="card.title"
        :cols="card.cols"
        sm="4"
        :class="isXs ? 'btnCol' : ''"
      >
        <v-card height="100%" @click="$router.push(card.url)">
          <v-img
            :src="card.img"
            class="align-end"
            gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.1)"
            height="100%"
          >
            <v-card-title v-html="card.title" class="mode-title"></v-card-title>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Information from "@/components/Information.vue";

Component.registerHooks(["beforeRouteEnter"]);

@Component({
  components: { Information },
})
export default class Home extends Vue {
  public cards = [
    {
      title: "メトロノーム",
      img: require("@/assets/mode/metronome_mode.png"),
      url: "/metronome",
      cols: 12,
    },
    {
      title: "<span class='no-wrap'>リズムで</span>フラッシュ",
      img: require("@/assets/mode/rhythm_mode.png"),
      url: "/rhythm_flash",
      cols: 6,
    },
    {
      title: "<span class='no-wrap'>テンポ当て</span>ゲーム",
      img: require("@/assets/mode/guessTempo_mode.png"),
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
.background {
  background: #ff9800;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
}
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
.mode-title {
  color: #ffffff;
  text-shadow: 1px 1px 1px #fb8c00, -1px 1px 1px #fb8c00, 1px -1px 1px #fb8c00,
    -1px -1px 1px #fb8c00, 1px 0px 1px #fb8c00, 0px 1px 1px #fb8c00,
    -1px 0px 1px #fb8c00, 0px -1px 1px #fb8c00;
}
</style>