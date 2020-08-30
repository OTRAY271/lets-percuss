<template>
  <div>
    <v-app-bar color="primary" dark>
      <v-btn icon @click="$router.push('/')">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <v-toolbar-title>メトロノーム</v-toolbar-title>
    </v-app-bar>

    <v-container class="main-container" fill-height>
      <v-row no-gutters class="main-row">
        <v-col cols="12" sm="6">
          <v-select :items="menu" v-model="current_menu" solo hide-details="true"></v-select>
          <v-sheet id="canvas-cover" height="25vh" class="mt-4">
            <canvas id="metronome"></canvas>
          </v-sheet>
        </v-col>
        <v-col cols="12" sm="6">
          <v-row justify="center" class="mb-n4" no-gutters>
            <v-col cols="auto">
              <v-container fluid fill-height class="pa-0">
                <v-btn icon x-large @click="minusBPM">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
              </v-container>
            </v-col>
            <v-col cols="5" class="text-center">
              <span class="bpm" @click.stop="openChangeBpmDialog">{{ bpm }}</span>
            </v-col>
            <v-col cols="auto">
              <v-container fluid fill-height class="pa-0">
                <v-btn icon x-large @click="plusBPM">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-container>
            </v-col>
          </v-row>
          <v-btn block large outlined @click="btnClicked">{{isPlaying ? "STOP":"START"}}</v-btn>
          <v-img class="mt-8" :src="require('@/assets/sheet/kiso1.png')" max-width="100%" contain></v-img>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="changeBpmDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">BPMを変更</v-card-title>

        <v-card-text>
          <v-text-field v-model.number="bpmTemporary" clearable type="number" ref="bpmField"></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary" text @click="closeChangeBpmDialog">キャンセル</v-btn>
          <v-btn color="primary" text @click="changeBpm">完了</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import VueRouter from "vue-router";
import { Howl, Howler } from "howler";

Component.registerHooks(["beforeRouteLeave"]);

@Component({
  components: {},
})
export default class Metronome extends Vue {
  public menu = ["フリー", "基礎練１", "基礎練２"];
  public current_menu = this.menu[0];
  public canvas!: HTMLCanvasElement;
  public ctx!: CanvasRenderingContext2D;
  public metronome = new Image();
  public weight = new Image();
  public clickSound!: Howl;
  public bpm = 128;
  public bpmTemporary = this.bpm;
  private bpms = new Array<number>();
  public isPlaying = false;
  public changeBpmDialog = false;

  public mounted() {
    this.calBpms();

    // canvas準備
    this.canvas = document.querySelector("#metronome") as HTMLCanvasElement; //getElementById()等でも可。オブジェクトが取れれば良い。
    this.ctx = this.canvas.getContext("2d")!;

    this.setCanvasReso();
    window.addEventListener("resize", () => {
      this.setCanvasReso();
      this.preDraw();
    });

    // 画像読み込み
    this.metronome.src = require("@/assets/metronome/metronome.png"); // 画像のURLを指定
    this.weight.src = require("@/assets/metronome/metronome_weight.png");

    this.metronome.onload = () => this.preDraw();
    this.weight.onload = () => this.preDraw();

    this.clickSound = new Howl({
      src: [require("@/assets/metronome/click.wav")],
    });
  }

  private loadCount = 0;
  private preDraw() {
    if (++this.loadCount < 2) return;
    this.draw(0);
  }

  private calBpms() {
    this.bpms.push(40);
    for (let bpm = 40; bpm < 208; ) {
      let dbpm = 8;
      if (bpm >= 40 && bpm < 60) {
        dbpm = 2;
      } else if (bpm >= 60 && bpm < 72) {
        dbpm = 3;
      } else if (bpm >= 72 && bpm < 120) {
        dbpm = 4;
      } else if (bpm >= 120 && bpm < 144) {
        dbpm = 6;
      }
      bpm += dbpm;
      this.bpms.push(bpm);
    }
  }

