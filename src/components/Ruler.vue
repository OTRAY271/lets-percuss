<template>
  <div>
    <v-sheet v-if="showRuler" id="ruler" :style="`top: ${rulerY}px;`" height="2px"></v-sheet>
    <v-btn :style="`bottom: ${fabBottom}px;`" fixed fab right @click="showRuler = !showRuler">
      <v-icon>{{ showRuler ? "mdi-eye-off" : "mdi-ruler"}}</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component
export default class Ruler extends Vue {
  private isMousePressed = false;
  private rulerY = 256;
  private showRuler = false;
  private cameraComponent!: HTMLElement;
  @Prop() public top!: number;
  @Prop() public bottom!: number;
  @Prop() public cameraId!: string;

  public mounted() {
    this.cameraComponent = document.getElementById(
      this.cameraId
    ) as HTMLElement;
    this.cameraComponent.addEventListener("mousedown", this.mouseDown);
    this.cameraComponent.addEventListener("mouseup", this.mouseUp);
    this.cameraComponent.addEventListener("mousemove", this.mouseMove);
  }

  public beforeDestroy() {
    this.cameraComponent.removeEventListener("mousedown", this.mouseDown);
    this.cameraComponent.removeEventListener("mouseup", this.mouseUp);
    this.cameraComponent.removeEventListener("mousemove", this.mouseMove);
  }

  private mouseDown(e: MouseEvent) {
    this.isMousePressed = true;
    this.tryToMove(e.clientY);
  }

  private mouseUp() {
    this.isMousePressed = false;
  }

  private mouseMove(e: MouseEvent) {
    if (this.isMousePressed) {
      this.tryToMove(e.clientY);
    }
  }

  get fabBottom() {
    return this.bottom + 12;
  }

  public tryToMove(y: number) {
    if (
      this.isMousePressed &&
      y > this.top &&
      y < window.innerHeight - this.bottom
    ) {
      this.rulerY = y;
    }
  }
}
</script>

<style scoped>
#ruler {
  position: fixed;
  width: 100vw;
  left: 0;
  background-color: #f44336;
}
</style>