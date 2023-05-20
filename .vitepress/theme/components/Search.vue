<template>
  <div class="nav-search-bar" @click="toggle">
    <div>
      🔍 search
    </div>

    <div class="r">
      ctrl + k
    </div>
  </div>
  <div class="searchContent" v-if="show">
    <div class="mask-bg" @click="toggle"></div>

    <div class="search-box">
      <div class="search-input">
        🔍 <input type="text" ref="inp" v-model="searchValue" @input="handleInpChange" placeholder="请输入关键字" />

      </div>
      <div class="searchList" v-show="searchList.length > 0">
        <div v-for="(item, index) in searchList" :key="index" :class="{
          select: selectCurrent === index,
          searchItem: true
        }" @click="clickItem(item)">
          <div>
            <div v-if="item.level !== 0"> {{ item.pateTitle }}</div>
            <div :class="{
              isHead: item.level !== 0,
              contentBox: true
            }">
              <div>
                <span v-for="flag in item.level">#</span>
              </div>
              <div v-html="item.content" />
            </div>
          </div>

          <span>
            <i class="icon-huiche iconfont" v-show="selectCurrent === index"></i>
          </span>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup lang="ts">
import less from 'less';
import { useData } from 'vitepress';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const data = useData();
const searchValue = ref('')
const show = ref(false)
const inp = ref<HTMLDivElement>()
const selectCurrent = ref(0)

const clickItem = (item) => {
  location.href = item.path
}

const handleKeyDown = e => {
  const { key } = e
  // 按下ctrl + k 打开搜索
  if ((e.ctrlKey || e.metaKey) && key === 'k') {
    toggle()
  }
  console.log(key);

  // 方向键向上
  if (key === 'ArrowDown') {
    // e.stopImmediatePropagation()
    e.preventDefault();
    changeSelectCurrent(1)
  }
  // 方向键向下
  if (key === 'ArrowUp') {
    e.preventDefault();
    changeSelectCurrent(-1)
  }
  if (key === 'Enter' && show.value) {
    const item = searchList.value[selectCurrent.value]
    console.log(item);
    if (item) {
      location.href = item.path
    }
  }
}


const changeSelectCurrent = (index: number) => {

  const newV = selectCurrent.value + index
  if (newV < 0 || newV > searchList.value.length - 1) {
    return
  }
  selectCurrent.value = newV
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

const toggle = () => {
  show.value = !show.value
  if (show.value) {
    setTimeout(() => {
      // console.log('inp.value', inp.value);
      inp.value!.focus()
    }, 50);
  }
}
type SearchItem = {
  content: string,
  level: number,
  path: string,
  pateTitle?: string
}


const searchList = ref<SearchItem[]>([])

let posts: SearchItem[] = []

data.theme.value.posts.forEach(item => {
  const path = item.regularPath
  const pageTitle = item?.frontMatter?.title
  if (pageTitle) {
    posts.push({
      level: 0,
      content: pageTitle,
      path
    })
  }
  item.titles.forEach(item => {
    const { content, level } = item
    if (content.indexOf('title:') >= 0) {
      return
    }
    posts.push({ content, level, path, pateTitle: pageTitle })
  })
})
// 根据level进行排序一下
posts.sort((a, b) => a.level - b.level)


// 去除掉content重复的内容

const postMap = {}


posts.forEach(item => {

  if (!postMap[item.content]) {
    postMap[item.content] = item
  }
})
posts = Object.values(postMap)

const boldKeyword = (keyword, str) => {
  let rex = new RegExp(keyword, 'is');
  return str.replace(rex, `<b class="keyword">$&</b>`);
};


const handleInpChange = () => {
  if (!searchValue.value.trim()) {
    searchList.value = []
    return
  }

  searchList.value = posts.filter(item => {
    return item.content.toLocaleLowerCase().indexOf(searchValue.value.toLocaleLowerCase()) !== -1
  }).filter((_, index) => index < 5).map((_item) => {
    const item = { ..._item }
    item.content = boldKeyword(searchValue.value, item.content)
    return { ...item }
  })
  if (searchList.value.length > 0) {
    selectCurrent.value = 0
  }
}




</script>
<style  scoped lang="less">
.nav-search-bar {
  background-color: var(--vp-search-bg-color);
  width: 180px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  .r{
    font-size: 10px;
    transform: scale(0.8);
  }
  &:hover{
    opacity: .8;
  }
}

.searchContent {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  position: fixed;
  color: #000;
  .mask-bg{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.3);
    z-index: 1;
  }
  .search-box{
    position: absolute;
    left: 50%;
    top:100px;
    transform: translateX(-50%);
    width: 600px;
    max-width: 100vw;
    // max-height: 400px;
    background: #fff;
    border-radius: 4px;
    z-index: 2;

  }
}
.search-input{
  border-bottom: 1px solid #eee;
  padding: 20px;
  display: flex;
  align-items: center;

  input{
    margin-left: 20px;
    font-size: 20px;
    flex: 1;
  }
}
.searchList{
  padding: 20px;
  .contentBox{
    display: flex;
  }
  .searchItem{
    padding: 10px;
    display: flex ;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    .isHead{
      color: #aaa;
      font-size: 12px;
    }
    &:hover,&.select{
      background-color: rgba(0,0,0,0.03);
      border-radius: 4px;
    }

  }

}


</style>

<style>
.keyword {
  color: var(--vp-c-brand);
}
</style>