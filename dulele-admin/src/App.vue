<template>
  <div id="app">
    <Header v-if="routePath !== '/login'"></Header>
    <router-view class="picker" />
  </div>
</template>

<script>
import { isAdmin } from "@/api/service";
import adminRoutes from "./router/admin";
export default {
  name: "app",
  data() {
    return {};
  },
  components: {
    Header: () => import("./components/header/Header"),
  },
  computed: {
    routePath: function () {
      return this.$route.path;
    },
  },
  created() {
    this.checkSession();
  },
  methods: {
    async checkSession() {
      let res = await isAdmin();
      res = res.data;
      if (res.code === 0) {
        this.$router.addRoutes(adminRoutes);
      }
    },
  },
};
</script>  


<style lang="less">
// icon库
@import url("//at.alicdn.com/t/font_1417814_57lmwepx95p.css");
// base
@import url("./assets/css/base.css");
@import url("./assets/css/adaptation.less");
// Markdown 主题
@import url("./assets/css/markdown_theme.css");
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}
.picker {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  margin: 0 0 0 200px;
  background-color: #f2f6fb;
}

.scroll-wrap {
  overflow-y: auto;
  padding: 0 4px 0 0;

  /* 设置滚动条的样式 */
  &::-webkit-scrollbar {
    position: absolute;
    width: 5px;
    right: -50px;
    border-radius: 5px;
  }

  /* 滚动槽 -- 背景 */
  &::-webkit-scrollbar-track {
    border-radius: 10px;
  }

  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    cursor: pointer;
    width: 4px;
    border-radius: 6px;
    background: #ccc !important;
  }
}

// ele ui     ---------------------------------
.el-popconfirm__main {
  padding: 8px 0;
}
body .el-input__inner {
}
</style>
