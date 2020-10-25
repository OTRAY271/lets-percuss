<template>
  <div>
    <v-app-bar color="primary" dark flat>
      <v-btn icon @click="$router.push('/')">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <v-toolbar-title>メトロノーム</v-toolbar-title>

      <template v-slot:extension>
        <v-tabs v-model="currentTab" align-with-title grow>
          <v-tabs-slider></v-tabs-slider>

          <v-tab v-for="tab in tabs" :key="tab" class="ma-0">{{ tab }}</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-container
      :class="
        currentTab === 1 || sheet === null
          ? 'menu-bar'
          : 'menu-bar-with-sheet content-wrapper'
      "
    >
      <v-select
        :items="menu"
        v-model="currentMenu"
        solo
        hide-details="true"
        @change="menuChanged"
        @click="menuClicked"
        @blur="hideGarbageBtn"
      >
        <div
          slot="append-item"
          class="adding-btn pl-4 py-2"
          @click="openAddingDialog"
        >
          <v-icon class="mt-n1">mdi-plus</v-icon>追加...
        </div>
      </v-select>
    </v-container>

    <v-fab-transition>
      <v-btn
        v-if="showGarbageBtn"
        fixed
        fab
        right
        class="garbage-btn"
        color="grey"
        dark
        @click.stop="deleteMenu"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-fab-transition>

    <v-tabs-items v-model="currentTab">
      <v-tab-item class="content-wrapper">
        <v-container
          :class="
            sheet === null ? 'main-container' : 'main-container-with-sheet'
          "
          fill-height
        >
          <v-row no-gutters class="main-row">
            <v-col :cols="isLargeHight ? 12 : 6">
              <v-sheet id="canvas-cover" height="34vh" v-intersect="drawInit">
                <canvas
                  id="metronome"
                  :class="isLargeHight ? '' : 'vertical-center'"
                ></canvas>
              </v-sheet>
            </v-col>
            <v-col :cols="isLargeHight ? 12 : 6">
              <v-row justify="center" class="mb-n4" no-gutters>
                <v-col cols="auto">
                  <v-container fluid fill-height class="pa-0">
                    <v-btn icon x-large @click="minusBPM">
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                  </v-container>
                </v-col>
                <v-col cols="6" class="text-center">
                  <span class="bpm" @click.stop="openChangeBpmDialog">{{
                    bpm
                  }}</span>
                </v-col>
                <v-col cols="auto">
                  <v-container fluid fill-height class="pa-0">
                    <v-btn icon x-large @click="plusBPM">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </v-container>
                </v-col>
              </v-row>
              <v-btn block large outlined @click="btnClicked">
                <v-icon class="mr-2">{{
                  isPlaying ? "mdi-pause" : "mdi-play"
                }}</v-icon>
              </v-btn>
              <v-img
                class="mt-8"
                v-if="sheet !== null"
                :src="sheet"
                max-width="100%"
                max-height="45%"
                contain
              ></v-img>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>

      <v-tab-item>
        <div id="overlay-canvas-cover" v-intersect="drawInit">
          <canvas id="overlay-metronome"></canvas>
        </div>

        <div class="mirror-wrapper">
          <mirror-camera :id="cameraId"></mirror-camera>
        </div>

        <v-container class="mini-main-container">
          <v-row no-gutters class="main-row d-flex align-center">
            <!--<v-col cols="3">
              <div id="mini-canvas-cover" v-intersect="drawInit">
                <canvas id="mini-metronome"></canvas>
              </div>
            </v-col>-->
            <v-col cols="2">
              <v-container fluid class="pa-0 d-flex justify-center">
                <v-btn icon x-large @click="minusBPM">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
              </v-container>
            </v-col>
            <v-col cols="2" class="text-center">
              <span class="mini-bpm" @click.stop="openChangeBpmDialog">{{
                bpm
              }}</span>
            </v-col>
            <v-col cols="2">
              <v-container fluid class="pa-0 d-flex justify-center">
                <v-btn icon x-large @click="plusBPM">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-container>
            </v-col>
            <v-col cols="6">
              <v-btn
                outlined
                @click="btnClicked"
                min-width="100%"
                class="pa-0"
                x-large
              >
                <v-icon>{{ isPlaying ? "mdi-pause" : "mdi-play" }}</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
        <ruler :top="176" :bottom="miniContHeight" :cameraId="cameraId"></ruler>
      </v-tab-item>
    </v-tabs-items>

    <v-dialog v-model="changeBpmDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">BPMを変更</v-card-title>

        <v-card-text>
          <v-text-field
            v-model.number="bpmTemporary"
            clearable
            type="number"
            ref="bpmField"
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary" text @click="closeChangeBpmDialog"
            >キャンセル</v-btn
          >
          <v-btn color="primary" text @click="changeBpm">完了</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addingDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">メニューを追加</v-card-title>

        <v-card-text>
          <v-text-field v-model="newMenuName" ref="menuField"></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary" text @click="closeAddingDialog(false)"
            >キャンセル</v-btn
          >
          <v-btn color="primary" text @click="closeAddingDialog(true)"
            >完了</v-btn
          >
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
import MirrorCamera from "@/components/MirrorCamera.vue";
import Ruler from "@/components/Ruler.vue";
import getBpms from "@/libs/bpms";

