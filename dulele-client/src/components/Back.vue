<template>
  <div
    class="back-btn"
    @click="back"
  >
    <span class="icon iconfont el-icon-back"></span>
  </div>
</template>

<script>
export default {
  name: "back",
  data() {
    return {};
  },
  components: {},
  methods: {
    back() {
      this.$router.back();
    },
  },
};
</script>

<style scoped lang="less">
.back-btn {
  z-index: 666;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  text-align: center;
  position: fixed;
  margin: 20px;
  text-align: center;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  // font-size: 22px;
  background-color: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  z-index: 5;
  &:hover {
    background: #f2f6fc;
  }
  > span {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    color: #409eff;
    transform: translateY(1px);
  }
  &:hover {
    color: #333;
  }
}
</style>
