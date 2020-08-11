<template>
  <span
    class="copy icon iconfont iconcopy"
    @click="copyText"
  >
    <span
      class="tips"
      :class="{'curr':copySuccessFlag}"
    >写轮眼复制成功~!</span>
    <textarea
      ref="copy"
      class="hide-text"
    ></textarea>
  </span>
</template>

<script>
export default {
  name: "copy-text",
  data() {
    return {
      copySuccessFlag: false,
    };
  },
  props: {
    cText: {
      default: "",
    },
  },
  methods: {
    copyText() {
      let copyDom = this.$refs.copy;
      copyDom.innerText =
        this.cText + `\n -- 来自【音咚-http://www.yindong.club】`;
      copyDom.select();
      if (document.execCommand("copy")) {
        this.copySuccessFlag = 1;
        setTimeout(() => {
          this.copySuccessFlag = 0;
        }, 1000);
      }
    },
  },
};
</script>

<style scoped lang="less">
.copy {
  display: inline-block;
  position: relative;
  font-size: 22px;
  color: #666;
  cursor: pointer;
  .tips {
    position: absolute;
    left: 0;
    top: -10px;
    width: 200px;
    font-size: 14px;
    color: #fff;
    word-break: keep-all;
    transition: 1s;
    opacity: 0;
    pointer-events: none;
    &.curr {
      animation: cpoySuccHide 1s 1;
    }
  }
  .hide-text {
    position: absolute;
    left: 0;
    top: 0;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
    border: none;
  }
  &:hover {
    color: #333;
  }
}
</style>
