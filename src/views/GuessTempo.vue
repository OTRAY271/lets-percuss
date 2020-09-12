<template>
  <div>
    <v-app-bar color="primary" dark flat>
      <v-btn icon @click="$router.push('/')">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <v-toolbar-title>テンポ当てゲーム</v-toolbar-title>
    </v-app-bar>
    <v-container height="100%" class="content-wrapper">
      <v-row class="stage d-flex align-center justify-center" dense>
        <v-btn v-if="currentState === 'entrance'" x-large rounded @click="start">スタート</v-btn>
        <div v-else-if="currentState === 'playing'">
          <div class="score">スコア：{{ score }}</div>
          <div class="text-h5">このテンポは？</div>
        </div>
        <div v-else-if="currentState === 'checkAns'">
          <div class="score">スコア：{{ score }}</div>
          <div class="text-h5">
            正解は
            <span class="text-h3">{{ getBpms()[answerTempoIndex] }}</span>
          </div>
          <br />
          <div v-if="loss < messages.length" class="text-center">{{ messages[loss] }}</div>
        </div>

        <div v-else-if="currentState === 'result'" class="text-center text-h6">
          スコア
          <br />
          <br />
          <transition name="bounce" appear>
            <div class="text-h2">
              <strong>{{ score }}</strong>
            </div>
          </transition>/100
          <br />
          <br />
          <v-btn @click="start" x-large>リトライ</v-btn>
        </div>
      </v-row>
      <v-row class="step" dense>
        <v-progress-linear v-model="stepPercent" height="25" dark>
          <strong>{{ step }}/{{ maxSteps }}</strong>
        </v-progress-linear>
      </v-row>
      <v-row class="inputbar" dense>
        <v-col cols="12" class="d-flex align-center">
          <v-slider
            v-if="currentState !== 'checkAns'"
            v-model="guessedTempoIndex"
            :thumb-label="currentState === 'playing' ? 'always':''"
            min="0"
            :max="getBpms().length-1"
            class="mt-12"
            :disabled="currentState !== 'playing'"
          >
            <template v-slot:thumb-label="{ value }">{{ getBpms()[value] }}</template>
          </v-slider>
          <v-range-slider
            v-else
            v-model="lossRange"
            min="0"
            :max="getBpms().length-1"
            class="mt-12"
            thumb-label="always"
            readonly
          >
            <template v-slot:thumb-label="{ value }">{{ getBpms()[value] }}</template>
          </v-range-slider>
        </v-col>
        <v-col class="d-flex justify-center">
          <v-btn x-large outlined :disabled="currentState !== 'playing'" @click="checkAns">解答</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VueRouter from "vue-router";
import { Howl, Howler } from "howler";
import getBpms from "@/libs/bpms";

type states = "entrance" | "playing" | "checkAns" | "result";

Component.registerHooks(["beforeRouteLeave"]);

@Component
export default class GuessTempo extends Vue {
  public currentState: states = "entrance";
  public score!: number;
  private step = 0;
  private maxSteps = 5;
  private guessedTempoIndex = 26;
  private answerTempoIndex!: number;
  public getBpms = getBpms;
  private lossRange = new Array(2);
  public clickSound!: Howl;
  private allotment = [20, 19, 17, 14, 10, 5];
  public messages = ["ピタリ賞！", "お見事！", "素晴らしい！", "その調子"];

  public mounted() {
    this.clickSound = new Howl({
      src: [require("@/assets/metronome/click.wav")],
    });
  }

  public start() {
    this.step = 1;
    this.score = 0;
    this.makeQuestion();
    this.currentState = "playing";
  }

  get stepPercent() {
    return (this.step / this.maxSteps) * 100;
  }

  public checkAns() {
    cancelAnimationFrame(this.id);
    this.lossRange[0] = Math.min(this.guessedTempoIndex, this.answerTempoIndex);
    this.lossRange[1] = Math.max(this.guessedTempoIndex, this.answerTempoIndex);
    if (this.loss < this.allotment.length)
      this.score += this.allotment[this.loss];
    this.currentState = "checkAns";
    setTimeout(() => {
      if (this.step++ < this.maxSteps) {
        this.makeQuestion();
        this.currentState = "playing";
      } else {
        this.step = this.maxSteps;
        this.currentState = "result";
      }
    }, 2000);
  }

  get loss() {
    return Math.abs(this.guessedTempoIndex - this.answerTempoIndex);
  }

  private makeQuestion() {
    this.guessedTempoIndex = 26;
    this.answerTempoIndex = Math.floor(Math.random() * getBpms().length);
    this.reset = true;
    this.update();
  }

  private lastTime = 0;
  private reset = true;
  private beforeBeatTime = 0;
  private id = 0;
  private update() {
    this.id = requestAnimationFrame(this.update);
    const bpm = getBpms()[this.answerTempoIndex];
    if (this.reset) {
      this.lastTime = new Date().getTime();
      this.beforeBeatTime = -60 / bpm / 2 - 0.1;
      this.reset = false;
    }
    let timestamp = new Date().getTime() - this.lastTime;
    const k = 0.6;
    if (timestamp / 1000 - this.beforeBeatTime > 60 / bpm) {
      this.clickSound.stop();
      this.clickSound.play();
      this.beforeBeatTime += 60 / bpm;
    }
  }

  beforeRouteLeave(to: VueRouter, from: VueRouter, next: Function) {
    cancelAnimationFrame(this.id);
    next();
  }
}
</script>

<style scoped>
.content-wrapper {
  height: calc(var(--vh, 1vh) * 100 - 48px);
  max-width: 512px;
}
.stage {
  height: 50%;
}
.score {
  position: fixed;
  top: 100px;
  left: 0px;
  width: 100vw;
  text-align: center;
}
.step {
  height: 5%;
}
.inputbar {
  height: 45%;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>