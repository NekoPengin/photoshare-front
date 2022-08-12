<template>
  <div
    class="flex flex-col items-center justify-center w-screen h-screen bg-gray-200 text-gray-700"
  >
    <h1 class="font-bold text-2xl">Login</h1>
  </div>
</template>

<script setup lang="ts">
import axios from "@/httpd";
import liff from "@line/liff";
import log from "@/logging";
import { userStore } from "@/stores/user";
import { useRouter, useRoute } from "vue-router";

import { onBeforeMount, onMounted, computed } from "vue";

const user = userStore();
const router = useRouter();
const route = useRoute();

onBeforeMount(() => {
  log.debug("VITE_BASE_DOMAIN:", import.meta.env.VITE_API_DOMAIN);
  log.debug("liffId:", import.meta.env.VITE_LIFF_ID);
});

onMounted(() => {
  logToServer("mounted");
   
  login();
});

const login = async () => {
  logToServer("login_init");
await user.logout();
  //liffログインなしの場合、liffログイン
  if (!liff.isLoggedIn()) {
    logToServer("is not login");

    await liff.login()
    // liff.login({
    //   redirectUri: import.meta.env.VITE_APP_REDIRECT_URI,
    // });

    //return false;
  }

  const isLogin = computed(() => user.authenticated);

  //内部ログインなしの場合、内部ログイン
  if (!isLogin.value) {
    logToServer("NotLineloginOK");

    const token = liff.getAccessToken();

    if (token == null) {
      await user.logout();
      liff.login({
        redirectUri: import.meta.env.VITE_APP_REDIRECT_URI,
      });
      return false;
    }
    await user.login(token);

    await router.push({ name: "Home" });
    return false;
  }

  logToServer("LineloginOk");
};

const logToServer = (msg: string) => {
  const location = window.location.href;
  const query = JSON.stringify(route.query);
  const params = JSON.stringify(route.params);

  console.log(msg);
  console.log(`${query}-${params}`);
  // axios.post("/log", {
  //   msg: msg,
  //   location: location,
  //   query: query,
  //   params: params,
  // });
};
</script>

<style></style>
