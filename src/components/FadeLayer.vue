<template>
  <transition name="fade">
    <div v-if="visible" id="fade-layer" @click="$emit('turn-on')"></div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component
export default class FadeLayer extends Vue {
  @Prop() public visible!: number;
}
</script>

<style scoped>
#fade-layer {
  position: absolute;
  top: 0px;
  left: 0px;

  width: 100vw;
  height: 100vh;

  background-color: #000000;
  z-index: 16;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>