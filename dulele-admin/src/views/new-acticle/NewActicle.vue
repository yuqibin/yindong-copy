<template>
  <div class="new-acticle-wrap">
    <Title :name="'😀😃😄😁😆😅😂🤣☺️😊😇🙂🙃😉😌😍🥰😘😗😙😚😋😛😝😜🤪🤨🧐🤓😎🤩🥳'"></Title>
    <div class="back-and-release">
      <span
        @click="routerBack"
        class="back icon iconfont icon-fanhui"
      > <span style="font-size: 14px; margin: 0 0 0 6px;">Back</span> </span>
      <el-popconfirm
        class="release"
        confirmButtonText='确定'
        cancelButtonText='我再改改'
        icon="el-icon-loading"
        @onConfirm="formSubmit"
        iconColor="blue"
        title="确定发布吗？"
      >

        <el-button
          slot="reference"
          class="submiting"
          :class="{'curr': submiting}"
        >
          <span class="long-wait">新增内容或修改内容需要转成音频并存储，请耐心等候哦~</span>
          <span
            class="icon iconfont el-icon-loading"
            v-show="submiting"
          ></span> 发布
        </el-button>
      </el-popconfirm>
    </div>
    <!-- 编辑主体 -->
    <div class="edit-body">
      <!-- tag -->
      <div class="item tag-pick">
        <span class="name">分类：</span>
        <el-select
          v-model="form.tag"
          placeholder="请选择"
        >
          <el-option
            v-for="tag in tagList"
            :key="tag.name"
            :label="tag.describe"
            :value="tag.name"
          >
          </el-option>
        </el-select>
      </div>
      <!-- title -->
      <div class="item title">
        <span class="name">标题：</span>
        <el-input
          type="text"
          placeholder="请输入文章标题"
          clearable
          v-model="form.title"
          maxlength="30"
          show-word-limit
        >
        </el-input>
      </div>
      <!-- 配图 -->
      <div class="item pic">
        <span class="name">封面：</span>
        <el-upload
          :limit="1"
          :on-success="handleAvatarSuccess"
          :on-error="handleError"
          :before-upload="beforeAvatarUpload"
          :action="qiniuConf.upload_qiniu_url"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :data="qiniuData"
          :file-list="fileList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="bigPicFlag">
          <img
            width="100%"
            :src="form.imgUrl"
            alt=""
          >
        </el-dialog>
      </div>
      <!-- content -->
      <div
        class="item markdown-wrap"
        :class="{'curr':fullScreenFlag}"
      >
        <span class="name">内容：</span>
        <div class="markdown-body">
          <!-- 语法提示，全屏按钮 -->
          <div class="tips">
            <el-tooltip
              class="item"
              effect="dark"
              content="点击查看Markdown语法"
              placement="left"
            >
              <span
                class="qus icon iconfont icon-yiwen"
                @click="studyMarkDownLan"
              ></span>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :content="fullScreenFlag ? '退出全屏' : '全屏编辑'"
              placement="left"
            >
              <span
                class="qp icon iconfont"
                :class="[ fullScreenFlag ? 'icon-tuichuquanping' : 'icon-quanping1']"
                @click="allScreen"
              ></span>
            </el-tooltip>
          </div>
          <el-input
            type="textarea"
            :placeholder="toAdminTips"
            v-model="form.userInput"
            :maxlength="contentMax"
            clearable
            show-word-limit
          >
          </el-input>
          <div
            id="nice"
            class="preview scroll-wrap"
            ref="previewNode"
            v-html="markdowner.makeHtml(form.userInput)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "../../components/title/Title";
import {
  getQiniuToken,
  addArticle,
  getArticleDetail,
  updateArticle,
} from "@/api/service";

const showdown = require("showdown");
const keys = Object.keys(showdown.getDefaultOptions());
showdown.setFlavor("github");
const markdowner = new showdown.Converter();
for (let key of keys) {
  markdowner.setOption(key, true);
}

const formModel = {
  userInput: "",
  title: "",
  tag: "",
  imgUrl: "",
};

