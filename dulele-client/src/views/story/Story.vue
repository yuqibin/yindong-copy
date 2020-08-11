<template>
  <div
    class="story-wrap scroll-wrap"
    @scroll="scrollHandle"
  >
    <div class="container">
      <SubTitle
        :title-name="'小故事~'"
        :icon-name="'iconxbq11'"
        :class-name="'xiaogushi'"
      ></SubTitle>
      <ArticleList
        @getNoDataFlag="getNoDataFlag"
        :condition="aListCondition"
      ></ArticleList>
    </div>
    <!-- 回到顶部 -->
    <el-backtop
      :bottom="80"
      target=".scroll-wrap"
    ></el-backtop>
  </div>
</template>

<script>
export default {
  name: "story",
  data() {
    return {
      tag: "story",
      offset: 0,
      noMoreDataFlag: false,
    };
  },
  components: {
    ArticleList: () => import("../../components/ArticleList"),
    SubTitle: () => import("../../components/SubTitle"),
  },
  computed: {
    // 文章列表组件参数
    aListCondition: function () {
      return {
        offset: this.offset,
        tag: this.tag || "",
      };
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {},
    scrollHandle(e) {
      if (this.noMoreDataFlag) {
        return;
      }
      let target = e.target || {};
      if (target.scrollHeight === target.clientHeight + target.scrollTop) {
        this.offset += 10;
      }
    },
    getNoDataFlag(flag) {
      this.noMoreDataFlag = flag;
    },
  },
};
</script>

<style scoped>
</style>
