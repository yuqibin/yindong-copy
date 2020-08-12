<template>
  <div class="header-wrap">
    <!-- 作者信息 -->
    <div class="author">
      <div class="portrait flex-xc flex-yc">
        <img
          class="head-pic"
          :src="userInfo.icon"
          alt=""
        >
        <div
          class="change-head"
          @click="uploadNewHead"
        >
          <el-upload
            ref="headUploader"
            class="hided-upload"
            :limit="1"
            :on-success="handleAvatarSuccess"
            :on-error="handleError"
            :before-upload="beforeAvatarUpload"
            :action="qiniuConf.upload_qiniu_url"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :data="qiniuData"
          >
            <el-button
              size="small"
              type="primary"
            >上传头像</el-button>
          </el-upload>
        </div>
      </div>
      <div class="other">
        <h1 class="name">{{userInfo.name || ''}}</h1>
        <span class="autograph ell">{{userInfo.autograph || ''}}</span>
      </div>
    </div>
    <!-- 菜单 -->
    <div class="menu-list">
      <ul>
        <li
          class="all"
          :class="{'curr': !currMenu}"
          @click="goIndex()"
        >全部</li>
        <li
          @click="changeMenu(menu)"
          :class="{'curr': currMenu === menu.name}"
          v-for="menu in menuList"
          :key="menu.name"
        >
          {{menu.describe}}
        </li>
        <li
          v-if="superAdmin"
          :class="{'curr': currMenu === 'invcode'}"
          @click="goInvCode"
        >
          邀请码
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import {
  getUserInfo,
  getMenuList,
  getQiniuToken,
  updateHeadPic,
} from "@/api/service";
import Bus from "../../common/bus/bus";
import { isSuperAdmin } from "@/api/service";
import superAdmin from "../../router/superAdmin";
export default {
  name: "header-c",
  data() {
    return {
      superAdmin: null,
      userInfo: {},
      menuList: [],
      currMenu: "",
      form: {
        imgUrl: "",
      },
      // 七牛conf
      qiniuConf: {
        // 七牛云上传储存区域的上传域名（华东、华北、华南、北美、东南亚）
        upload_qiniu_url: "http://upload-z2.qiniup.com",
        // 七牛云返回储存图片的子域名
        upload_qiniu_addr: process.env.VUE_APP_upload_qiniu_addr,
      },
      // 上传附带参数
      qiniuData: {
        key: "", // 文件名
        token: "", // 鉴权
      },
    };
  },
  wathc: {
    "$route.path": function () {
      let path = this.$route.path;
      this.currMenu = path;
    },
  },
  components: {},
  created() {
    this.init();
  },
  methods: {
    init() {
      let that = this;
      this.currMenu = this.$route.path.replace("/", "");
      that.getUserInfo();
      that.getMenuList();
      that.getQiniuToken();
      this.isSuperAdmin();
    },
    goIndex() {
      this.$router.push("/index");
    },
    goInvCode() {
      this.currMenu = "invcode";
      this.$router.push("/invcode");
    },
    // 验证超管权限-没错就是我 嘻嘻~
    async isSuperAdmin() {
      let res = await isSuperAdmin();
      res = res.data;
      if (res.code === 0) {
        this.superAdmin = true;
        this.$router.addRoutes(superAdmin);
      }
    },
    uploadNewHead() {
      this.$refs.headUploader.submit();
    },
    // 点击菜单
    changeMenu(menu) {
      this.currMenu = menu ? menu.name : "";
      Bus.$emit(
        "changeMenu",
        menu || {
          name: "",
          describe: "全部",
        }
      );
    },
    // 获取用户信息
    getUserInfo() {
      let that = this;
      getUserInfo().then((res) => {
        res = res.data || {};
        if (res.code === 0) {
          that.userInfo = res.data;
        } else {
          that.$message.error("未登录或登录过期~");
          that.$router.push("/login");
        }
      });
    },
    // 获取菜单
    getMenuList() {
      let that = this;
      getMenuList().then((res) => {
        res = res.data || {};
        if (res.code === 0) {
          that.menuList = res.data;
          sessionStorage.setItem("menuList", JSON.stringify(res.data || []));
          that.changeMenu();
        } else {
          that.$message.error("未知错误~");
        }
      });
    },
    // 获取鉴权
    async getQiniuToken() {
      let res = await getQiniuToken();
      res = res.data;
      if (res.code === 0) {
        this.qiniuData.token = res.data.qiniutoken;
      }
    },
    // 移除文件回调
    handleRemove(file, fileList) {
      this.form.imgUrl = "";
      this.fileList = [];
    },
    // 查看已上传完成文件的回调
    handlePictureCardPreview(file) {
      this.form.imgUrl = file.url;
      this.bigPicFlag = true;
    },
    // 上传前检查回调
    beforeAvatarUpload(file) {
      let arr = ["image/jpeg", "image/png"];
      const isJPG = arr.indexOf(file.type) >= 0;
      const isLt200K = file.size / 1024 / 200 < 1;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG PNG 格式!");
      }
      if (!isLt200K) {
        this.$message.error("上传图片大小不能超过 200KB!");
      }
      let fnArr = file.name.split(".");
      this.qiniuData.key = `head_pic/dulele_${Date.now()}.${
        fnArr[fnArr.length - 1]
      }`;
      return isJPG && isLt200K;
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      this.form.imgUrl = `http://${this.qiniuConf.upload_qiniu_addr}/${res.key}`;
      this.saveImgUrlHandle();
    },
    // 上传七牛成功  继续传到服务器存储
    async saveImgUrlHandle() {
      let res = await updateHeadPic({ imgurl: this.form.imgUrl });
      res = res.data;
      if (res.code === 0) {
        this.userInfo.icon = this.form.imgUrl;
        this.$message.success("更新成功哦~");
      }
    },
    // 上传失败报错
    handleError(res) {
      this.$message({
        message: "上传失败",
        duration: 2000,
        type: "warning",
      });
    },
  },
};
</script>

