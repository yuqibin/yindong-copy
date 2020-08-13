<template>
  <div id="app">
    <Header></Header>
    <transition name="slide-fade">
      <router-view class="module-wrap" />
    </transition>
    <Player></Player>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {};
  },
  components: {
    Player: () => import("./views/player/Player"),
    Header: () => import("./components/Header"),
  },
  methods: {},
};
</script>

<style lang="less">
// base
@import url("./assets/css/base.css");
// 字体
@import url("./assets/font/font.css");
// icon
@import url("//at.alicdn.com/t/font_1969628_iogc2vjooee.css");
// Markdown 主题
@import url("./assets/css/markdown_theme.css");

/* 设置持续时间和动画函数 cubic-bezier(1, 0.5, 0.8, 1) */
.slide-fade-enter-active {
  transition: all 0.25s ease 0.25s;
}
.slide-fade-leave-active {
  transition: all 0.25s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

// @theme-bg-color: #eef5ff;
// @theme-color: #ce240a;

:root {
  --themeColor: #ce240a;
  --bgColor: #eef5ff;
}

body {
  overflow: hidden;
}

body .module-wrap {
  height: calc(100vh - 126px);
  overflow: hidden;
  position: relative;
  overflow-y: auto;
  margin: 8px 2px;
  &::-webkit-scrollbar {
    width: 5px;
    border-radius: 3px;
  }
  /* 滚动槽 -- 背景 */
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }

  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    width: 5px;
    border-radius: 2px;
    background: #999;
    // background-image: url("./assets/imgs/bg-frosting.png");
  }
  .container {
    position: relative;
    min-width: 1200px;
    max-width: 1600px;
    margin: 0 auto;
    padding: 0 100px;
  }
}

// 滚动条ui
.scroll-wrap {
  // scroll-behavior: smooth;
  overflow-y: auto;
  padding: 0 12px 0 0;
  /* 设置滚动条的样式 */
  &::-webkit-scrollbar {
    position: absolute;
    width: 4px;
    right: -50px;
    border-radius: 5px;
  }

  /* 滚动槽 -- 背景 */
  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.4);
  }

  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    cursor: pointer;
    width: 4px;
    border-radius: 6px;
    background: #ccc;
  }
}

// #50616d
// rgba(0,0,0,0.5) 0 0 8px
// #000 0 0 6px
// http://s4.music.126.net/style/web2/img/default/default_album.jpg
body {
  overflow-x: hidden;
  width: 100vw;
  min-height: 100vh;
  // background-image: url("./assets/imgs/bg-frosting.png");
  background-color: rgb(136, 173, 166);
  background-color: #eef5ff;
  font-family: eafont, Hiragino Sans GB, Hiragino Sans GB W3, Microsoft YaHei,
    WenQuanYi Micro Hei, sans-serif;
}

.markdown-body {
  li {
    list-style: inherit;
  }
  ol li {
    list-style: decimal;
  }
}
</style>
