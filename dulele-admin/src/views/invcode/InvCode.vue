<template>
  <div class="inv-code-wrap scroll-wrap">
    <el-button
      type="primary"
      @click="addNewCode"
    >新增一条邀请码</el-button>
    <ul class="code-list">
      <li
        v-for="(code,index) in invCodeList"
        :key="code.invcode"
      >
        <span>{{index+1}}</span>
        {{code.invcode}}</li>
    </ul>
  </div>
</template>

<script>
import { getInvCodeList, addNewCode } from "@/api/service";
export default {
  name: "inv-code",
  data() {
    return {
      invCodeList: [],
    };
  },
  components: {},
  created() {
    this.getInvCodeList();
  },
  methods: {
    async addNewCode() {
      let res = await addNewCode();
      res = res.data;
      if (res.code === 0) {
        this.invCodeList.push({ invcode: res.data });
      }
    },
    // 邀请码  超管权限-没错就是我 嘻嘻~
    async getInvCodeList() {
      let res = await getInvCodeList();
      res = res.data;
      if (res.code === 0) {
        this.invCodeList = res.data || [];
      }
    },
  },
};
</script>

<style scoped lang="less">
.inv-code-wrap {
  width: calc(100vw - 200px);
  height: 100vh;
  padding: 40px 40px 40px 40px;
  .code-list {
    display: block;
    margin: 20px 0 0 0;
    li {
      line-height: 30px;
      margin: 0 0 8px 0;
    }
    span {
      margin: 0 30px 0 0;
    }
  }
}
</style>
