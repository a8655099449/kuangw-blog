<template>
  <h1 class="title">{{ title }}</h1>
  <div class="date">🕒 Published at: {{ publishDate }}</div>
  <div class="image-modal" v-show="modalVisible">

    <div>
      <div class="handle-box">
        <div>
          <button @click="handleScale(0.1)">放大</button>
          <button @click="handleScale(-0.1)">缩小</button>
          <span>{{ parseInt((scale * 100).toString()) }} %</span>
        </div>
        <button class="close" @click="close">×</button>
      </div>
      <img :src="imgSrc" alt="" :style="{ transform: `scale(${scale})` }" ref="imgRef">
    </div>
  </div>
  <!-- <div class="description">{{ description }}</div> -->
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { useData } from "vitepress";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const imgSrc = ref('')
const modalVisible = ref(false)
const scale = ref(1)
const imgRef = ref<HTMLImageElement>()


onMounted(() => {

  const wrap = document.querySelector('.content-container')
  imgRef.value?.addEventListener('mousewheel', (e:any) => {
    if (e.deltaY < 0) {
      handleScale(0.1)
    } else {
      handleScale(-0.1)
    }
  })


  if (!wrap) {
    return
  }
  const imgs = wrap.querySelectorAll('img')


  imgs.forEach(item => {
    item.addEventListener('click', e => {
      imgSrc.value = item.src
      modalVisible.value = true
      document.body.style.overflow = 'hidden';
    })
  })
})
const close = () => {
  modalVisible.value = false
  scale.value = 1
  document.body.style.overflow = '';

}

const handleScale = (v: number) => {
  scale.value += v
}

type pageData = {
  description: string;
  title: string;
  frontmatter: any;
  headers: any[];
  lastUpdated: number;
  relativePath: string;
};
const pageData: pageData = useData().page.value as pageData;
const { title, description, lastUpdated, frontmatter } = pageData;
dayjs.extend(relativeTime);

const publishDate = dayjs().to(dayjs(frontmatter.date || Date.now()));
</script>
<style scoped>
.title {
  color: var(--vp-c-text-1);
  font-weight: 600;
  font-size: 2.25em;
  margin-top: 0.3em;
  margin-bottom: 0.3em;
  line-height: 1.3;
  font-family: Dosis, ui-sans-serif, system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans",
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
    "Noto Color Emoji";
}

.date {
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin-bottom: 1em;
  padding-bottom: 1em;
  border-bottom: 1px dashed #c7c7c7;
}

.image-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .3);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close {}

.image-modal img {
  max-width: 100vw;
  transform: scale(1);
  transition: transform .3s;

}

.handle-box {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  color: #fff;
  display: flex;
  padding: 20px;
  justify-content: space-between;
  font-size: 26px;
}

.handle-box button {
  margin-right: 50px;
  font-size: 26px;

}

/* .image-modal>div {
  position: relative;
} */
</style>
