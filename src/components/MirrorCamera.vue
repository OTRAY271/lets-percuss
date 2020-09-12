<template>
  <video ref="video" class="video" autoplay playsinline></video>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class MirrorCamera extends Vue {
  public video!: HTMLVideoElement;

  public mounted() {
    const medias = {
      audio: false,
      video: {
        facingMode: {
          exact: "user", //リアカメラの設定
        },
      },
    };
    this.video = this.$refs.video as HTMLVideoElement;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia(medias)
        .then((stream) => {
          this.video.srcObject = stream;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
}
</script>

<style scoped>
.video {
  width: auto;
  height: 100%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%) rotateY(180deg);
  -webkit-transform: translateX(-50%) rotateY(180deg);
}
</style>