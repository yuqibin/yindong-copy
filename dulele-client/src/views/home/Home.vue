<template>
  <div
    class="home-wrap scroll-wrap"
    @scroll="scrollHandle"
  >
    <div class="container clb">
      <!-- 排行榜轮播 -->
      <div class="rotation-wrap fl">
        <div class="rotation-title redupaihang"><span class="icon iconfont iconhuangguan"></span>本周热度排行</div>
        <div class="rotation">
          <Rotation :rotation-list="weekHots"></Rotation>
        </div>
      </div>
      <!-- 作者榜 -->
      <div class="author-hot-wrap fl clb">
        <div class="hot-title redupaihang"><span class="icon iconfont iconhuangguan"></span>作者榜</div>
        <ul class="author-ul">
          <li
            class="author"
            v-for="author  in authorList"
            :key="author.id"
          >
            <div class="img-box">
              <img
                :src="author.uicon"
                @click="goAuthorInfo(author.authorid)"
                alt=""
              >
            </div>
            <span
              class="name ell"
              @click="goAuthorInfo(author.authorid)"
            >{{author.realname}}</span>
          </li>
        </ul>
      </div>
      <!-- 无限滚动 -->
      <div class="all-a-list fl">
        <ArticleList
          @getNoDataFlag="getNoDataFlag"
          :condition="aListCondition"
        ></ArticleList>
      </div>
      <!-- 备案 -->
      <div class="beian fl">
        <a
          href="http://www.beian.miit.gov.cn/"
          target="_blank"
        >皖ICP备20014430号</a>
      </div>
    </div>
    <!-- 回到顶部 -->
    <el-backtop
      :bottom="80"
      target=".home-wrap"
    ></el-backtop>
  </div>
</template>

<script>
import { getWeekHot, getAuthorList } from "@/api/service";
export default {
  name: "",
  data() {
    return {
      offset: 0,
      weekHots: [], // 周热门
      authorList: [], // 作者列表
      noMoreDataFlag: false, // 数据全部加载完成flag
    };
  },
  components: {
    Rotation: () => import("../../components/Rotation"),
    ArticleList: () => import("../../components/ArticleList"),
  },
  computed: {
    // 文章列表组件参数
    aListCondition: function () {
      return {
        offset: this.offset,
      };
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getWeekHot();
      this.getAuthorList();
    },
    goAuthorInfo(authorid) {
      this.$router.push(`/author/${authorid}`);
    },
    getNoDataFlag(flag) {
      this.noMoreDataFlag = flag;
    },
    scrollHandle(e) {
      if (this.noMoreDataFlag) {
        return;
      }
      let target = e.target || {};
      if (target.scrollHeight === target.clientHeight + target.scrollTop) {
        this.offset++;
      }
    },
    // 作者榜
    async getAuthorList() {
      let authors = await getAuthorList();
      authors = authors.data;
      if (authors.code === 0 && Array.isArray(authors.data)) {
        if (authors.data.length > 8) {
          authors.data.length = 8;
        }
        this.authorList = authors.data || [];
      }
    },
    // 周热门
    async getWeekHot() {
      let res = await getWeekHot();
      res = res.data;
      if (res.code === 0) {
        this.weekHots = (res.data || []).map((v) => {
          return {
            id: v.aid,
            audiourl: v.audiourl,
            content: v.acontent,
            author: v.aauthor,
            readtimes: v.readtimes,
            coverphoto: v.coverphoto,
            title: v.atitle,
            tag: v.tag,
          };
        });
      }
    },
  },
};
</script>

<style  lang="less">
.gradual-change-y (@top, @bottom) {
  background: linear-gradient(@top, @bottom);
}

.home-wrap {
  // padding: 0 0 60px 0;
  .all-a-list {
    min-height: 600px;

    width: 100%;
  }
  .beian {
    width: 100%;
    text-align: center;
    font-size: 13px;
    color: #666;
    margin: 60px 0 16px 0;
  }
}
.rotation-wrap {
  width: 60%;
  .rotation-title {
    line-height: 50px;
    .icon {
      margin: 0 8px;
      font-size: 28px;
      color: #efaa53;
    }
  }
  .rotation {
    height: 200px;
  }
}
.author-hot-wrap {
  width: 36%;
  height: 300px;
  margin: 0 0 0 4%;
  .hot-title {
    line-height: 50px;
    .icon {
      margin: 0 8px;
      font-size: 28px;
      color: #efaa53;
    }
  }
  .author-ul {
    width: 100%;
    height: 210px;
    margin: 10px 0;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    justify-content: center;
  }
  .author {
    width: 100px;
    height: 100px;
    margin: 6px 10px 0 0;

    text-align: left;
    cursor: pointer;

    .img-box {
      width: 80%;
      height: 80%;
      border-radius: 4px;
      box-shadow: 0 0 9px rgba(146, 146, 146, 0.2);
      overflow: hidden;
      &:hover {
        img {
          transform: scale(1.1);
        }
      }
      img {
        transition: 0.35s;
        width: 100%;
        height: 100%;
      }
    }
    .name {
      display: block;
      height: 20%;
      font-size: 12px;
      width: max-content;
      &:hover {
        color: var(--themeColor);
      }
    }
  }
}
</style>
