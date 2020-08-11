<template>
  <div
    class="header-wrap"
    :class="{'curr': currMenu}"
  >
    <!-- 首行 -->
    <div class="m-header">
      <!-- menu导航 -->
      <ul class="menu-wrap">
        <li
          :class="{'curr': !currMenu}"
          @click="changeMenu()"
        > <span class="icon iconfont iconhome"></span>首页</li>
        <li
          v-for="menu in menuList"
          @click="changeMenu(menu)"
          :class="{'curr': currMenu === menu.name}"
          :key="menu.name"
        >
          {{menu.describe}}
        </li>
      </ul>
      <!-- 搜索 -->
      <div class="search-wrap">
        <el-input
          maxlength="20"
          class="search-input"
          @input="userInputing"
          v-model="searchWord"
          @keyup.enter.native="searchEnter"
          placeholder="请输入关键字..."
        ></el-input>
        <span
          class="icon iconfont iconicon-search"
          @click="searchEnter"
        ></span>
      </div>
      <!-- 其他：投稿合作 -->
      <div class="others-wrap">
        <div
          class="authors"
          @click="goAuthorList"
        >作者们</div>
        <el-popover
          placement="top-start"
          width="200"
          trigger="hover"
          content="请联系 Q: 930174189"
        >
          <el-button
            class="btn"
            slot="reference"
          >投稿&合作</el-button>
        </el-popover>
      </div>
    </div>
    <video
      class="video-bg"
      src="http://cdn.yindong.club/yindong_header_bg.mp4"
      autoplay
      muted
      loop
    ></video>
    <!-- <div class="logo">
      <img
        src="./imgs/yindong.png"
        alt="yindong.club"
      >
      <div class="logo-name yindong">音咚</div>
    </div> -->
    <!-- 音符 -->
    <div class="yinfu-bg">
      <span
        class="icon iconfont"
        :class="makeYinFuIconClass()"
        :style="makeIconStyle(icon)"
        v-for="icon in 28"
        :key="icon"
      ></span>
    </div>
  </div>
</template>

<script>
import { getMenuList } from "@/api/service";
import { getRandomColor, randomMn } from "@/common/utils/utils";
export default {
  name: "header-c",
  data() {
    return {
      menuList: [],
      currMenu: "",
      searchWord: "",
    };
  },
  watch: {
    "$route.path": function () {
      this.routeChangeHighMenu();
    },
  },
  components: {},
  created() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      this.routeChangeHighMenu();
      this.getMenuList();
    },
    routeChangeHighMenu() {
      this.currMenu = this.$route.path.replace(/\//g, "") || "";
    },
    goAuthorList() {
      this.$router.push("/author-list");
    },
    // 只允许 中英文数字
    userInputing() {
      this.searchWord = this.searchWord.replace(
        /[^0-9a-zA-Z\u4e00-\u9fa5]/g,
        ""
      );
    },
    // 搜索框回车
    searchEnter() {
      if (this.searchWord) {
        this.$router.push(`/search/${this.searchWord}`);
      }
    },
    changeMenu(menu) {
      let currMenu = this.currMenu;
      if ((menu && menu.name == currMenu) || (!menu && !currMenu)) {
        return;
      }
      this.currMenu = menu ? menu.name : "";
      this.$router.push(menu ? `/${menu.name}` : "/");
    },
    makeYinFuIconClass() {
      let classList = ["fade-in-out", "yfrotate", "yf-fade-top", "fade-scale"];
      let i = Math.floor(Math.random() * classList.length);
      return `iconyf${randomMn(1, 16)} ${classList[i]}`;
    },
    // 生成  五线谱 icon  颜色
    makeIconStyle(num) {
      let j = 7;
      let p = Math.floor(100 / j);
      let x =
        num < p
          ? randomMn(num * j, (num + 1) * j)
          : randomMn((num - p) * j, (num - p + 1) * j);
      let y = num < p ? randomMn(0, 30) : randomMn(35, 75);
      return `color: ${getRandomColor()};left:${x}%;top:${y}%;`;
    },
    // 获取导航菜单列表
    async getMenuList() {
      let res = (await getMenuList()).data;
      if (res.code === 0) {
        this.menuList = res.data || [];
      } else {
        this.$message.error("服务器异常~");
      }
    },
  },
};
</script>

<style  lang="less">
@theme-bg-color: #eef5ff;
@theme-color: #ce240a;

@media screen and (max-width: 1243px) {
  .video-bg {
    height: 100%;
  }
}