Component.registerHooks(["beforeRouteLeave"]);

@Component({
  components: { MirrorCamera, Ruler },
})
export default class Metronome extends Vue {
  public menu = ["フリー", "基礎練１", "基礎練２"];
  public currentMenu = this.menu[0];
  public registeredBpms = [120, 60, 98];
  public sheets = [null, "kiso1.png", "kiso2.png"];
  public canvas!: HTMLCanvasElement;
  public ctx!: CanvasRenderingContext2D;
  public metronome = new Image();
  public weight = new Image();
  public clickSound!: Howl;
  public bpmTemporary = 0;
  private bpms = new Array<number>();
  public isPlaying = false;
  public changeBpmDialog = false;
  public tabs = ["シンプル", "ミラー"];
  public currentTab = 0;
  public isLargeHight = true;
  public addingDialog = false;
  public newMenuName = "";
  public showGarbageBtn = false;
  public miniContHeight = 0;
  public readonly cameraId = "video";

  public mounted() {
    window.addEventListener("resize", () => {
      this.checkHight();
      const me = this;
      setTimeout(() => {
        this.setCanvasReso();
        this.preDraw();
      }, 1);
    });

    this.metronome.src = require("@/assets/metronome/metronome.png");
    this.weight.src = require("@/assets/metronome/metronome_weight.png");

    this.metronome.onload = () => this.preDraw();
    this.weight.onload = () => this.preDraw();

    this.clickSound = new Howl({
      src: [require("@/assets/metronome/click.wav")],
    });

    let _registeredBpms = localStorage.getItem("registeredBpms");
    if (_registeredBpms) this.registeredBpms = JSON.parse(_registeredBpms);
    let _menu = localStorage.getItem("menu");
    if (_menu) this.menu = JSON.parse(_menu);
  }

  public drawInit() {
    this.canvas = document.querySelector("#metronome") as HTMLCanvasElement;
    if (this.currentTab === 1)
      this.canvas = document.querySelector(
        /*"#mini-metronome"*/ "#overlay-metronome"
      ) as HTMLCanvasElement;

    this.ctx = this.canvas.getContext("2d")!;
    this.setCanvasReso();
    this.preDraw();
  }