  private lastTime = 0;
  private reset = true;
  private beforeBeatTime = 0;
  private id = 0;
  private update() {
    this.id = requestAnimationFrame(this.update);
    if (this.reset) {
      this.lastTime = new Date().getTime();
      this.beforeBeatTime = -60 / this.bpm / 2 - 0.1;
      this.reset = false;
    }
    let timestamp = new Date().getTime() - this.lastTime;
    const k = 0.6;
    this.draw(k * Math.sin((this.bpm / 60) * Math.PI * (timestamp / 1000)));
    if (timestamp / 1000 - this.beforeBeatTime > 60 / this.bpm) {
      this.clickSound.stop();
      this.clickSound.play();
      this.beforeBeatTime += 60 / this.bpm;
    }
  }
  private draw(theta: number) {
    const width = this.ctx.canvas.clientWidth;
    const height = this.ctx.canvas.clientHeight;
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.translate(width / 2, height);
    this.ctx.rotate(theta);
    this.ctx.drawImage(
      this.metronome,
      -height * 0.125 * 0.5,
      -height,
      height * 0.125,
      height
    );
    const weight_height = (height * 250) / this.weight.height;
    this.ctx.drawImage(
      this.weight,
      -height * 0.125 * 0.5,
      -weight_height -
        (height - weight_height) *
          (1 -
            (this.bpm - this.bpms[0]) /
              (this.bpms[this.bpms.length - 1] - this.bpms[0])),
      height * 0.125,
      height
    );
    this.ctx.rotate(-theta);
    this.ctx.translate(-width / 2, -height);
  }

  public dpr = window.devicePixelRatio || 1;
  private setCanvasReso() {
    const cover = document.getElementById("canvas-cover")!;
    let width = cover.clientWidth;
    let height = cover.clientHeight;

    this.canvas.width = width * this.dpr;
    this.canvas.height = height * this.dpr;

    this.ctx.scale(this.dpr, this.dpr);

    this.canvas.style.width = width + "px";
    this.canvas.style.height = height + "px";
  }

  public plusBPM() {
    let minDiff = -1;
    let fixedBpmIndex = 0;
    this.bpms.forEach((element, index) => {
      const diff = Math.abs(element - this.bpm);
      if (diff < minDiff || minDiff === -1) {
        minDiff = diff;
        fixedBpmIndex = index;
      }
    }, this);
    if (fixedBpmIndex + 1 < this.bpms.length) {
      this.bpm = this.bpms[fixedBpmIndex + 1];
      this.reset = true;
      this.preDraw();
    }
  }
  public minusBPM() {
    let minDiff = -1;
    let fixedBpmIndex = 0;
    this.bpms.forEach((element, index) => {
      const diff = Math.abs(element - this.bpm);
      if (diff <= minDiff || minDiff === -1) {
        minDiff = diff;
        fixedBpmIndex = index;
      }
    }, this);
    if (fixedBpmIndex - 1 >= 0) {
      this.bpm = this.bpms[fixedBpmIndex - 1];
      this.reset = true;
      this.preDraw();
    }
  }

  private currentId = 0;
  public btnClicked() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.reset = true;
      this.update();
    } else {
      cancelAnimationFrame(this.id);
      this.preDraw();
    }
  }

  public openChangeBpmDialog() {
    this.bpmTemporary = this.bpm;
    this.changeBpmDialog = true;
    setTimeout(() => (this.$refs.bpmField as HTMLDivElement).focus(), 100);
  }

  public closeChangeBpmDialog() {
    this.changeBpmDialog = false;
    scroll(0, 0);
  }

  public changeBpm() {
    if (this.bpmTemporary < this.bpms[0]) this.bpmTemporary = this.bpms[0];
    else if (this.bpmTemporary > this.bpms[this.bpms.length - 1])
      this.bpmTemporary = this.bpms[this.bpms.length - 1];
    this.bpm = this.bpmTemporary;
    this.closeChangeBpmDialog();
  }

  beforeRouteLeave(to: VueRouter, from: VueRouter, next: Function) {
    cancelAnimationFrame(this.id);
    next();
  }
}
</script>

<style scoped>
.bpm {
  font-size: 5rem;
  cursor: pointer;
}
.main-container {
  height: calc(var(--vh, 1vh) * 100 - 56px);
}
.main-row {
  max-width: 100% !important;
}
#metronome {
  width: 100%;
  height: 40vh;
}
</style>