@media screen and (min-width: 1243px) {
  .video-bg {
    width: 100%;
  }
}

.header-wrap {
  min-width: 800px;
  width: 100%;
  height: 150px;
  background: #fff;
  overflow: hidden;
  position: relative;
  .header-img-bg,
  // &.curr {
  //   height: 45px;
  // }
  video {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 0);
  }
  .logo {
    position: absolute;
    width: 200px;
    height: 40px;
    left: 100px;
    bottom: 20px;
    display: flex;
    align-items: center;
    z-index: 1;
    > img {
      width: 30px;
      height: 30px;
      animation: allRotateZ 120s infinite linear;
    }
    .logo-name {
      margin: 0 0 0 6px;
      display: block;
      color: #ff001c;
    }
  }
}

@keyframes allRotateZ {
  100% {
    transform: rotateZ(7200deg);
  }
}

.m-header {
  z-index: 1;
  width: 100%;
  height: 40px;
  color: #fff;
  position: relative;
  display: flex;
  justify-content: space-between;
  line-height: 40px;
  padding: 0 16px 0 40px;
  > div {
    flex: 1;
  }

  .menu-wrap {
    display: flex;
    height: 100%;
    flex: 2;
    li {
      font-size: 16px;
      // margin: 0 0 0 12px;
      padding: 0 6px;
      cursor: pointer;
      transition: 0.15s;
      color: #ccc;
      line-height: 50px;
      &:hover {
        color: #fff;
      }
      &.curr {
        color: #fff;
        text-shadow: 0px 0px 18px #f33838;
        transform: translateY(-10%);
      }
    }
  }
  .search-wrap {
    // min-width: 100px;
    // max-width: 200px;
    height: 26px;
    margin: 10px 30px 0 30px;
    border-radius: 12px;
    background: #fff;
    display: flex;
    padding: 0 8px 0 12px;
    align-content: center;
    justify-content: space-between;
    .search-input  {
      width: 80%;
      input {
        display: block;
        font-size: 14px;
        border: none;
        background: none;
        width: 100%;
        height: 26px;
        padding: 0;
        margin: 0;
        line-height: 26px;
      }
    }
    
    .icon {
      display: inline-block;
      width: 30px;
      height: 100%;
      font-size: 18px;
      height: 26px;
      color: #333;
      text-align: center;
      line-height: 26px;
      // background: #999;
      border-radius: 12px;
      transform: translateX(1px);
      cursor: pointer;
      &:hover {
        color: #169ed4;
      }
    }
  }
  .others-wrap {
    flex: 2;
    display: flex;
    justify-content: flex-end;
    .authors {
      margin: 5px 16px 0 0;
      height: 30px;
      line-height: 30px;
      padding: 0 12px;
      border-radius: 15px;
      background: rgba(36, 196, 204, 0.6);
      font-size: 14px;
      border: none;
      color: #fff;
      cursor: pointer;
    }
    .btn {
      height: 30px;
      line-height: 30px;
      padding: 0 12px;
      border-radius: 15px;
      background: var(--themeColor);
      font-size: 14px;
      border: none;
      color: #fff;
    }
    .el-button:focus,
    .el-button:hover {
      color: #fff;
      border: none;
    }
  }
}

.yinfu-bg {
  opacity: 0.4;
  position: absolute;
  width: 100%;
  height: calc(100% - 40px);
  left: 0;
  top: 40px;
  .icon {
    position: absolute;
    font-size: 30px;
    transition: all 0.35s;
    &.fade-in-out {
      animation: fadeInOut 6s linear infinite forwards;
    }
    &.yfrotate {
      animation: yfrotate 6s linear infinite forwards;
    }
    &.yf-fade-top {
      animation: yffadetop 6s linear infinite forwards;
    }
    &.fade-scale {
      animation: fadescale 6s linear infinite forwards;
    }
  }
  .line {
    display: block;
    width: 100%;
    height: 2px;
    // background: @theme-bg-color;
    margin: 12px 0 0 0;
    &:first-child {
      margin: 0;
    }
  }
}

@keyframes fadeInOut {
  30% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.3;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}

@keyframes yfrotate {
  100% {
    transform: rotateZ(360deg);
  }
}
@keyframes yffadetop {
  0% {
    opacity: 0;
  }
  45% {
    opacity: 1;
  }
  55% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-50%);
  }
}

@keyframes fadescale {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 0.3;
  }
}
</style>
