<template>
  <div class="index-wrap">
    <Title :name="'😀😃😄😁😆😅😂🤣☺️😊😇🙂🙃😉😌😍🥰😘😗😙😚😋😛😝😜🤪🤨🧐🤓😎🤩🥳'"></Title>
    <!-- 搜索 -->
    <div class="search-wrap">
      <el-input
        maxlength="20"
        clearable
        v-model="searchWord"
        @keyup.enter.native="searchEnter"
        placeholder="请输入内容"
      ></el-input>
      <button @click="searchEnter">搜索</button>
      <!-- 新增文章 -->
      <div class="add-article">
        <svg
          class="icon"
          @click="addArticle"
          aria-hidden="true"
        >
          <!-- xinjian   or   chuangjian -->
          <use :xlink:href="'#icon-chuangjian'"></use>
        </svg>
      </div>
    </div>
    <!-- 列表 容器-->
    <div
      class="article-list scroll-wrap infinite-list"
      style="overflow:auto"
      @mouseleave="hoverIndex = null"
    >
      <!-- 表头 -->
      <div class="a-head">
        <div class="a-title">标题</div>
        <div class="a-content">内容</div>
        <div class="a-tag">标签</div>
        <div class="a-time">创建日期</div>
        <div class="a-readnum">阅读次数</div>
        <div class="a-operation">操作</div>
      </div>
      <!-- 文章列表 -->
      <!-- v-for="(article,index) in articleList" -->
      <div
        class="article infinite-list-item"
        @mouseover="hoverIndex = index"
        :class="{'curr': hoverIndex === index}"
        v-for="(article,index) in aFilterList"
        :key="index"
      >
        <div class="a-title">{{article.title || '-'}}</div>
        <div
          class="a-content ell2"
          v-html="article.content || '-'"
        ></div>
        <div class="a-tag">{{menuMap[article.tag] || '-'}}</div>
        <div class="a-time">{{formatDate(article.createtime)}}</div>
        <div class="a-readnum">{{article.readtimes || '0'}}</div>
        <div class="a-operation">
          <!-- 查看 -->
          <span
            class="look icon iconfont icon-chakan"
            @click="goArtDetail(article.id)"
          ></span>
          <!-- 编辑 -->
          <span
            class="edit icon iconfont icon-bianji"
            @click="editArticle(article.id)"
          ></span>
          <!-- 删除 -->
          <el-popconfirm
            class="del-article"
            confirmButtonText='确定'
            cancelButtonText='容我再想想~'
            icon="el-icon-loading"
            @onConfirm="delArticle(article.id)"
            iconColor="blue"
            title="确定删除吗？"
          >
            <el-button slot="reference">
              <span class="del icon iconfont icon-shanchu"></span>
            </el-button>
          </el-popconfirm>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "../../components/title/Title";
import Bus from "../../common/bus/bus";
import { getArticleList, delArticle } from "@/api/service";
import { formatDate } from "@/common/utils/utils";

export default {
  name: "index-c",
  data() {
    return {
      menuList: [],
      menu: {},
      searchWord: "",
      articleList: [],
      hoverIndex: null,
      artNums: 0,
    };
  },
  components: {
    Title,
  },
  watch: {
    searchWord: function () {
      if (!this.searchWord) {
        this.getArticleList();
      }
    },
    menu: {
      handler: function () {
        // this.getArticleList();
      },
      immediate: true,
    },
  },
  computed: {
    // 标签过滤后的list
    aFilterList() {
      let menu = this.menu;
      return this.articleList.filter((a) => {
        return !menu.name || a.tag === menu.name;
      });
    },
    menuMap: function () {
      let obj = {};
      for (let menu of this.menuList) {
        obj[menu.name] = menu.describe;
      }
      return obj;
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.changeMenu();
      this.getArticleList();
    },
    goArtDetail(aid) {
      window.open(`http://www.yindong.club/a/${aid}`);
    },
    // 加载更多
    loadMoreArt() {
      let timer = setInterval(() => {
        if (this.articleList.length) {
          this.artNums += 3;
          if (this.artNums >= this.articleList.length - 1) {
            this.artNums = this.articleList.length - 1;
          }
          window.clearInterval(timer);
        }
      }, 10);
    },
    // 编辑文章
    editArticle(id) {
      this.$router.push({
        path: "/edit",
        query: {
          id,
        },
      });
    },
    // 删除
    delArticle(id) {
      let that = this;
      delArticle({ id }).then((res) => {
        res = res.data || {};
        if (res.code === 0) {
          that.articleList = that.articleList.filter((a) => {
            return a.id !== id;
          });
          that.$message.success("删除成功~");
        } else {
          that.$message.error("删除失败~请稍后重试~");
        }
      });
    },
    // 前往新增文章页面
    addArticle() {
      this.$router.push("/new");
    },
    formatDate(time) {
      return formatDate(time, "yyyy/MM/dd");
    },
    // 搜索框回车
    searchEnter() {
      if (this.searchWord) {
        this.getArticleList();
      }
    },
    // 获取文章列表
    getArticleList() {
      let that = this;
      getArticleList({
        tag: this.menu.name || "",
        keyword: this.searchWord,
      }).then((res) => {
        res = res.data || {};
        if (res.code === 0) {
          that.articleList = res.data || [];
        } else {
          // console.error(res);
        }
      });
    },
    // 切换菜单（标签）
    changeMenu() {
      Bus.$on("changeMenu", (info) => {
        this.artNums = 0;
        this.menuList = JSON.parse(sessionStorage.getItem("menuList")) || [];
        this.menu = info;
      });
    },
  },
};
</script>

