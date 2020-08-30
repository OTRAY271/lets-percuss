<template>
  <v-app class="noscroll">
    <v-main>
      <router-view id="background" class="noscroll"></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  components: {},
})
export default class App extends Vue {
  public mounted() {
    /* ピッチインピッチアウトによる拡大縮小を禁止 */
    document.documentElement.addEventListener(
      "touchstart",
      function (e) {
        if (e.touches.length >= 2) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
    this.setVh();
    window.addEventListener("resize", () => {
      this.setVh();
    });
  }
  public setVh() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
}
</script>

<style>
p {
  font-family: "M PLUS 1p", sans-serif;
}
#background {
  background: initial;
  height: 100vh; /* 変数をサポートしていないブラウザのフォールバック */
  height: calc(var(--vh, 1vh) * 100);
}
.noscroll {
  overflow: hidden;
}
.scroll {
  overflow-x: hidden;
  overflow-y: scroll;
}
div {
  overflow: visible;
}
</style>