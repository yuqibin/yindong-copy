<template>
  <div class="admin-login-wrap">
    <div class="move-bg" ref="moveImg"></div>
    <!-- 登陆表单 -->
    <div class="form-bg">
      <div class="form">
        <span class="fr icon iconfont icon-guanbi"></span>
        <div class="panfish">
          <img class="normal" :class="{'curr' : logoState === 'normal'}" src="./imgs/normal.png" alt="logo">
          <img class="blindfold" :class="{'curr' : logoState === 'blindfold'}" src="./imgs/blindfold.png" alt="logo">
          <img class="greeting" :class="{'curr' : logoState === 'greeting'}" src="./imgs/greeting.png" alt="logo">
        </div>
        <!-- title -->
        <h1>{{isLogin ? '登录' : '注册'}}</h1>
        <input @blur="logoState = 'normal'" @focus="logoState = 'greeting'" @input="userInputing('username', 0)" class="name" type="text" v-model="username" placeholder="请输入账号...">
        <input @blur="logoState = 'normal'" @focus="logoState = 'blindfold'" @input="userInputing('password', 0)" class="pwd" type="password" v-model="password" @keyup.enter="pwdEnter()" placeholder="请输入密码...">
        <input v-if="!isLogin" @blur="logoState = 'normal'" @focus="logoState = 'greeting'" @input="userInputing('invcode', 0)" type="text" v-model="invcode" placeholder="请输入邀请码...(必填)">
        <input v-if="!isLogin" @blur="logoState = 'normal'" @focus="logoState = 'greeting'" @input="userInputing('realname', 1)" type="text" v-model="realname" placeholder="请输入作者昵称...(必填)">
        <input v-if="!isLogin" @blur="logoState = 'normal'" @focus="logoState = 'greeting'" type="text" @input="userInputing('autograph', 1)" v-model="autograph" placeholder="请输入个性签名...(非必填)">
        <button @click="formSubmit" class="submit-btn">{{isLogin ? '登录' : '注册'}}</button>
        <p class="register-btn"><span @click="isLogin = !isLogin">{{isLogin ? '注册' : '登录'}}</span></p>
      </div>
    </div>
  </div>
</template>

<script>
import { adminLogin, getUserInfo, register } from "@/api/service";
import adminRouts from "../../router/admin";
export default {
  name: "login",
  data () {
    return {
      isLogin: true,
      logoState: "normal",
      username: "",
      password: "",
      invcode: "",
      realname: "",
      autograph: "",
    };
  },
  created () {
    this.init();
  },
  mounted () {
    let that = this;

    window.addEventListener(
      "mousemove",
      (e) => {
        that.bgMove && that.bgMove(e);
      },
      false
    );
  },
  methods: {
    init () {
      this.getUserInfo();
    },
    bgMove (e) {
      let center = [window.innerWidth / 2, window.innerHeight / 2];
      let pickX = (center[0] - e.x) / 40 + "px";
      let pickY = (center[1] - e.y) / 40 + "px";
      if (!this.$refs.moveImg) {
        return;
      }
      this.$refs.moveImg.style.backgroundPosition = `${pickX} ${pickY}`;
    },
    formSubmit () {
      this.isLogin ? this.login() : this.register();
    },
    registerCheck () {
      switch (true) {
        case !this.username || this.username.length > 20:
          this.$message.error("用户名不能为空且不能超过20个字符");
          return false;
        case !this.password || this.password.length > 40:
          this.$message.error("密码不能为空且不能超过40个字符");
          return false;
        case !this.realname || this.realname.length > 10:
          this.$message.error("昵称不能为空且不能超过10个字符");
          return false;
        case this.autograph.length > 255:
          this.$message.error("签名不能超过255个字符");
          return false;
        default:
          break;
      }
      return true;
    },
    async register () {
      if (!this.registerCheck()) {
        return;
      }
      let res = await register({
        username: this.username,
        password: this.password,
        invcode: this.invcode,
        realname: this.realname,
        autograph: this.autograph,
      });
      res = res.data;
      if (res.code === 0) {
        this.isLogin = true;
        this.$message.success(res.message);
      } else {
        this.$message.error(res.message || "");
      }
    },
    // 获取用户信息
    getUserInfo () {
      let that = this;
      getUserInfo().then((res) => {
        res = res.data || {};
        if (res.code === 0) {
          that.sessionHandle();
        }
      });
    },
    goRegister () { },
    pwdEnter () {
      this.login();
    },
    userInputing (key, chaneseFlag) {
      let reg1 = /[^0-9a-zA-Z\u4e00-\u9fa5]/g;
      let reg2 = /[^0-9a-zA-Z]/g;
      this[key] = this[key].replace(chaneseFlag ? reg1 : reg2, "");
    },
    loginCheck () {
      if (!this.username || this.username.length > 20) {
        this.$message.error("用户名不能为空且不能超过20个字符");
        return false;
      }
      if (!this.password || this.password.length > 40) {
        this.$message.error("密码不能为空且不能超过40个字符");
        return false;
      }
      return true;
    },
    // 登录
    async login () {
      let that = this;
      if (!that.loginCheck()) {
        return;
      }
      let res = await adminLogin({
        username: this.username,
        password: this.password,
      });
      if (res.data && res.data.code === 0) {
        that.sessionHandle();
      } else {
        that.$message.error("账户或密码错误~");
      }
    },
    // 登陆成功
    sessionHandle () {
      let that = this;
      that.$router.addRoutes(adminRouts);
      that.$router.push("/index");
    },
  },
};
</script>

