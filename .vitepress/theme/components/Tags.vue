<template>
  <div class="main">
    <h1 class="tags-header">Tags</h1>
    <div class="tags">
      <span @click="toggleTag(item.key)" v-for="(item, key ) in data" class="tag" :style="getFontSize(item.len)"
        :class="{ activetag: item.key === key }">
        {{ item.key }} <span class="tag-length">{{ item.len }}</span>
      </span>
    </div>

    <h4 class="header" v-show="selectTag">
      <svg t="1641783753540" class="fas-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="1254" :style="{
          width: '20px',
        }">
        <path
          d="M995.126867 592.38l-360.08 360.08a53.333333 53.333333 0 0 1-71.333334 3.68l356.22-356.22a64 64 0 0 0 0-90.506667L495.8402 85.333333h45.573333a52.986667 52.986667 0 0 1 37.713334 15.62l416 416a53.4 53.4 0 0 1 0 75.426667z m-128 0l-360.08 360.08a53.333333 53.333333 0 0 1-75.426667 0l-416-416A52.986667 52.986667 0 0 1 0.0002 498.746667V138.666667a53.393333 53.393333 0 0 1 53.333333-53.333334h360.08a52.986667 52.986667 0 0 1 37.713334 15.62l416 416a53.4 53.4 0 0 1 0 75.426667zM341.333533 341.333333a85.333333 85.333333 0 1 0-85.333333 85.333334 85.426667 85.426667 0 0 0 85.333333-85.333334z"
          fill="var(--vp-c-brand)" p-id="1255"></path>
      </svg>
      <span class="header-text">{{ selectTag }}</span>
    </h4>
    <a :href="withBase(article.regularPath)" v-for="(article, index) in selectTags" :key="index" class="article">
      <div class="title">
        <div class="title-o"></div>
        {{ article.frontMatter.title }}
      </div>
      <div class="date">{{ article.frontMatter.date }}</div>
    </a>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import { useData, withBase } from "vitepress";
import { initTags } from "../utils";

const { theme } = useData();
const data = computed(() => {

  const _tags = initTags(theme.value.posts)
  // console.log('👴2023-02-07 16:30:11 Tags.vue line:59', _tags)

  const list = Object.keys(_tags).map((k: any) => ({
    key: k,
    len: Object.keys(_tags[k]).length,
    list:_tags[k]
  }))
  // const list = Object.values(_tags).map((k: any) => ({
  //   key: k,
  //   len: Object.keys(_tags[k]).length
  // }))
  // console.log('👴2023-02-07 16:33:28 Tags.vue line:46',list)
  return list

});

const selectTags = computed(e => {
  const d = data.value.find(item => item.key === selectTag.value)?.list || []
  console.log('👴2023-02-07 16:57:13 Tags.vue line:58', d)
  return d
})

// console.log('👴2023-02-07 16:28:23 Tags.vue line:58', data)

let selectTag = ref('');
const toggleTag = (tag: string) => {
  console.log('👴2023-02-07 16:26:43 Tags.vue line:59', tag)
  selectTag.value = tag;
};
// set font-size
const getFontSize = (length: number) => {
  let size = length * 0.04 + 0.85;
  return { fontSize: `${size}em` };
};
</script>

<style scoped>
.main {
  margin: 0 auto;
  padding: 0.5rem 1.5rem 4rem;
  max-width: 48rem;
}

.tags-header {
  font-weight: bold;
  padding-bottom: 14px;
  font-size: 2.25em;
  margin-top: 24px;
}

.tags {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: left;

  border-bottom: 1px dashed #c7c7c7;
  margin-bottom: 10px;
  padding-bottom: 20px;
}

.tag {
  display: inline-block;
  margin: 6px 8px;
  font-size: 0.85em;
  line-height: 25px;
  transition: 0.4s;
  /* color: #000; */
  cursor: pointer;
}

.tag:hover {
  color: var(--vp-c-hover);
}

.activetag {
  color: var(--vp-c-hover);
}

.tag-length {
  color: var(--vp-c-brand);
  font-size: 12px !important;
  position: relative;
  top: -8px;
}

.header {
  font-size: 1rem;
  font-weight: 600;
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  justify-content: left;
}

.fas-icon {
  width: 2rem;
  height: 2rem;
}

.header-text {
  padding-left: 10px;
}

.article {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 10px;
  color: var(--vp-c-text-2);
  transition: border 0.3s ease, color 0.3s ease;
}

.article:hover {
  text-decoration: none;
  color: var(--vp-c-brand);
}

.date {
  font-family: Georgia, sans-serif;
}
</style>
