<template>
  <div
    class="rotation-wrap"
    :class="{'curr': mouseFlag}"
    @mouseover="mouseOver"
    @mouseout="mouseOut"
  >
    <div
      class="card"
      :style="getRandomBgColor(index)"
      :class="{'curr': index === curr, 'prev': index === prev,'next': index === next}"
      v-for="(a,index) in rotationList"
      :key="a.id"
    >
      <span class="rank">{{index + 1}}</span>
      <span class="num"> <span class="icon iconfont iconreadtimes"></span>{{a.readtimes}}</span>
      <img
        class="card-img-bg"
        :src="imgBgList[index]"
        alt="x"
      >
      <h2 class="title ell">{{a.title}}</h2>
      <p
        class="text ell3"
        @click="goArtDetail(a.id)"
        v-html="a.content"
      ></p>
      <span
        class="play icon iconfont iconplay"
        @click.stop="play(a)"
      ></span>
    </div>
    <div class="control-wrap">
      <span
        class="prev icon iconfont iconleft2"
        @click="prevAndNextHandle(-1)"
      ></span>
      <span
        class="next icon iconfont iconright2"
        @click="prevAndNextHandle(1)"
      ></span>
    </div>
  </div>
</template>

<script>
import Bus from "@/common/bus/bus";

const colorList = ["#31919a", "#434361", "#8e8e58", "green", "#ccc", "#666"];
const imgBgList = [
  require("./imgs/weekhot1.png"),
  require("./imgs/weekhot2.png"),
  require("./imgs/weekhot3.png"),
  require("./imgs/weekhot4.png"),
  require("./imgs/weekhot5.png"),
  require("./imgs/weekhot6.png"),
  require("./imgs/weekhot7.png"),
];

export default {
  name: "rotation",
  data() {
    return {
      imgBgList,
      curr: 0,
      timer: null,
      mouseFlag: false,
    };
  },
  props: {
    /**
     * list对象格式说明：imgSrc/audio
     */
    rotationList: {
      required: true,
      type: Array,
    },
  },
  computed: {
    len: function () {
      return this.rotationList.length || 0;
    },
    prev: function () {
      let n = this.curr - 1;
      return n < 0 ? this.len - 1 : n;
    },
    next: function () {
      let n = this.curr + 1;
      return n > this.len - 1 ? 0 : n;
    },
  },
  components: {},
  created() {},
  mounted() {
    this.autoChange();
  },
  methods: {
    goArtDetail(aid) {
      this.$router.push(`/a/${aid}`);
    },
    play(curr) {
      Bus.$emit("addToList", [curr], true);
    },
    mouseOver() {
      this.mouseFlag = 1;
      if (this.timer) {
        window.clearInterval(this.timer);
      }
    },
    mouseOut() {
      this.mouseFlag = 0;
      this.autoChange();
    },
    // 自动转换
    autoChange() {
      this.timer = setInterval(() => {
        this.prevAndNextHandle(1);
      }, 5000);
    },
    getRandomBgColor(index) {
      return `background: ${colorList[index]};`;
    },
    // 前后
    prevAndNextHandle(flag) {
      if (flag > 0) {
        this.curr += flag;
        this.curr = this.curr > this.len - 1 ? 0 : this.curr;
        return;
      }
      this.curr--;
      this.curr = this.curr < 0 ? this.len - 1 : this.curr;
    },
  },
};
</script>

<style scoped lang="less">
@theme-bg-color: #eef5ff;
@theme-color: #ce240a;
.rotation-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  &.curr {
    .control-wrap {
      span {
        opacity: 1;
        pointer-events: auto;
      }
    }
  }
  .card {
    position: absolute;
    width: 70%;
    height: 100%;
    left: 15%;
    top: 0%;
    border-radius: 8px;
    transform: scale(0.6);
    text-align: center;
    transition: all 0.5s;
    z-index: -1;
    opacity: 0;
    overflow: hidden;
    color: #fff;

    &::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      left: 0;
      top: 0;
      z-index: 1;
      pointer-events: none;
    }
    .rank {
      position: absolute;
      left: 16px;
      top: 6px;
      font-size: 20px;
    }
    .num {
      position: absolute;
      right: 16px;
      top: 6px;
      font-size: 12px;
      vertical-align: middle;
      .icon {
        margin: 0 4px;
        vertical-align: middle;
      }
    }
    .text {
      cursor: pointer;
      overflow: hidden;
      margin: 8px 40px;
      font-size: 14px !important;
    }
    .title {
      font-size: 20px;
      padding: 30px 24px 10px 24px;
      font-family: TChinese, SimSun, FangSong, STSong, STZhongsong, LiSu, KaiTi,
        "Microsoft YaHei";
    }
    .play {
      font-size: 20px;
      position: absolute;
      bottom: 16px;
      right: 24px;
      display: inline-block;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      line-height: 30px;
      text-align: center;
      background: @theme-color;
      color: #fff;
      cursor: pointer;
    }
    .card-img-bg {
      // width: 100%;
      z-index: -1;
      height: 100%;
      left: 50%;
      position: absolute;
      pointer-events: none;
      transform: translateX(-50%) scale(1.2);
    }
    &.curr {
      &::after {
        opacity: 0;
      }
      opacity: 1;
      transform: scale(1);
      z-index: 3;
      animation: goCurr 1s 1 forwards;
    }
    &.prev {
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
      opacity: 1;
      z-index: 1;
      text-align: left;
      transform: scale(0.7) translateX(-50%);
      animation: goPrev 1s 1 forwards;
    }
    &.next {
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
      opacity: 1;
      z-index: 2;
      transform: scale(0.7) translateX(50%);
      text-align: right;
    }
  }
  .control-wrap {
    width: 0;
    height: 0;
    span {
      z-index: 9;
      padding: 5% 4%;
      position: absolute;
      display: inline-block;
      font-size: 30px;
      color: rgba(255, 255, 255, 0.15);
      top: 50%;
      transform: translate(0, -50%);
      opacity: 0;
      pointer-events: none;
      transition: 0.25s;
      cursor: pointer;
      &.next {
        right: 1%;
      }
      &.prev {
        left: 1%;
      }
    }
  }
}

@keyframes goCurr {
  70% {
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
  }
  100% {
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
    transform: scale(1) !important;
  }
}

@keyframes goPrev {
  100% {
    transform: scale(0.7) translateX(-50%) !important;
  }
}

@keyframes next {
  100% {
    transform: scale(0.7) translateX(50%) !important;
  }
}
</style>