<style lang="less">
@theme-color: #8d69e2;

// 渐变色，只支持两种颜色
.gradual-change-x (@left, @right) {
  background: linear-gradient(to right, @left, @right);
}

.gradual-change-y (@top, @bottom) {
  background: linear-gradient(@top, @bottom);
}

.index-wrap {
  padding: 0 0 0 200px;
  margin: 0;
  position: relative;
  // .gradual-change-y(rgba(239, 120, 249, 0.63), rgba(120, 206, 232, 0.55));
  background: #f2f6fb;
}
.search-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  align-content: center;
  button {
    // margin: 0 0 0 10px;
    padding: 0 16px;
    border: none;
    border-radius: 0 4px 4px 0;
    background-color: rgba(141, 105, 226, 1);
    color: #fff;
    cursor: pointer;
    transition: 0.15s;
    .gradual-change-x(rgba(28, 162, 214, 0.64), rgba(72, 232, 195, 0.82));
    &:hover {
      .gradual-change-x(rgba(28, 162, 214, 0.8), rgba(72, 232, 195, 1));
    }
    &:active {
      .gradual-change-x(rgba(28, 162, 214, 0.54), rgba(72, 232, 195, 0.82));
    }
  }
  .el-input {
    width: 240px;
    color: #333;
    input {
      height: 36px;
      line-height: 36px;
      color: #333;
      border-radius: 4px 0 0 4px;
      background: none;
      // background-color: rgba(141, 105, 226, 0.6);rgba(53, 181, 230, 0.54), rgba(69, 241, 170, 0.52)
      // .gradual-change-x(rgba(53, 181, 230, 0.54), rgba(69, 241, 170, 0.52));
      border-image: linear-gradient(
          to right,
          rgba(23, 177, 212, 0.54),
          rgba(136, 208, 237, 0.81)
        )
        2 2;
      border-right: none;
      &::placeholder {
        // color: #fff;
      }
    }
    .el-input__suffix {
      color: #fff;
    }
  }
}
.article-list {
  // width: 100%;
  margin: 20px 40px;
  height: calc(100% - 176px);
  box-sizing: border-box;
  // background: #f3f6f9;
  box-shadow: 0px 0px 10px #84c8f040;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 4px;
  overflow-y: auto;
  overflow-x: hidden;
  text-align: center;
  position: relative;
  .a-head {
    line-height: 50px;
    border-bottom: 1px dashed rgba(75, 164, 173, 0.63);
    // background: rgba(255, 255, 255, 0.6);
    display: flex;
    justify-content: space-between;
    color: #333;
    font-size: 18px;

    > div {
      flex: 1;
      padding: 0 6px;
    }
    .a-title {
      flex: 2;
    }
    .a-content {
      flex: 3;
    }
    .a-operation {
      flex: 2;
    }
  }
  .article {
    display: flex;
    align-items: center;
    font-size: 14px;
    padding: 6px 0;
    margin: 2px 0;
    &.curr {
      // background: rgba(0, 0, 0, 0.02);
      cursor: pointer;
      transition: 0.15s;
      box-shadow: 0px 3px 8px rgba(188, 188, 189, 0.45);
      transform: scale(1.001);
    }
    > div {
      flex: 1;
      padding: 0 6px;
      line-height: 40px;
      color: #333;
    }
    .a-title {
      flex: 2;
    }
    .a-content {
      flex: 3;
      text-align: left;
      overflow: hidden;
      padding: 6px 6px 0 6px;
      line-height: 20px;
      max-height: 120px;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
    }
    .a-operation {
      .del-article button {
        border: none;
        background: none;
        padding: 0;
        &:hover {
          background: none;
        }
      }
      flex: 2;
      .icon {
        font-size: 20px;
        margin: 0 6px;
        cursor: pointer;
        position: relative;
        z-index: 0;
      }
      .look {
        color: #8da5e8;
        &:hover {
          transition: 0.15s;
          color: #4273fe;
        }
      }
      .edit {
        color: #8da5e8;
        &:hover {
          transition: 0.15s;
          color: #4273fe;
        }
      }
      .del {
        color: #fff;
        &:hover {
          transition: 0.15s;
          &::after {
            background: #f56c6c;
          }
        }
        &::after {
          content: "";
          z-index: -1;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #f5b3b3;
        }
      }
    }
  }
}

.add-article {
  position: absolute;
  right: 40px;
  top: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  // background: @theme-color;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    opacity: 0.9;
  }
  .icon {
    display: inline-block;
    font-size: 32px;
  }
}
</style>
