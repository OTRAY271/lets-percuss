<template>
  <div>
    <v-btn
      fab
      absolute
      text
      dark
      small
      class="mx-n1 my-n1"
      @click.stop="dialog = true"
    >
      <v-icon>mdi-information-outline</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" max-width="540">
      <v-card>
        <v-card-title class="headline text-center card-title py-7"
          ><span class="title-text">このサービスについて</span></v-card-title
        >

        <v-card-text class="description px-5">
          <p>
            <strong>『Let's! パーカス　〜打楽器練習用ウェブアプリ〜』</strong
            >は,
            打楽器練習者にとって最も使いやすいように設計された多機能型メトロノームアプリです。
          </p>
          <p><strong>スマートフォン</strong>からのご利用を推奨しています。</p>
          <p>
            このサービスは<strong>PWA（Progressive Web Apps）対応</strong
            >となっておりますので,
            スマートフォン端末にインストールしてご利用いただくことが可能です。
            Androidをご利用の方は画面に表示される<strong>「ホーム画面に追加」</strong>をタップ,
            iPhoneをご利用の方は画面下部の共有メニューから<strong>「ホーム画面に追加」</strong>を選択してください。
          </p>
          <p>
            <strong
              >フィードバックやお問い合わせは<a
                href="https://forms.gle/1zmHXqMMcQaecA599"
                target="_blank"
                >こちら</a
              >から。</strong
            >
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="#ff9800" text @click="dialog = false"> 閉じる </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class Information extends Vue {
  private dialog = false;
}
</script>

<style scoped>
.card-title {
  display: block;
}
.title-text {
  border-bottom: dashed 2px #ff9800;
}
.description {
  text-align: justify;
}
.description > p {
  margin-bottom: 0px;
  text-indent: 1em;
  line-height: 1.9em;
}
</style>