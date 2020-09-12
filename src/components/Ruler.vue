<template>
  <v-sheet id="ruler" height="2px"></v-sheet>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component
export default class Ruler extends Vue {
  private isMousePressed = false;
  private ruler!: HTMLElement;
  @Prop() public top!: number;
  @Prop() public bottom!: number;

  public mounted() {
    this.ruler = document.getElementById("ruler") as HTMLElement;
    document.addEventListener("mousedown", (e) => {
      this.isMousePressed = true;
      this.tryToMove(e.clientY);
    });
    document.addEventListener("mouseup", (e) => {
      this.isMousePressed = false;
    });
    document.addEventListener("mousemove", (e) => {
      if (this.isMousePressed) {
        this.tryToMove(e.clientY);
      }
    });
  }

  public tryToMove(y: number) {
    if (
      this.isMousePressed &&
      y > this.top &&
      y < window.innerHeight - this.bottom
    ) {
      this.ruler.style.top = y.toString() + "px";
    }
  }
}
</script>

<style scoped>
#ruler {
  position: fixed;
  width: 100vw;
  left: 0;
  transition: top 0.1s 0s ease;
}
</style>