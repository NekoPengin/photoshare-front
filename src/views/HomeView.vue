<script setup lang="ts">
import axios from "@/httpd";
import { ref, onMounted } from "vue";
import { getMonth } from "@/utils/dateTime";
//import { onBeforeMount, onMounted, onBeforeUpdate , onUpdated, onBeforeUnmount, onUnmounted, ref} from 'vue'

interface img {
  datatime: string;
  url: string;
}
// const images = ref<img[]>([
//   {
//     datatime: "D_2022070128",
//     url: "/images/01232a67-83aa-4a6c-37e5-d38f871a4b01",
//   },
//   {
//     datatime: "D_2022070129",
//     url: "/images/575df26b-4681-4740-ad89-040f94194201",
//   },
//   {
//     datatime: "D_2022070130",
//     url: "/images/4c3b6402-86f9-4b2a-4437-05f9667d7b00",
//   },
// ]);
const images = ref<img[]>([]);

const getImages = async () => {
  const today = new Date();
  const res = await axios.get(
    `/imagelists/${today.getUTCFullYear()}/${getMonth(today)}`
  );
  console.log("back axios:", res.data);
  return res.data;
};

const getImageUrl = async (ids) => {
  const urls = [];
  for (const [key, value] of Object.entries(ids)) {
    const res = await axios.get(`/imageurl/${value}`);
    urls.push({ datatime: key, url: res });
  }
};
onMounted(async () => {
  images.value = await getImages();
});
</script>

<template>
  <div class="columns-2 md:columns-3 lg:columns-4">
    <template v-for="img in images" :key="img.datatime">
      <img class="mb-2" :src="img.url" />
    </template>
  </div>
</template>

<style>
#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.5rem !important;
  font-weight: normal;
}
</style>