  private loadCount = 0;
  private preDraw() {
    if (++this.loadCount < 3) return;
    this.draw(0);
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
            (this.bpm - getBpms()[0]) /
              (getBpms()[getBpms().length - 1] - getBpms()[0])),
      height * 0.125,
      height
    );
    this.ctx.rotate(-theta);
    this.ctx.translate(-width / 2, -height);
  }

  public dpr = window.devicePixelRatio || 1;
  private setCanvasReso() {
    let cover = document.getElementById("canvas-cover")!;
    if (this.currentTab === 1)
      cover = document.getElementById(
        /*"mini-canvas-cover"*/ "overlay-canvas-cover"
      )!;
    let width = cover.clientWidth;
    let height = cover.clientHeight;

    this.canvas.width = width * this.dpr;
    this.canvas.height = height * this.dpr;

    this.ctx.scale(this.dpr, this.dpr);

    this.canvas.style.width = width + "px";
    this.canvas.style.height = height + "px";

    if (this.currentTab === 1) this.miniContHeight = /*height + 24*/ 80;
  }

  public plusBPM() {
    let minDiff = -1;
    let fixedBpmIndex = 0;
    getBpms().forEach((element, index) => {
      const diff = Math.abs(element - this.bpm);
      if (diff < minDiff || minDiff === -1) {
        minDiff = diff;
        fixedBpmIndex = index;
      }
    }, this);
    if (fixedBpmIndex + 1 < getBpms().length) {
      this.bpm = getBpms()[fixedBpmIndex + 1];
      this.reset = true;
      this.preDraw();
    }
  }
  public minusBPM() {
    let minDiff = -1;
    let fixedBpmIndex = 0;
    getBpms().forEach((element, index) => {
      const diff = Math.abs(element - this.bpm);
      if (diff <= minDiff || minDiff === -1) {
        minDiff = diff;
        fixedBpmIndex = index;
      }
    }, this);
    if (fixedBpmIndex - 1 >= 0) {
      this.bpm = getBpms()[fixedBpmIndex - 1];
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

  public openAddingDialog() {
    this.addingDialog = true;
    this.newMenuName = "";
    setTimeout(() => (this.$refs.menuField as HTMLDivElement).focus(), 100);
  }
  public closeAddingDialog(isAdd: boolean) {
    if (isAdd) {
      this.menu.push(this.newMenuName);
      this.registeredBpms.push(120);
      this.currentMenu = this.newMenuName;
      localStorage.setItem("menu", JSON.stringify(this.menu));
      this.menuChanged();
    }
    this.addingDialog = false;
    scroll(0, 0);
  }
  public deleteMenu() {
    const menuIndexToBeDeleted = this.menu.indexOf(this.currentMenu);
    this.currentMenu = this.menu[menuIndexToBeDeleted - 1];
    this.menu.splice(menuIndexToBeDeleted, 1);
    this.registeredBpms.splice(menuIndexToBeDeleted, 1);
    localStorage.setItem("menu", JSON.stringify(this.menu));
    this.menuChanged();
  }

  public changeBpm() {
    if (this.bpmTemporary < getBpms()[0]) this.bpmTemporary = getBpms()[0];
    else if (this.bpmTemporary > getBpms()[getBpms().length - 1])
      this.bpmTemporary = getBpms()[getBpms().length - 1];
    this.bpm = this.bpmTemporary;
    this.closeChangeBpmDialog();
  }

  public menuChanged() {
    this.hideGarbageBtn();
    this.bpm = this.registeredBpms[this.menu.indexOf(this.currentMenu)];
    this.reset = true;
  }

  public get bpm() {
    return this.registeredBpms[this.menu.indexOf(this.currentMenu)];
  }

  public set bpm(newValue) {
    this.registeredBpms.splice(
      this.menu.indexOf(this.currentMenu),
      1,
      newValue
    );
    localStorage.setItem("registeredBpms", JSON.stringify(this.registeredBpms));
  }

  public get sheet() {
    let index = this.menu.indexOf(this.currentMenu);
    return index < this.sheets.length && !!this.sheets[index]
      ? require("@/assets/sheet/" + this.sheets[index])
      : null;
  }

  public checkHight() {
    this.isLargeHight = window.innerHeight > 450;
  }

  public menuClicked() {
    if (this.menu.indexOf(this.currentMenu) >= 3) this.showGarbageBtn = true;
  }

  public hideGarbageBtn() {
    const me = this;
    setTimeout(() => (me.showGarbageBtn = false), 100);
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
.mini-bpm {
  font-size: 2rem;
  cursor: pointer;
}
.main-container {
  height: calc(var(--vh, 1vh) * 100 - 104px);
}
.main-container-with-sheet {
  height: calc(var(--vh, 1vh) * 100 - 176px);
}
.mini-main-container {
  position: fixed;
  bottom: 0;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.6);
}
.main-row {
  max-width: 100% !important;
}
#metronome {
  width: 100%;
  height: 40vh;
}
.vertical-center {
  position: absolute;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
}
#mini-metronome {
  height: 50px;
}
.menu-bar {
  position: absolute;
  z-index: 1;
  max-width: 512px;
  left: 50%;
  transform: translateX(-50%);
  -webkit-transform: translateX(-50%);
}
.menu-bar-with-sheet {
  position: relative;
  z-index: 1;
}
.mirror-wrapper {
  height: calc(var(--vh, 1vh) * 100 - 104px);
  overflow: hidden;
  position: relative;
}
#mini-canvas-cover {
  height: 78px;
}
#overlay-canvas-cover {
  position: absolute;
  z-index: 2;
  height: 40vh;
  width: 100%;
  top: 45%;
  transform: translateY(-50%);
  pointer-events: none;
  opacity: 0.7;
}
.content-wrapper {
  max-width: 512px;
  margin-left: auto;
  margin-right: auto;
}
.garbage-btn {
  top: 80px;
  right: max(16px, calc((100vw - 512px) / 2));
  z-index: 9;
}
.adding-btn {
  cursor: pointer;
}
</style>