<template>
  <div class="article-list-wrap">
    <section
      class="article-detail"
      :class="{'curr': index % 2 === 1}"
      v-for="(mon,index) in aChangeList"
      :key="index"
    >
      <h2 class="year-mon">{{mon.mon}}, {{mon.year}}</h2>
      <ul class="mon-list">
        <li
          v-for="a in mon.list"
          :key="a.id"
        >
          <div class="info">
            <img
              :src="a.coverphoto"
              @click="goArtDetail(a.id)"
              alt=""
            >
            <span
              class="title ell"
              @click="goArtDetail(a.id)"
            >{{a.title}}</span>
            <span class="author-and-count">
              <span
                class="author"
                @click="goAuthorDetail(a.authorid)"
              >{{a.author}}</span>
              <span class="count icon iconfont iconreadtimes"><span>{{a.readtimes}}</span></span>
            </span>
          </div>
          <div class="control">
            <span
              class="add el-icon-plus"
              @click="addToListOne(a)"
            ></span>
            <span
              class="play icon iconfont iconplay"
              @click="addToPlayOne(a)"
            ></span>
          </div>
          <span class="date">
            {{numeralDate(new Date(a.createtime).getDate())}}
          </span>
        </li>
      </ul>

    </section>
    <div
      class="no-more-data"
      v-show="noMoreDataFlag"
    >哦豁 没有更多了~~</div>
    <div class="add-loading">
      <AddLoading v-show="loadingMoreFlag"></AddLoading>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/common/utils/utils";
import Bus from "@/common/bus/bus";
import { getArticleList } from "@/api/service";
import numeral from "numeral";

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
  name: "ArticleList",
  data() {
    return {
      articleList: [],
      offset: 0,
      size: 10,
      loadingMoreFlag: false,
      noMoreDataFlag: false,
    };
  },
  props: {
    condition: {
      required: true,
    },
  },
  watch: {
    condition: {
      handler: function () {
        if (!this.loadingMoreFlag) {
          this.offset += this.size;
        }
        this.getArticleList();
      },
      // immediate: true,
    },
  },
  computed: {
    aChangeList: function () {
      let resList = [];
      let list = this.articleList;
      let yearMonList = [
        ...new Set(list.map((v) => formatDate(v.createtime, "yyyy-MM"))),
      ];
      for (let yearMon of yearMonList) {
        let arr = list
          .filter((v) => {
            return formatDate(v.createtime, "yyyy-MM") === yearMon;
          })
          .sort((a, b) => b.createtime - a.createtime);
        resList.push({
          list: arr,
          time: yearMon,
          year: new Date(yearMon).getFullYear(),
          mon: monTextMap[new Date(yearMon).getMonth()],
        });
      }
      resList.sort((a, b) => {
        return new Date(b).getTime() - new Date(a).getTime();
      });
      return resList;
    },
  },
  components: {
    AddLoading: () => import("./AddLoading"),
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.size = this.condition.size || this.size;
      this.getArticleList();
    },
    // 获取日期序数词
    numeralDate(num) {
      try {
        return numeral(+num).format("0o");
      } catch (error) {
        return "";
      }
    },
    // 播放单个
    addToPlayOne(a) {
      Bus.$emit("addToList", [a], true);
    },
    // 添加单个
    addToListOne(a) {
      Bus.$emit("addToList", [a]);
    },
    goArtDetail(aid) {
      this.$router.push({
        path: `/a/${aid}`,
      });
    },
    goAuthorDetail(auid) {
      this.$router.push(`/author/${auid}`);
    },
    async getArticleList() {
      if (this.loadingMoreFlag) {
        return;
      }
      this.loadingMoreFlag = true;
      let condition = this.condition;
      let params = {
        offset: this.offset,
        size: this.size,
        tag: condition.tag || "",
      };
      let res = await getArticleList(params);
      res = res.data;

      setTimeout(() => {
        if (res.code === 0 && Array.isArray(res.data)) {
          if (!res.data.length || res.data.length < this.size) {
            this.noMoreDataFlag = true;
            this.$emit("getNoDataFlag", true);
          }
          this.articleList = [...this.articleList, ...res.data];
        }
        this.loadingMoreFlag = false;
      }, 500);
    },
  },
};
</script>

<style scoped lang="less">
@theme-bg-color: #eef5ff;
@theme-color: #ce240a;

.no-more-data {
  text-align: center;
  padding: 20px;
  color: #999;
}

.article-list-wrap {
  position: relative;
  width: 100%;
  padding: 0 10%;
  font-family: eafont, Hiragino Sans GB, Hiragino Sans GB W3, Microsoft YaHei,
    WenQuanYi Micro Hei, sans-serif;

  .article-detail {
    z-index: 1;
    position: relative;
    padding: 40px 50px;
    width: 100%;
    // display: flex;
    // text-align: right;
    img {
      width: 45px;
      height: 45px;
      cursor: pointer;
    }
    .year-mon {
      color: #6e7ab5;
      font-weight: 400;
      font-size: 18px;
      margin: 30px 0 10px;
      list-style: none;
      position: relative;

      &::before {
        content: "";
        width: 12px;
        height: 12px;
        display: inline-block;
        background-color: #dce8ec;
        border: 3px solid #afcfff;
        margin-right: 22px;
        border-radius: 50%;
        box-sizing: border-box;
      }
    }
    .mon-list {
      padding-left: 30px;
      border-left: 1px solid #f3fafd;
      margin-left: 6px;
      li {
        padding: 25px 0;
        border-bottom: 1px solid #f3fafd;
        display: flex;
        justify-content: space-between;
        &:hover {
          .control {
            opacity: 1;
            pointer-events: auto;
          }
        }
        .info {
          padding: 0 0 0 60px;
          position: relative;
          flex: 2;
          display: flex;
          flex-flow: column;
          justify-content: space-around;
          img {
            position: absolute;
            left: 0;
            border-radius: 4px;
          }

          .author-and-count {
            color: #a1a0d6;
            font-size: 13px;
            letter-spacing: 0;
            .author {
              display: inline-block;
              font-size: 15px;
              margin: 0 20px 0 0;
              padding: 0 6px 0 0;
              cursor: pointer;
              &:hover {
                color: #8a88ef;
              }
            }
            .count {
              color: #999;
              font-size: 14px;
              > span {
                margin: 0 0 0 4px;
              }
            }
          }
          .title {
            width: max-content;
            padding: 0 10px 5px 0;
            font-weight: 400;
            color: #5b6773;
            cursor: pointer;
            font-size: 16px;
            display: inline-block;
            &:hover {
              color: @theme-color;
            }
          }
        }
        .control {
          opacity: 0;
          pointer-events: none;
          width: 200px;
          display: flex;
          align-items: center;
          color: #999;
          justify-content: center;

          .icon {
            padding: 4px;
            margin: 0 8px;
            cursor: pointer;
            &:hover {
              color: @theme-color;
            }
          }
          .add {
            font-weight: bold;
          }
        }
        .date {
          color: #909090;
          font-size: 13px;
        }
      }
    }
  }
}
</style>
