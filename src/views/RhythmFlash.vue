<template>
  <div>
    <v-app-bar color="primary" dark flat>
      <v-btn icon @click="$router.push('/')">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <v-toolbar-title>リズムでフラッシュ</v-toolbar-title>
    </v-app-bar>
    <v-container height="100%" class="content-wrapper">
      <v-row class="stage d-flex align-center justify-center" dense>
        <v-btn v-if="currentState === 'entrance'" x-large rounded @click="start">スタート</v-btn>
        <div v-else-if="currentState === 'countdown'" class="text-h1">{{ countdown }}</div>
        <div v-else-if="currentState === 'playing'">
          <div class="score">スコア：{{ score }}</div>
          <transition name="slide-fade" mode="out-in">
            <v-img
              :src="require('@/assets/rhythms/rhythm_' + rhythmIndex + '.png')"
              max-height="128"
              contain
              eager
              :key="rhythmIndex"
              :class="{ incorrect: incorrect }"
            ></v-img>
          </transition>
        </div>

        <div v-else-if="currentState === 'end'" class="text-h4">タイムアップ！</div>
        <div v-else-if="currentState === 'result'" class="text-center text-h6">
          スコア
          <br />
          <br />
          <transition name="bounce" appear>
            <div class="text-h2">
              <strong>{{ score }}</strong>
            </div>
          </transition>
          <br />
          <br />
          <v-btn @click="start" x-large>リトライ</v-btn>
        </div>
      </v-row>
      <v-row class="remaining-time" dense>
        <v-progress-linear
          v-model="remainingTimePercent"
          height="25"
          dark
          class="remaining-time-bar"
        >
          <strong>{{ Math.ceil(remainingTime) }}</strong>
        </v-progress-linear>
      </v-row>
      <v-row class="btns" dense>
        <v-col v-for="(rhythm, i) in rhythms" :key="rhythm.name" :cols="rhythm.cols">
          <v-btn
            block
            height="100%"
            outlined
            :disabled="currentState !== 'playing'"
            @click="answer(i)"
          >{{ rhythm.name }}</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

type states = "entrance" | "countdown" | "playing" | "end" | "result";

@Component
export default class RhythmFlash extends Vue {
  private timeLimit = 30;
  public remainingTime = this.timeLimit;
  public rhythms = [
    { name: "ス", cols: "6" },
    { name: "ナス", cols: "6" },
    { name: "ヤキトリ", cols: "6" },
    { name: "ピーナツ", cols: "6" },
    { name: "コロッケ", cols: "4" },
    { name: "トマト", cols: "4" },
    { name: "ティーンパ", cols: "4" },
  ];
  private countdown = -1;
  private currentState: states = "entrance";
  private startTime!: number;
  public rhythmIndex = -1;
  private incorrect = false;
  public score!: number;

  get remainingTimePercent() {
    return (this.remainingTime / this.timeLimit) * 100;
  }

  public start() {
    this.currentState = "countdown";
    this.countdown = 3;
    this.remainingTime = this.timeLimit;
    this.score = 0;
    const me = this;
    const id = setInterval(() => {
      if (--me.countdown === 0) {
        me.countdown = -1;
        me.currentState = "playing";
        clearInterval(id);
        this.changeRhythm();
        requestAnimationFrame(me.update);
        me.startTime = new Date().getTime();
      }
    }, 1000);
  }

  private update() {
    if (this.remainingTime > 0) requestAnimationFrame(this.update);
    else {
      this.currentState = "end";
      const me = this;
      setTimeout(() => {
        me.currentState = "result";
      }, 2000);
    }
    this.remainingTime =
      this.timeLimit - (new Date().getTime() - this.startTime) / 1000;
  }

  private changeRhythm() {
    const preRhythmIndex = this.rhythmIndex;
    do {
      this.rhythmIndex = Math.floor(Math.random() * this.rhythms.length);
    } while (this.rhythmIndex === preRhythmIndex);
  }

  public answer(index: number) {
    if (this.rhythmIndex === index) {
      this.score += 10;
      this.changeRhythm();
    } else {
      this.incorrect = true;
      setTimeout(() => (this.incorrect = false), 300);
    }
  }
}
</script>

<style scoped>
.stage {
  height: 50%;
}
.remaining-time {
  height: 5%;
}
.btns {
  height: 40%;
}
.content-wrapper {
  height: calc(var(--vh, 1vh) * 100 - 48px);
  max-width: 512px;
}
.remaining-time-bar {
  transition: none;
}
.score {
  position: fixed;
  top: 100px;
  left: 0px;
  width: 100vw;
  text-align: center;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter {
  transform: translateX(128px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-128px);
  opacity: 0;
}

.incorrect {
  animation-direction: normal;
  animation-duration: 0.3s;
  animation-name: incorrect-anim;
  animation-timing-function: ease;
}
@keyframes incorrect-anim {
  33% {
    transform: translateY(16px);
  }

  66% {
    transform: translateY(-16px);
  }
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