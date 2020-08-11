<template>
  <div class="title-wrap">
    <span class="name">
      {{name}}
    </span>
    <span class="time">
      {{time}}
    </span>
  </div>
</template>

<script>
import { formatDate } from "@/common/utils/utils";
export default {
  name: "title-c",
  data() {
    return {
      time: ""
    };
  },
  props: ["name"],
  components: {},
  created() {
    this.init();
  },
  methods: {
    init() {
      this.refashTime();
    },
    refashTime() {
      setInterval(() => {
        this.time = formatDate(Date.now(), "hh:mm");
      }, 1000);
    }
  }
};
</script>

<style  lang="less">
.title-wrap {
  padding: 20px 20px;
  margin: 0 0 20px 0;
  display: flex;
  justify-content: space-between;
  box-shadow: 0px 0px 10px #d8d1d1;
  span {
    font-size: 24px;
    padding: 6px 16px;
    line-height: 24px;
    // margin: 60px 0 0 0;
    word-break: keep-all;
    color: #fff;
    border-radius: 4px;
    // background: #8d69e2;
  }
  .time {
    background: none;
    font-size: 18px;
    color: #4273fe;
    font-weight: 400;
    letter-spacing: 2px;
  }
}
</style>
