<template>
  <h2 class="sub-title-wrap">
    <svg
      class="icon"
      aria-hidden="true"
    >
      <use :xlink:href="'#'+iconName"></use>
    </svg>
    <span :class="className">{{titleName || '-'}}</span>
  </h2>
</template>

<script>
export default {
  name: "sub-title",
  data() {
    return {};
  },
  props: {
    titleName: {
      default: "",
    },
    iconName: {
      default: "",
    },
    className: {
      default: "",
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
h2 {
  display: flex;
  align-items: center;
  font-weight: 400;
  align-content: center;
  font-size: 20px;
  margin: 16px 0 40px 0;
  span {
    margin: 0 0 0 6px;
  }
  .icon {
    width: 40px;
    height: 40px;
  }
}
</style>
