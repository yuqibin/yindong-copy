<template>
  <div class="author-show-wrap">
    <BackBtn></BackBtn>
    <div class="container">
      <SubTitle
        :title-name="'瞧一瞧~看一看啦~'"
        :icon-name="'iconxbq18'"
        :class-name="'qiaoyiqiao'"
      ></SubTitle>
      <!-- 头像 -->
      <div
        class="head-pic"
        v-if="authorInfo"
      >
        <div class="color-bg"></div>
        <img
          :src="authorInfo.uicon"
          alt=""
        >
      </div>
      <!-- 信息 -->
      <div
        class="info"
        v-if="authorInfo"
      >
        <h1 class="ell">{{authorInfo.realname}}</h1>
        <p class="ell"><span class="qm">{{authorInfo.autograph}}</span></p>
        <p><span class="icon iconfont iconreadtimes"> {{authorInfo.readcount || '0'}}</span></p>
      </div>
      <!-- 文章列表 -->
      <div
        class="a-list-wrap scroll-wrap"
        v-show="authorAList.length"
      >
        <div class="name">
          <span class="play-all">
            <span
              class="play"
              @click="addToPlayAll"
            >
              <span class="icon iconfont iconplay"></span>
              ALL
            </span>
            <span
              class="add"
              @click="addToListAll"
            >
              <span class="icon el-icon-plus"></span>
              ALL
            </span>
          </span>
        </div>
        <div
          class="a-item"
          v-for=" (a,index) in authorAList"
          :class="{'curr-bg': index % 2 === 1}"
          :key="a.id"
        >
          <span
            class="title-name ell"
            @click="goArtDetail(a.id)"
          >{{a.title}}</span>
          <div class="play-add">
            <span
              class="add icon el-icon-plus"
              @click.stop="addToListOne(a)"
            ></span>
            <span
              class="play icon iconfont iconplay"
              @click.stop="addToPlayOne(a)"
            ></span>
          </div>
        </div>

      </div>
      <!-- 无数据 -->
      <div
        class="no-data"
        v-show="!authorAList.length"
      >
        啊哦~啥也没有~
      </div>
    </div>
    <!-- 回顶部 -->
    <el-backtop
      :bottom="80"
      target=".author-show-wrap"
    ></el-backtop>
  </div>
</template>

<script>
import { getArticleList, getAuthorInfo } from "@/api/service";
import Bus from "@/common/bus/bus";
export default {
  name: "author-show",
  data() {
    return {
      authorInfo: null,
      authorAList: [],
    };
  },
  components: {
    BackBtn: () => import("../../components/Back"),
    SubTitle: () => import("../../components/SubTitle"),
  },
  computed: {
    auid: function () {
      return this.$route.params.auid;
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getAuthorInfo();
      this.getArticleList();
    },
    // 获取作者详细信息
    async getAuthorInfo() {
      let res = await getAuthorInfo({ auid: this.auid });
      res = res.data;
      if (res.code === 0) {
        this.authorInfo = res.data;
      }
    },
    // 前往文章详情
    goArtDetail(aid) {
      this.$router.push({
        path: `/a/${aid}`,
      });
    },
    // 获取作者文章列表
    async getArticleList() {
      this.authorAList = [];
      let res = await getArticleList({ authorid: this.auid });
      res = res.data;
      if (res.code === 0) {
        this.authorAList = res.data;
      }
    },
    // 播放全部
    addToPlayAll() {
      Bus.$emit("replaceList", this.authorAList);
    },
    // 添加全部
    addToListAll() {
      Bus.$emit("addToList", this.authorAList);
    },
    // 播放单个
    addToPlayOne(a) {
      Bus.$emit("addToList", [a], true);
    },
    // 添加单个
    addToListOne(a) {
      Bus.$emit("addToList", [a]);
    },
  },
};
</script>

<style lang="less">
.author-show-wrap {
  padding: 0 0 40px 0;
  .info {
    display: inline-block;
    font-size: 12px;

    h1 {
      font-size: 22px;
      padding: 0 0 12px 0;
      text-align: left;
      max-width: 800px;
    }
    p {
      span {
        color: #666;
        font-size: 14px;
      }
      .qm {
        color: #666;
      }
    }
  }
  .head-pic {
    display: inline-block;
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 20px 0 0;
    overflow: hidden;
    border-radius: 4px;
    .color-bg {
      position: absolute;
      left: -45px;
      top: -45px;
      width: 200px;
      height: 200px;
      background-image: linear-gradient(
        rgba(123, 115, 234, 0.61),
        rgba(113, 216, 232, 0.7),
        rgba(228, 115, 115, 0.7),
        rgba(158, 236, 109, 0.7),
        rgba(226, 103, 205, 0.7),
        rgba(241, 127, 115, 0.7),
        rgba(67, 228, 169, 0.7)
      );
      animation: move 120s linear infinite alternate;
    }
    img {
      z-index: 1;
      border-radius: 4px;
      width: 90%;
      height: 90%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .a-list-wrap {
    .name {
      display: block;
      font-size: 16px;
      margin: 12px 0 12px 0;
      color: var(--themeColor);
      display: flex;
      justify-content: flex-end;
      align-content: center;
      .play-all {
        transform: translateY(3px);
        font-size: 16px;
        border-radius: 14px;
        vertical-align: middle;
        color: #666;
        > span {
          padding: 4px 4px;
          border-bottom: 1px dashed #666;
          &:hover {
            color: var(--themeColor);
          }
        }
        .play {
          cursor: pointer;
        }
        .add {
          cursor: pointer;
          margin: 0 0 0 16px;
          .icon {
            font-weight: bold;
          }
        }
      }
    }
    .a-item {
      font-size: 14px;
      line-height: 35px;
      padding: 0 4px;
      display: flex;
      align-content: center;
      justify-content: space-between;
      padding: 0px 40px;
      border-radius: 4px;
      &:hover {
        .icon {
          opacity: 1;
          pointer-events: auto;
        }
      }
      .title-name {
        width: max-content;
        padding: 0 8px 0 0;
        cursor: pointer;
        &:hover {
          color: var(--themeColor);
        }
      }
      .play-add {
        width: 80px;
        text-align: right;
        letter-spacing: 8px;
      }
      &.curr-bg {
        background: rgba(230, 230, 230, 0.3);
      }
      &:hover {
        background: rgba(245, 188, 188, 0.3);
      }
      .play {
        font-size: 15px;
      }
      .add {
        font-weight: bold;
        margin: 0 4px;
      }
      .icon {
        opacity: 0;
        pointer-events: none;
        line-height: 25px;
        display: inline-block;
        font-size: 16px;
        cursor: pointer;
        color: #999;
        &:hover {
          color: var(--themeColor);
        }
      }
    }
  }
  .no-data {
    text-align: center;
    color: #666;
    padding: 55px 0;
  }
}

@keyframes move {
  // 0% {
  //   left: -10px;
  //   top: -10px;
  // }
  // 100% {
  //   left: -105px;
  //   top: -105px;
  // }
  100% {
    transform: rotateZ(-7200deg);
  }
}
</style>