<style lang="less" scoped>
@theme-color: #8d69e2;
// 渐变色，只支持两种颜色
.gradual-change-x (@left, @right) {
  background: linear-gradient(to right, @left, @right);
}

.gradual-change-y (@top, @bottom) {
  background: linear-gradient(@top, @bottom);
}

.hided-upload {
  // display: none;
  button {
    background: none;
    border: none;
    width: 100%;
    padding: 0;
  }
}

.header-wrap {
  z-index: 1;
  position: absolute;
  width: 200px;
  height: 100%;
  left: 0;
  top: 0;
  color: #fff;
  background: rgba(0, 0, 0, 0.8);
  .gradual-change-y(rgba(120, 181, 249, 1), rgba(120, 206, 232, 0.85));
  display: flex;
  flex-direction: column;
  justify-content: center;
  .author {
    .portrait {
      position: relative;
      width: 60px;
      height: 60px;
      border-radius: 4px;
      background: #6377e4;
      display: flex;
      margin: 60px auto 4px auto;
      overflow: hidden;
      &:hover {
        .change-head {
          display: block;
        }
      }
      .head-pic {
        width: 100%;
        border-radius: 4px;
      }
      .change-head {
        display: none;
        position: absolute;
        left: 0;
        top: 50%;
        width: 100%;
        height: 50%;
        line-height: 30px;
        text-align: center;
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        font-size: 12px;
        cursor: pointer;
      }
      .icon {
        width: 75%;
        height: 75%;
      }
    }
    .other {
      height: 60px;
      > span,
      h1 {
        display: block;
        text-align: center;
      }
      .name {
        font-size: 20px;
        padding: 6px 0 0 0;
        word-break: keep-all;
      }
      .autograph {
        padding: 2px 4px 0 4px;
        font-size: 12px;
        word-break: keep-all;
      }
    }
  }
  .menu-list {
    height: 100%;
    padding: 16px 0 0 30px;
    margin: 16px 0 0 0;
    border-top: 1px dashed rgba(255, 255, 255, 0.25);
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    li {
      cursor: pointer;
      line-height: 36px;
      text-align: center;
      margin: 16px 0 0 0;
      border-radius: 18px 0 0 18px;
      transition: 0.15s;

      // background: rgba(255, 255, 255, 0.1);
      &.curr {
        // .gradual-change-x(rgba(75, 247, 255, 0.7), rgba(88, 158, 230, 0.75));
        background: #f2f6fb;
        color: #459eff;
      }
      &:hover {
        // .gradual-change-x(rgba(75, 247, 255, 0.5), rgba(88, 158, 230, 0.5));
      }
      &:active {
        // .gradual-change-x(rgba(75, 247, 255, 0.7), rgba(88, 158, 230, 0.7));
      }
    }
  }
}
</style>