<style scoped lang="less">
.br2 () {
  border-radius: 2px;
}
@import url('../../assets/css/adaptation.less');
.canvas-night {
  width: 100vw;
  height: 100vh;
  z-index: -1;
  position: fixed;
  pointer-events: none;

  left: 0;
  top: 0;
}
.admin-login-wrap {
  margin: 0;
  padding: 0;
  background-color: rgba(0, 0, 0, 0);
  width: 100% !important;
}
.form-bg {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 500;
}

.move-bg {
  width: 100vw;
  height: 100vh;
  background-image: url('./imgs/bg-img.jpeg');
  background-size: cover;
  position: fixed;
  top: 0;
  background-repeat: no-repeat;
  position: absolute;
  transform: scale(1.05);
  z-index: -1;
  background-color: #191919;
  pointer-events: none;
}

.form {
  padding: 24px;
  position: relative;
  width: 320px;
  background: #fff;
  .br2();
  box-sizing: border-box;
  font-size: 14px;
  .panfish {
    .curr {
      opacity: 1;
    }
    .blindfold {
      width: 120 * 0.86px;
      transform: translate(-50%, -77%);
    }
    .normal {
      transform: translate(-50%, -83%);
    }
    .greeting {
      transform: translate(-50%, -77%);
    }
    img {
      width: 120px;
      opacity: 0;
      position: absolute;
      top: 0;
      left: 50%;
    }
  }
  h1 {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 24px 0;
  }
  .icon {
    cursor: pointer;
    opacity: 0.4;
    font-weight: bold;
    transition: 0.15s;
    &:hover {
      opacity: 1;
    }
  }
  input {
    width: 100%;
    font-size: 14px;
    padding: 8px;
    border: 1px solid #e9e9e9;
    .br2();
    margin: 0 0 10px 0;
    color: #000;
    font-weight: 400;
    text-indent: 4px;
    &:focus {
      outline: 1px solid #007fff;
    }
    &::placeholder {
      color: #999;
    }
  }
  .submit-btn {
    width: 100%;
    height: 40px;
    padding: 6px;
    color: #fff;
    border: none;
    background-color: #007fff;
    .br2();
    outline: none;
    box-sizing: border-box;
    cursor: pointer;
    margin: 10px 0 0 0;
    &:hover {
      opacity: 0.9;
    }
    &:active {
      transition: 0.15s;
      opacity: 1;
    }
  }
  .register-btn {
    text-align: center;
    margin: 16px 0 0 0;
    color: #666;
    span {
      cursor: pointer;
      &:hover {
        color: #007fff;
      }
    }
  }
}
</style>
