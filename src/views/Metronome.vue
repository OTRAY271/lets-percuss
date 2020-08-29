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
          <v-sheet color="blue lighten-5" height="40vh"></v-sheet>
        </v-col>
        <v-col cols="12" sm="6">
          <v-row justify="center" no-gutters>
            <v-col cols="auto">
              <v-container fluid fill-height class="pa-0">
                <v-btn icon x-large>
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
              </v-container>
            </v-col>
            <v-col cols="auto">
              <span class="bpm">128</span>
            </v-col>
            <v-col cols="auto">
              <v-container fluid fill-height class="pa-0">
                <v-btn icon x-large>
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-container>
            </v-col>
          </v-row>
          <v-img :src="require('@/assets/sheet/kiso1.png')" max-width="100%" contain></v-img>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  components: {},
})
export default class Metronome extends Vue {
  public menu = ["フリー", "基礎練１", "基礎練２"];
  public current_menu = this.menu[0];
}
</script>

<style scoped>
.bpm {
  font-size: 5rem;
}
.main-container {
  height: calc(100vh - 56px);
}
.main-row {
  max-width: 100% !important;
}
</style>