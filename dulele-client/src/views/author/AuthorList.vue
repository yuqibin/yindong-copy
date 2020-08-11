<template>
  <div class="author-list-wrap">
    <div class="container">
      <SubTitle
        :title-name="'可爱的作者们~'"
        :icon-name="'iconxbq19'"
        :class-name="'keaidezuozhemen'"
      ></SubTitle>
      <ul class="author-show">
        <li
          v-for="a in authorList"
          :key="a.id"
        >
          <div
            class="img-box"
            @click="goAuthorDetail(a)"
          >
            <img
              :src="a.uicon"
              alt=""
            >
          </div>
          <span
            class="name ell"
            @click="goAuthorDetail(a)"
            :title="a.realname"
          > <span>{{a.realname}}</span> </span>
          <span
            class="count ell"
            :title="a.readcount"
          >{{a.readcount}}</span>
        </li>
      </ul>
    </div>
    <!-- 回顶部 -->
    <el-backtop
      :bottom="80"
      target=".author-list-wrap"
    ></el-backtop>
  </div>
</template>

<script>
import { getAuthorList } from "@/api/service";
export default {
  name: "author-list",
  data() {
    return {
      authorList: [],
    };
  },
  components: {
    SubTitle: () => import("../../components/SubTitle"),
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getAuthorList();
    },
    // 前往作者详情页
    goAuthorDetail(a) {
      this.$router.push(`/author/${a.authorid}`);
    },
    // 获取作者列表
    async getAuthorList() {
      let res = await getAuthorList();
      res = res.data;
      if (res.code === 0 && Array.isArray(res.data)) {
        this.authorList = [...res.data];
      }
    },
  },
};
</script>

<style lang="less" scoped>
.author-list-wrap {
  position: relative;
}
.author-show {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  li {
    width: 160px;
    height: 170px;
    padding: 0 10px;
    margin: 0 0 40px 0;
    position: relative;
    .img-box {
      cursor: pointer;
      width: 140px;
      height: 140px;
      border-radius: 4px;
      transition: 0.25s;
      position: relative;
      overflow: hidden;
      &:hover {
        img {
          transform: scale(1.1);
        }
      }
      img {
        transition: 0.25s;
        width: 100%;
        height: 100%;
      }
    }

    span {
      width: 50%;
      height: 25px;
      line-height: 32px;
      display: inline-block;
    }
    .name {
      cursor: pointer;
      font-size: 14px;
      color: #333;
      > span {
        width: max-content;
        &:hover {
          color: #000;
        }
      }
    }
    .count {
      text-align: right;
      font-size: 12px;
      color: #999;
    }
  }
}
</style>
