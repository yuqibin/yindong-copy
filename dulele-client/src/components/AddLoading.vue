<template>
  <div class="add-loading-wrap">
    <span
      v-for="c in circleCount"
      :style="getStyle(c)"
      :key="c"
    ></span>
  </div>
</template>

<script>
import { getRandomColor } from "@/common/utils/utils";
export default {
  name: "add-loading",
  data() {
    return {
      circleCount: 5,
    };
  },
  components: {},
  methods: {
    getStyle(c) {
      return `background:${getRandomColor()}; animation-delay: ${
        (c - 1) * 0.08
      }s;`;
    },
  },
};
</script>

<style scoped lang="less">
.add-loading-wrap {
  width: 100%;
  height: 30px;
  display: flex;
  margin: 8px 0 20px 0;
  align-items: center;
  justify-content: center;
  > span {
    margin: 0 6px;
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    animation: fadescale 0.8s linear infinite alternate;
  }
}
@keyframes fadescale {
  0% {
    opacity: 1;
  }
  25% {
    opacity: 0.5;
    transform: scale(1.5);
  }

  75% {
    opacity: 0.5;
    transform: scale(1.5);
  }

  100% {
    opacity: 1;
  }
}
</style>