const keyMap = {
  title: "title",
  userInput: "content",
  tag: "tag",
  imgUrl: "coverphoto",
};
export default {
  name: "new-acticle",
  data() {
    return {
      editBeforeForm: {},
      editFlag: false,
      fileList: [],
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
      // Markdown 实例对象
      markdowner: markdowner,
      bigPicFlag: false,
      tagList: [],
      contentMax: 1500,
      // 表单
      form: {},
      submiting: false,
      fullScreenFlag: false,
      toAdminTips: `Markdown编辑器~语法不会请点击左侧问号链接然后选择主题-蔷薇紫~ \n\n请不要使用敏感词语句等内容 \n\n使用逗号句号之类的可以让语音断句读出来更好听 \n\n建议插入图片使用线上图片 \n\n可以转载或copy，请注明出处谢谢~`,
    };
  },
  components: {
    Title,
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.initForm();
      this.tagList = JSON.parse(sessionStorage.getItem("menuList"));
      this.getQiniuToken();
      this.editEcho();
    },
    // 编辑 数据回显
    async editEcho() {
      let id = this.$route.query.id;
      if (id) {
        this.editFlag = true;
        let form = this.form;
        let detail = await this.getArticleDetail(+id);
        this.editBeforeForm = detail;
        form.userInput = detail.content || "";
        form.title = detail.title;
        form.tag = detail.tag;
        form.imgUrl = detail.coverphoto;
        detail.coverphoto &&
          this.fileList.push({
            url: detail.coverphoto,
          });
      }
    },
    // 获取文章信息
    getArticleDetail(id) {
      let that = this;
      return getArticleDetail({ id }).then((res) => {
        res = res.data;
        if (res.code === 0) {
          return res.data || {};
        } else {
          that.$message.error("服务器异常~请稍后重试");
          return "";
        }
      });
    },
    // 初始化表单
    initForm() {
      this.form = JSON.parse(JSON.stringify(formModel));
    },
    // 表单提交  参数验证
    formParamsCheck() {
      let form = this.form;
      let map = {
        userInput: "请输入文章内容~",
        title: "请输入文章标题",
        tag: "请选择文章分类",
        imgUrl: "请上传封面",
      };
      for (let key of Object.keys(map)) {
        if (!form[key]) {
          this.$message.error(map[key]);
          return false;
        }
      }
      return true;
    },
    // 表单提交
    formSubmit() {
      let that = this;
      if (that.submiting) {
        return;
      }
      if (!that.formParamsCheck()) {
        return;
      }
      let form = that.form;
      let params = {};
      if (!this.editFlag) {
        // 新增
        params = {
          title: form.title,
          content: form.userInput,
          tag: form.tag,
          coverphoto: form.imgUrl,
          audiotext: that.$refs.previewNode.textContent,
        };
      } else {
        // 修改
        params.id = +this.$route.query.id;
        let beForm = that.editBeforeForm;
        for (let key of Object.keys(keyMap)) {
          if (form[key] !== beForm[key]) {
            params[keyMap[key]] = form[key];
          }
        }
        if (form.content !== beForm.content) {
          params.audiotext = that.$refs.previewNode.textContent;
        }
      }
      that.submiting = true;
      that.newEditHandle(params);
    },
    // 编辑 或者 新增的请求
    newEditHandle(params) {
      let that = this;
      let handle = this.editFlag ? updateArticle : addArticle;
      handle(params)
        .then((res) => {
          res = res.data || {};
          if (res.code === 0) {
            that.$message.success("发布成功~ 感谢您的付出，比心💞");
            if (!that.editFlag) {
              that.initForm();
              that.fileList = [];
            }
          } else {
            res.message
              ? that.$message.error(res.message)
              : that.$message("未知错误~");
          }
        })
        .finally(() => {
          that.submiting = false;
        });
    },
    // Markdown教程
    studyMarkDownLan() {
      window.open("https://mdnice.com");
    },
    // 全屏编辑
    allScreen() {
      this.fullScreenFlag = !this.fullScreenFlag;
    },
    // 获取鉴权
    getQiniuToken: function () {
      let that = this;
      getQiniuToken().then((res) => {
        res = res.data || {};
        if (res.code === 0) {
          that.qiniuData.token = res.data.qiniutoken;
        }
      });
    },
    routerBack() {
      this.$router.push("/index");
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
      const isLt2M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 1MB!");
      }
      let fnArr = file.name.split(".");
      this.qiniuData.key = `dulele_${Date.now()}.${fnArr[fnArr.length - 1]}`;
      return isJPG && isLt2M;
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      this.form.imgUrl = `http://${this.qiniuConf.upload_qiniu_addr}/${res.key}`;
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

<style  lang="less">
@sblue: #4273fe;
.new-acticle-wrap {
  // background: #f2f6fb;
}
.back-and-release {
  padding: 0 40px;
  margin: 20px 0;
  // display: flex;
  // justify-content: space-between;
  .release {
    float: right;
    cursor: pointer;
    color: #525151;
    // border: 1px solid #8a8a8a6e; 4273fe
    font-size: 14px;
    display: block;
    .submiting {
      .icon {
        position: absolute;
        left: 10px;
        top: 7px;
      }
      .long-wait {
        position: absolute;
        color: #cc6969;
        font-size: 12px;
        left: 0;
        transition: 0.25s;
        width: 0;
        overflow: hidden;
        // transform: translateX(-105%);
      }
      &.curr {
        .long-wait {
          width: auto;
          transform: translateX(-105%);
        }
      }
    }
    button {
      position: relative;
      border-radius: 4px;
      padding: 8px 16px;
      border: none;
      background: @sblue;
      color: #fff;
      &.curr {
        padding: 8px 16px 8px 28px;
      }
      &:hover {
        opacity: 0.9;
      }
    }
  }
  .back {
    padding: 6px 12px;
    // background: #4273fe;
    cursor: pointer;
    color: #525151;
    border: 1px solid #8a8a8a6e;
    border-radius: 2px;
    font-size: 14px;
    &:hover {
      color: #000;
    }
  }
}

.edit-body {
  margin: 20px 40px;
  padding: 10px;
  .item {
    position: relative;
    display: flex;
    align-items: flex-start;
    margin: 8px 0 0 0;
    &:first-child {
      margin: 0;
    }
    .name {
      line-height: 40px;
      word-break: keep-all;
    }
  }
  .markdown-wrap {
    &.curr {
      position: fixed;
      width: 100vw;
      height: 100vh;
      left: 0;
      top: 0;
      margin: 0;
      background: rgba(43, 42, 43, 0.7);
      padding: 20px;
      .markdown-body,
      .el-textarea__inner {
        height: calc(100vh - 45px);
        .tips .qp {
          color: #fff;
        }
      }
    }
    .markdown-body {
      width: 100%;
      display: flex;
      position: relative;
      height: calc(100vh - 450px);
      .tips {
        position: absolute;
        left: -40px;
        top: 50px;
        span {
          height: auto;
          font-size: 20px;
          display: block;
          cursor: pointer;
          transition: 0.25s;
        }
        .qus {
          color: #ff8922;
          &:hover {
            color: #4273fe;
          }
        }
        .qp {
          margin: 12px 0 0 0;
          color: #716767;
          transform: scale(1.2);
          &:hover {
            color: #4273fe;
          }
          // font-size: 24px;
        }
      }
      .preview {
        font-size: 14px;
        margin: 0 0 0 8px;
        padding: 8px 12px;
        width: 50%;
        color: #606266;
        background: #fff;
        border-radius: 4px;
        overflow-y: auto;
      }
    }
  }
}

// ele-ui
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

// ele ui
.el-textarea {
  height: 100%;
  width: 50%;
  .el-textarea__inner {
    height: calc(100vh - 450px);
    font-size: 16px;
    padding: 8px 12px;

    &::placeholder {
      font-size: 14px;
    }
    &:focus {
      border: 1px solid #dcdfe6;
    }
    &:hover {
      border: 1px solid #dcdfe6;
    }
    /* 设置滚动条的样式 */
    &::-webkit-scrollbar {
      position: absolute;
      width: 5px;
      right: -50px;
      border-radius: 5px;
    }

    /* 滚动槽 -- 背景 */
    &::-webkit-scrollbar-track {
      border-radius: 3px;
    }

    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb {
      cursor: pointer;
      width: 4px;
      border-radius: 6px;
      background: #ccc;
    }
  }
}

.el-textarea .el-input__count {
  bottom: 1px;
  right: 1px;
  border-radius: 2px;
  padding: 2px 3px;
}
</style>
