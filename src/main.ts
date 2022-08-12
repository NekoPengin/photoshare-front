import { createApp } from "vue";
import { createPinia } from "pinia";
import liff from "@line/liff";
import { LiffMockPlugin } from "@line/liff-mock";

import App from "@/App.vue";
import "./index.css";
import router from "@/router";

import "./assets/main.css";

liff.use(new LiffMockPlugin());

const liffId = "1657377087-0mGVy5kr"; // テキトーにIDを設定

async function main() {
  await liff.init({ liffId, mock: false });

  const app = createApp(App);

  app.use(createPinia());
  app.use(router);

  app.mount("#app");
}

main();
