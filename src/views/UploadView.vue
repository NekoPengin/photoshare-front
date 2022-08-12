<script setup lang="ts">
import { ref, computed } from "vue";
import exifr from "exifr";
import axios from "@/httpd";
import { dateTime, getMonth, pad } from "@/utils/dateTime";
import { useRouter, useRoute } from "vue-router";

import { stringify } from "querystring";
//import { url } from "inspector";

const router = useRouter();

type imageUploadData = {
  img: File;
  url: string;
  shootingDateTime: string;
  selected: boolean;
  yearMonth: string;
  year: string;
  month: string;
  day: string;
};

type directUploadImage = {
  directUrl: string;
  directId: string;
} & imageUploadData;

const file = ref<HTMLImageElement | undefined>(undefined);

const images: imageUploadData[] = [];
const imagesRef = ref<imageUploadData[]>(images);
const data = ref({});

// 画像データ等取得
const onShowImage = async (e: Event) => {
  if (e.target instanceof HTMLInputElement) {
    if (e.target.files) {
      for (const image of e.target.files) {
        console.log(image);
        //const image = const;
        const exif = await exifr.parse(image);

        data.value = exif;

        //DateTimeOriginalがない場合
        const DateTimeOriginal = exif
          ? exif?.DateTimeOriginal
            ? exif.DateTimeOriginal
            : new Date()
          : new Date();

        //複数の日付がある場合はどうする？日付でまとめる
        console.log(dateTime(DateTimeOriginal));

        //Orientation
        //debugger;

        console.log("selected file", e.target.files);
        //preview.value = URL.createObjectURL(image);
        const localUrl = URL.createObjectURL(image);
        imagesRef.value.push({
          img: image,
          url: localUrl,
          shootingDateTime: dateTime(DateTimeOriginal),
          selected: false,
          yearMonth:
            DateTimeOriginal.getUTCFullYear() + getMonth(DateTimeOriginal),
          year: DateTimeOriginal.getUTCFullYear(),
          month: getMonth(DateTimeOriginal),
          day: pad(DateTimeOriginal.getUTCDate()),
        });
      }
    }
  }
};
const isEnableSendButoon = computed(() => {
  return imagesRef.value.find((element) => element.selected) != undefined;
});

const uploadFiles = async () => {
  return imagesRef.value.filter((element) => element.selected);
};

const onUploadImage = async () => {
  const selectedfiles = await uploadFiles();
  const numberOfUploadImage = selectedfiles.length;

  if (numberOfUploadImage < 1) {
    return false;
  }

  const urls = await getDirectUrl(numberOfUploadImage);
  //debugger;

  const files: directUploadImage[] = [];

  for (const [index, url] of urls.entries()) {
    const image: directUploadImage = {
      ...selectedfiles[index],
      directUrl: url.uploadURL,
      directId: url.id,
    };
    files.push(image);
  }

  console.log(JSON.stringify(files, null, 2));

  Promise.all(files.map((file) => imageUpload(file.directUrl, file.img)));

  //時系列データとして登録
  //rowを日付をつけて記録;
  await postTimeData(files);

  //配列から重複なく年月を取得
  const yearMonths = [...new Set(files.map((file) => file.yearMonth))];

  // debugger;

  //年月単位にデータをまとめる
  for await (const yearMonth of yearMonths) {
    const yearMonthList: { shootingDateTime: string; id: string }[] = [];

    //対象の年月内の画像リストを取得
    const images: directUploadImage[] = files.filter(
      (file) => file.yearMonth == yearMonth
    );
    //並び替え
    images.sort((a, b) => Number(a.day) - Number(b.day));

    //対象の年月内の日付を重複なく取得
    const daylist = [...new Set(images.map((img) => img.day))];

    //日付別に追加
    for (const day of daylist) {
      const imges = images.filter((img) => img.day == day);
      //並び替え
      for (const img of imges) {
        yearMonthList.push({
          shootingDateTime: img.shootingDateTime,
          id: img.directId,
        });
      }

      //const ids = files.map((file) => file.directId);
      //日付別に集約した行を作成
      //const kv = { [date]: [...ids] };
      //対象の年月集約に追加
    }
    await postImageDate(images[0].year, images[0].month, yearMonthList);
    //  debugger;
  }

  await router.push({ name: "Home" });
  return true
};
const postImageDate = async (
  year: string,
  month: string,
  kv: { shootingDateTime: string; id: string }[]
) => {
  //KV登録id,datatime

  //year:2022:month:07
  await axios.post(`/imagelists/${year}/${month}`, kv);
};

const postTimeData = async (files: directUploadImage[]) => {
  const uploadData = files.map((file) => {
    return { date: new Date(), imageId: file.directId };
  });
  const res = await axios.post(`/time-data`, uploadData);
};
// //uploadurl取得
const getDirectUrl = async (number: number) => {
  const res = await axios.get(`/direct-upload-url/${number}`);

  //debugger;
  return res.data;
};

const imageUpload = async (uploadurl: string, image: File) => {
  //upload
  const formData = new FormData();
  formData.append("file", image);
  //formData.append("file",  Buffer.from(image, 'base64'));

  const headers = { "content-type": "multipart/form-data" };
  const res = await axios.post(uploadurl, formData, {
    headers,
    withCredentials: false,
  });
};

//クラスバインディングは、文字列にハイフンがある場合は、シングルクォーテーションで括る必要がある
</script>

<template>
  <input ref="file" v-on:change="onShowImage" type="file" multiple />
  <br />
  <!--{{ data }}-->
  <div v-if="imagesRef.length > 0">
    <div v-for="(image, index) in imagesRef" :key="index">
      <img
        :src="image.url"
        @click="image.selected = !image.selected"
        v-bind:class="{ 'border-8': image.selected }"
        class="border-indigo-600"
      />
      {{ image.selected }}
    </div>
  </div>
  <button
    v-if="isEnableSendButoon"
    class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
    @click="onUploadImage"
  >
    send
  </button>
</template>
