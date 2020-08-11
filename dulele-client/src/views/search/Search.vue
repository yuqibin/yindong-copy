<template>
  <div class="search-page-wrap">
    <div class="container">
      <SubTitle
        :title-name="'搜索结果~'"
        :icon-name="iconName"
        :class-name="'sousuojieguo'"
      ></SubTitle>
      <ul
        class="res-wrap"
        v-if="searchResult.length"
      >
        <li
          v-for="(art, index) in searchResult"
          @click="goArtDetail(art.id)"
          :key="index"
        >
          <div class="title-name">
            <span v-html="pickKeyWord(art.title)"></span>
          </div>
          <div
            class="art-text"
            v-html="makeShortText(art.content)"
          ></div>
          <div class="other-info">
            <span class="author">{{art.author}}</span>
            <span class="create-time">{{formatDate(art.createtime)}}</span>
            <span class="count">
              <span class="icon iconfont iconreadtimes"></span>
              {{art.readtimes}}
            </span>
          </div>
        </li>
      </ul>
      <!-- 无结果 -->
      <div
        class="no-search-data"
        v-show="!searchResult.length"
      >
        <svg
          class="icon"
          aria-hidden="true"
        >
          <use :xlink:href="'#iconxbq3'"></use>
        </svg>
        <svg
          class="icon"
          aria-hidden="true"
        >
          <use :xlink:href="'#iconxbq2'"></use>
        </svg>
        <span class="no-data-text shayemeisoudao">哦豁~啥也没搜到~这边建议换个关键词呢~~</span>
        <svg
          class="icon"
          aria-hidden="true"
        >
          <use :xlink:href="'#iconxbq5'"></use>
        </svg>
        <svg
          class="icon"
          aria-hidden="true"
        >
          <use :xlink:href="'#iconxbq1'"></use>
        </svg>
      </div>
    </div>
    <!-- 回顶部 -->
    <el-backtop
      :bottom="80"
      target=".search-page-wrap"
    ></el-backtop>
  </div>
</template>

<script>
import { getArticleList } from "@/api/service";
import { formatDate } from "@/common/utils/utils";
export default {
  name: "search",
  data() {
    return {
      searchResult: [],
    };
  },
  computed: {
    iconName: function () {
      return this.searchResult.length ? "iconxbq10" : "iconxbq7";
    },
    keyWord: function () {
      return this.$route.params.keyword;
    },
  },
  components: {
    SubTitle: () => import("../../components/SubTitle"),
  },
  watch: {
    keyWord: {
      handler: function () {
        this.getArticleList();
      },
      immediate: true,
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {},
    // 前往文章详情
    goArtDetail(aid) {
      this.$router.push(`/a/${aid}`);
    },
    // 截取200字符 除去格式 作为预览
    makeShortText(content) {
      content = content.replace(/[^0-9a-zA-Z\u4e00-\u9fa5]/g, "").slice(0, 200);
      // return this.$markdowner.makeHtml(content);
      return content;
    },
    // 格式化日期
    formatDate(time) {
      return formatDate(new Date(time), "yyyy-MM-dd");
    },
    // 关键字查询
    async getArticleList() {
      let res = await getArticleList({ keyword: this.keyWord });
      res = res.data;
      if (res.code === 0 && Array.isArray(res.data)) {
        this.searchResult = [...res.data];
      }
    },
    // 高亮关键字
    pickKeyWord(title) {
      return title.replace(
        this.keyWord,
        `<span class='high-keyword'>${this.keyWord}</span>`
      );
    },
  },
};
</script>

<style  lang="less">
.high-keyword {
  color: var(--themeColor);
}

.search-page-wrap {
  .res-wrap {
    position: relative;
    width: 1000px;
    margin: 0 auto;
    li {
      cursor: pointer;
      border-top: 1px solid #ccc;
      padding: 20px 40px 40px 40px;
      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }
      .title-name {
        // font-weight: 400;
        font-size: 18px;
      }
      .art-text {
        margin: 12px 0 0 0;
        font-size: 14px;
        color: #292929;
      }
      .other-info {
        margin: 10px 0 0 0;
        font-size: 12px;
        color: #666;
        > span {
          margin: 0 24px 0 0;
          .icon {
            font-size: 14px;
          }
        }
      }
    }
  }
  .no-search-data {
    text-align: center;
    .no-data-text {
      display: block;
      width: 100%;
      font-size: 22px;
      color: salmon;
      margin: 20px 0;
    }
  }
}
</style>
