<template>
  <div class="art-detail-wrap">
    <BackBtn></BackBtn>

    <div class="container">
      <SubTitle
        :title-name="'文章详情~'"
        :icon-name="'iconxbq1'"
        :class-name="'wenzhangxingqing'"
      ></SubTitle>
      <div
        class="art"
        v-if="art"
      >
        <h1> {{art.title}} </h1>
        <div class="tips">
          <span class="author">作者: <span @click="goAthorInfo(art.authorid)">{{art.author}}</span></span>
          <span class="date">{{artDate.mon}} {{artDate.date}}, {{artDate.year}}</span>
          <span><span class="icon iconfont iconreadtimes"></span>{{art.readtimes}}</span>
          <span><span class="words icon iconfont iconwords"></span>{{art.content.length}}</span>
          <CopyText :c-text="cText"></CopyText>
          <span
            class="add el-icon-plus"
            @click="addToListOne(art)"
          ></span>
          <span
            class="play icon iconfont iconplay"
            @click="addToPlayOne(art)"
          ></span>
        </div>
        <div
          id="nice"
          ref="mdnice"
          class="markdown-body"
          v-html="markdowner.makeHtml(escapeHtml(art.content))"
        ></div>
      </div>
    </div>
    <el-backtop
      :bottom="80"
      target=".art-detail-wrap"
    ></el-backtop>
  </div>
</template>

<script>
import { getDetailList } from "@/api/service";
import Bus from "@/common/bus/bus";
import { escapeHtml } from "@/common/utils/utils";
const monTextMap = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十一月",
];
export default {
  name: "art-detail",
  data() {
    return {
      // markdown 实例对象
      markdowner: this.$markdowner,
      art: null,
      cText: "",
    };
  },
  watch: {
    "art.content": function () {
      this.$nextTick(() => {
        this.cText = this.$refs.mdnice.textContent;
      });
    },
  },
  computed: {
    artDate: function () {
      let time = new Date(this.art.createtime);
      return {
        year: time.getFullYear(),
        mon: monTextMap[time.getMonth()],
        date: time.getDate(),
      };
    },
  },
  components: {
    BackBtn: () => import("../../components/Back"),
    CopyText: () => import("../../components/CopyText"),
    SubTitle: () => import("../../components/SubTitle"),
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getDetailList();
    },
    escapeHtml(html) {
      return escapeHtml(html);
    },
    goAthorInfo(auid) {
      this.$router.push(`/author/${auid}`);
    },
    // 播放单个
    addToPlayOne(a) {
      Bus.$emit("addToList", [a], true);
    },
    // 添加单个
    addToListOne(a) {
      Bus.$emit("addToList", [a]);
    },
    async getDetailList() {
      let res = await getDetailList({ idlist: [this.$route.params.aid] });
      res = res.data;
      if (res.code === 0 && Array.isArray(res.data) && res.data.length) {
        this.art = res.data[0];
      }
    },
  },
};
</script>

<style  lang="less">
.art-detail-wrap {
  font-weight: 400;
  font-family: eafont, Hiragino Sans GB, Hiragino Sans GB W3, Microsoft YaHei,
    WenQuanYi Micro Hei, sans-serif;
  .art {
    position: relative;
    min-width: 1000px;
    max-width: 1200px;
    margin: 0 auto;
    // padding: 0 100px;
    overflow: hidden;
  }
  h1 {
    letter-spacing: 1px;
    font-size: 30px;
    color: #333;
    margin: 0;
    text-align: center;
  }
  .tips {
    color: #6a737d;
    position: relative;
    line-height: 22px;
    font-size: 13px;
    margin: 22px 0 0 0;
    .author {
      span {
        cursor: pointer;
        color: #000;
        font-weight: bold;
        &:hover {
          color: var(--themeColor);
        }
      }
    }
    span {
      margin: 0 30px 0 0;
    }
    .play {
      cursor: pointer;
    }
    .icon {
      margin: 0 4px 0 0;
      font-size: 16px;
    }
    .copy {
      font-size: 18px;
      .tips {
        color: #999;
      }
    }
    .add {
      font-weight: bold;
      margin: 0 16px;
      cursor: pointer;
    }
    .add,
    .play {
      padding: 4px;
      &:hover {
        color: var(--themeColor);
      }
    }
  }
  .markdown-body {
    margin: 20px 0 70px 0;
    padding: 20px 60px;
    font-weight: 400;
    line-height: 30px;
    li {
      list-style: inherit;
    }
    ol li {
      list-style: decimal;
    }
  }
}
</style>
