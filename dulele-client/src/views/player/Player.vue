<template>
  <div
    class="play-wrap"
    @click.stop=""
  >
    <!-- 播放器 -->
    <div
      class="du-player-wrap"
      ref="duPlay"
    >
      <audio
        class="audio-hide"
        ref="audio"
        @canplay="audioReady"
        :loop="loopModeIndex === 4"
        :src="currPlay.audiourl"
      ></audio>
      <!-- 播放进度 -->
      <div class="play-progress-wrap">
        <div
          class="img-con br4"
          @click="switchProgressPanel()"
        >
          <img
            :src="currPlay.coverphoto || noAudioImg"
            alt=""
          >
          <div class="switch">
            <span
              class="top icon iconfont"
              :class="[!audioTextPicker? 'iconup': 'icondown']"
            ></span>
            <span
              class="bottom icon iconfont"
              :class="[!audioTextPicker? 'icondown': 'iconup']"
            ></span>
          </div>
        </div>
        <div
          class="a-title ell"
          @click.stop="goArtDetail(currPlay.id)"
        >{{currPlay.title}}</div>
        <div class="progress">
          <span
            class="author-name"
            @click.stop="goAuthorDetail(currPlay.authorid)"
          >{{currPlay.author}}</span>
          {{seToMinSe(currentAudioTime)}} / {{seToMinSe(audioDuration)}}
        </div>
      </div>
      <!-- 播放暂停上下首 -->
      <div class="play-btns-wrap">
        <span
          class="icon iconfont iconprev"
          @click="prevOrNextPlay(-1)"
        ></span>
        <span
          class="play icon iconfont"
          @click="playAndSuspend"
          :class="[playing ? 'iconzanting' : 'iconplay']"
        ></span>
        <span
          class="icon iconfont iconnext"
          @click="prevOrNextPlay(1)"
        ></span>
      </div>
      <!-- 其他控制 -->
      <div class="other-control-wrap">
        <span
          @click="volumePicker = !volumePicker"
          class="volume icon iconfont"
          :class="[volume ? 'iconvoice' : 'iconno-voice', volumePicker ? 'curr' : '']"
        >
          <div
            class="slider-wrap"
            @click.stop=""
          >
            <!-- v-show="volumePicker" -->
            <el-slider
              class="volume-control"
              :class="{'curr': volumePicker}"
              v-model="volume"
              :show-tooltip="false"
              vertical
              height="100px"
              @click.stop=""
            >
            </el-slider>
          </div>
        </span>
        <span
          @click="loopModeChange"
          class="loop-mode icon iconfont"
          :class="loopMode"
        ></span>
        <span
          @click="platListPicker = !platListPicker"
          class="play-list icon iconfont iconlist"
          :class="{'curr' : platListPicker}"
        > <span class="num">{{playList.length}}</span> </span>
        <el-popover
          class="tips"
          placement="bottom"
          width="160"
          trigger="manual"
          content="已添加至播放列表"
          v-model="addSuccessTips"
        >
        </el-popover>
      </div>
      <!-- 进度条 可拖拽切换进度 -->
      <div
        class="progress-bar"
        v-show="audioDuration"
      >
        <el-slider
          v-model="progressBarVal"
          :max="audioDuration"
          @change="progressBarChange"
          :show-tooltip="false"
        ></el-slider>
      </div>
    </div>
    <!-- 播放列表 -->
    <div
      class="play-list-wrap"
      :class="{'curr': platListPicker}"
    >
      <img
        class="bg"
        v-show="currPlay.coverphoto"
        :src="currPlay.coverphoto"
        alt=""
      >
      <div class="l-title">
        <span class="name">播放列表<span v-show="playList.length">({{playList.length}})</span></span>
        <span
          class="remove-all"
          @click="removeAll"
        >
          清空<span class="icon iconfont icondel"></span>
        </span>
      </div>
      <div class="list-wrap">
        <ul
          v-show="playList.length"
          class="a-list scroll-wrap"
          ref="listShowPanel"
        >
          <li
            v-for="a in playList"
            :key="a.id"
            :class="{'curr': a.id === currPlay.id}"
            @click="pickOnePlay(a.id)"
          >
            <div
              class="name ell"
              :title="a.title"
            >{{a.title}}</div>
            <div
              class="author ell"
              :title="a.author"
            >{{a.author}}</div>
            <div class="remove-this">
              <span
                class="icon iconfont icondel"
                @click.stop="removeThis(a.id)"
              ></span>
            </div>
          </li>
        </ul>
        <!-- 无播放列表 -->
        <div
          class="no-data"
          v-show="!playList.length"
        >
          <svg
            class="icon"
            aria-hidden="true"
          >
            <use :xlink:href="'#iconno-data'"></use>
          </svg>
        </div>
      </div>
    </div>
    <!-- 音频内容面板 -->
    <div
      class="audio-text-panel"
      v-show="playList.length"
      @click="platListPicker = false"
      :class="{'curr': audioTextPicker}"
    >
      <div class="a-title">{{currPlay.title}}
        <span
          class="close icon iconfont iconclose"
          @click="audioTextPicker = false"
        ></span>
        <!-- <span class="remove-all icon iconfont icondel"></span> -->
      </div>
      <!-- copy -->
      <CopyText
        class="copy-c"
        :c-text="copyText"
      ></CopyText>
      <img
        :src="currPlay.coverphoto"
        class="img-blur"
        alt=""
      >
      <div
        id="nice"
        class="text markdown-body scroll-wrap"
        ref="audioText"
        v-html="currPlayText"
      >
      </div>
    </div>
  </div>
</template>

<script>
import Bus from "@/common/bus/bus";
import { randomM, seToMinSe, escapeHtml } from "@/common/utils/utils";
import noAudioImg from "./imgs/no-audio.jpg";

const loopModeList = [
  "iconloop-sx",
  "iconloop-xh",
  "iconloop-sj",
  "iconloop-one",
];

export default {
  name: "player",
  data() {
    return {
      copyText: "",
      addSuccessTips: false,
      noAudioImg,
      playing: false, // 播放 暂停状态
      volume: 100, // 音量
      loopModeIndex: 1, // 循环模式:    1 顺序循环  2 列表循环  3 随机   4 单曲循环
      playList: [], // 当前播放列表
      platListPicker: false, // 播放列表展示/隐藏
      audioTextPicker: false, // 音频内容显示/隐藏
      volumePicker: false, // 改变音量控制器
      currPlayIndex: 0, // 当前播放的index
      randomIndex: 0, // 乱序currPlayIndex数组 的index
      audioDuration: 0, // 音频总长度  （秒计
      currentAudioTime: 0, // 音频 播放位置（以秒计
      audioTimer: "", // 计时器  定时返回当前播放位置
      progressBarVal: 0, // 进度条值（0-audioDuration 之间）
    };
  },
  computed: {
    // 根据playList长度乱序 预先存储全部currPlayIndex
    randomList: function () {
      let len = this.playList.length - 1;
      let list = [];
      for (let i = 0; i <= len; i++) {
        list.push(i);
      }
      for (let j = 0; j <= len; j++) {
        let v = list[j];
        let rm = randomM(len);
        list[j] = list[rm];
        list[rm] = v;
      }
      return list;
    },
    currPlayText: function () {
      return this.$markdowner.makeHtml(escapeHtml(this.currPlay.content || ""));
    },
    // 当前播放对象
    currPlay: function () {
      let list = this.loopModeIndex === 3 ? this.randomPlayList : this.playList;
      let index =
        this.loopModeIndex === 3 ? this.randomIndex : this.currPlayIndex;
      let curr = list[index];
      return (
        curr || {
          audiourl: "",
          title: "",
          coverphoto: "",
          content: "",
          authorid: "",
        }
      );
    },
    // 随机播放列表
    randomPlayList: function () {
      let rList = this.randomList;
      let list = [];
      for (let i of rList) {
        list.push(this.playList[i]);
      }
      return list;
    },
    // audio对象
    audio: function () {
      let audio = this.$refs.audio;
      return audio;
    },
    // 循环模式
    loopMode: function () {
      return loopModeList[this.loopModeIndex - 1];
    },
  },
  watch: {
    volume: function () {
      let audio = this.audio;
      let flag = this.playing;
      audio.volume = this.volume / 100;
      flag ? audio.play() : audio.pause();
    },
    currPlay: function () {
      this.progressBarVal = 0;

      if (this.currPlay) {
        let audio = this.audio;
        if (this.playing) {
          this.playing = false;
          audio.pause();
          setTimeout(() => {
            this.playing = true;
            audio.play();
          }, 0);
        }
        audio.volume = this.volume / 100;
        audio.onended = () => {
          this.playing = !this.playing;
          this.prevOrNextPlay(0);
        };
      }
      this.$nextTick(() => {
        this.copyText = this.$refs.audioText.textContent;
      });
    },
  },
  components: {
    CopyText: () => import("../../components/CopyText"),
  },
  created() {
    this.init();
  },
  mounted() {
    this.resetAllFlag();
    // setTimeout(() => {
    //   this.keyboardToChangeAudio();
    // }, 0);
  },
  methods: {
    init() {
      this.watchNewAddToPlay();
    },
    // 当前播放结束 或者 上下切换 flag  0表示当前播放结束进入下一个  1表示下一首   -1表示上一首
    prevOrNextPlay(flag) {
      switch (this.loopModeIndex) {
        // 单曲循环 无序处理 audio loop 自带循环功能
        case 4:
          this.singlePlay(flag);
          break;
        // 随机
        case 3:
          this.randomPlay(flag);
          break;
        // 列表循环
        case 2:
          this.listRepeatPlay(flag);
          break;
        // 顺序 到最后一首播放完自动停
        case 1:
          this.orderListPlay(flag);
          break;
        default:
          break;
      }
    },
    // 播放中切换 先暂停
    playingToPaused() {
      this.playing = false;
      this.audio.pause();
    },
    // 切换完成  间隔500ms 播放
    changeEndToPlay() {
      setTimeout(() => {
        this.playAndSuspend();
      }, 500);
    },
    // 单曲循环  可以切换上下  但是播放结束不做任何
    singlePlay(flag) {
      if (!flag) {
        return;
      }
      if (flag > 0 && this.currPlayIndex < this.playList.length - 1) {
        this.playingToPaused();
        this.currPlayIndex++;
        this.changeEndToPlay();
      }
      if (flag < 0 && this.currPlayIndex > 0) {
        this.currPlayIndex--;
        this.playingToPaused();
        this.changeEndToPlay();
      }
    },
    // 列表循环播放  flag  0表示当前播放结束进入下一个  1表示下一首   -1表示上一首
    listRepeatPlay(flag) {
      if (flag >= 0) {
        this.currPlayIndex++;
        this.currPlayIndex =
          this.currPlayIndex > this.playList.length - 1
            ? 0
            : this.currPlayIndex;
        if (flag) {
          this.playingToPaused();
        }
        this.changeEndToPlay();
      }
      if (flag < 0 && this.currPlayIndex > 0) {
        this.currPlayIndex--;
        this.playingToPaused();
        this.changeEndToPlay();
      }
    },
    // 顺序播放  flag  0表示当前播放结束进入下一个  1表示下一首   -1表示上一首
    orderListPlay(flag) {
      if (flag >= 0 && this.currPlayIndex < this.playList.length - 1) {
        if (flag) {
          this.playingToPaused();
        }
        this.currPlayIndex++;
        this.changeEndToPlay();
      }
      if (flag < 0 && this.currPlayIndex > 0) {
        this.currPlayIndex--;
        this.playingToPaused();
        this.changeEndToPlay();
      }
    },
    // 随机播放 flag  0表示当前播放结束进入下一个  1表示下一首   -1表示上一首
    randomPlay(flag) {
      if (flag >= 0 && this.randomIndex < this.playList.length - 1) {
        if (flag) {
          this.playingToPaused();
        }
        this.randomIndex++;
        this.changeEndToPlay();
      }
      if (flag < 0 && this.randomIndex > 0) {
        this.randomIndex--;
        this.playingToPaused();
        this.changeEndToPlay();
      }
    },
    // 替换并播放
    replaceAudioList() {
      Bus.$on("replaceList", (list) => {
        if (list && Array.isArray && list.length) {
          this.playList = [];
          this.playList = list;
          this.pickOnePlay(list[0].id);
          this.addSuccessTipsHandle();
        }
      });
    },
    // 添加（是否播放）
    addAudioToList() {
      Bus.$on("addToList", (list, flag) => {
        let playList = this.playList;
        if (Array.isArray(list) && list.length) {
          let idList = playList.map((v) => {
            return v.id;
          });
          for (let a of list) {
            if (idList.indexOf(+a.id) < 0) {
              playList.push(a);
            }
          }
          if (flag) {
            this.pickOnePlay(list[0].id);
          }
        }
        this.addSuccessTipsHandle();
      });
    },
    // 播放器容器接受数据
    watchNewAddToPlay() {
      this.replaceAudioList();
      this.addAudioToList();
    },
    // 添加成功提示
    addSuccessTipsHandle() {
      this.addSuccessTips = true;
      setTimeout(() => {
        this.addSuccessTips = false;
      }, 1000);
    },
    // 播放暂停
    playAndSuspend() {
      let audio = this.audio;
      if (!this.playList.length) {
        return;
      }
      this.playing = !this.playing;
      audio.paused ? audio.play() : audio.pause();
    },
    // 音频准备完毕
    audioReady(flag) {
      let that = this;
      let index = 0;
      let audio = that.audio;
      // 拖拽进度
      if (typeof flag === "number") {
        index = flag;
        audio.currentTime = flag;
      }
      let duration = Math.ceil(audio.duration);
      that.audioDuration = duration;
      that.currentAudioTime = Math.ceil(index + 1);
      window.clearInterval(that.audioTimer);
      that.audioTimer = setInterval(() => {
        if (that.playing) {
          index++;
          that.currentAudioTime = Math.ceil(index + 1);
          that.progressBarVal = audio.currentTime + 1;
        }
        if (index >= duration - 1) {
          window.clearInterval(that.audioTimer);
        }
      }, 1000);

      let curr = that.$refs.listShowPanel.querySelector(".curr");
      if (curr) {
        curr.scrollIntoView(false); // false 底部对齐
      }
    },
    // 从列表中选择一个播放
    pickOnePlay(id) {
      let that = this;
      let index = null;
      let flag = this.loopModeIndex === 3; // 随机播放模式
      let list = flag ? that.randomPlayList : this.playList;
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          index = i;
          break;
        }
      }
      if (flag && index !== null) {
        this.randomIndex = index;
      } else {
        this.currPlayIndex = index;
      }
      if (this.audio.paused) {
        this.playAndSuspend();
      }
    },
    // 列表清空
    removeAll() {
      this.playList = [];
      this.playing = false;
      this.progressBarVal = 0;
    },
    // 从列表选择一个移除列表
    removeThis(id) {
      let list = this.playList;
      for (let i = 0; i < list.length; i++) {
        if (id === list[i].id) {
          list.splice(i, 1);
          break;
        }
      }
    },
    // 拖拽进度结束
    progressBarChange() {
      this.audioReady(this.progressBarVal);
    },
    // 监听键盘事件   空格：播放/暂停   左右：上下首
    keyboardToChangeAudio() {
      let that = this;
      document.onkeyup = (e) => {
        if (that.currPlay.audiourl) {
          switch (e.keyCode) {
            case 32: // 空格
              that.playAndSuspend();
              break;
            case 37: // 左
              that.prevOrNextPlay(-1);
              break;
            case 39: // 右
              that.prevOrNextPlay(1);
              break;
            default:
              break;
          }
        }
      };
    },
    // 点击其他区域重置面板显示开关
    resetAllFlag() {
      let that = this;
      document.body.addEventListener("click", (e) => {
        try {
          if (!that.$refs.duPlay.contains(e.target)) {
            that.volumePicker = false;
            that.audioTextPicker = false;
            that.platListPicker = false;
          }
        } catch (err) {
          console.log(err);
        }
      });
    },
    // 切换循环模式
    loopModeChange() {
      if (this.loopModeIndex === loopModeList.length) {
        this.loopModeIndex = 1;
        return;
      }
      this.loopModeIndex++;
    },
    // 秒转分秒  136 to  02:16
    seToMinSe(s) {
      return seToMinSe(s);
    },
    switchProgressPanel() {
      if (this.playList.length) {
        this.audioTextPicker = !this.audioTextPicker;
      }
    },
    goArtDetail(aid) {
      this.$router.push(`/a/${aid}`);
    },
    goAuthorDetail(auid) {
      this.$router.push(`/author/${auid}`);
    },
  },
};
</script>

<style lang="less">
.gradual-change-x (@left, @right) {
  background: linear-gradient(to right, @left, @right);
}

.gradual-change-y (@top, @bottom) {
  background: linear-gradient(@top, @bottom);
}

.play-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0;
  z-index: 999;
}

.du-player-wrap {
  z-index: 999;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 60px;
  width: 100%;
  display: flex;
  // flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.13) 0px -6px 12px;
  .gradual-change-y(rgba(255, 255, 255, 0.65), rgba(255, 255, 255, 0.65));
  // background: rgba(255, 255, 255, 0.65);
  padding: 0 20px;
  border-radius: 4px 4px 0 0;
  > div {
    flex: 1;
  }
  .audio-hide {
    display: none;
  }
}

.play-progress-wrap {
  position: relative;
  padding: 0 0 0 50px;
  height: 44px;
  font-size: 14px;
  display: flex;
  // align-items: flex-end;
  flex-direction: column;
  > div {
    display: inline-block;
  }

  .img-con {
    position: absolute;
    width: 40px;
    height: 40px;
    left: -3px;
    top: 2px;
    overflow: hidden;
    cursor: pointer;
    &.curr {
      animation: rotateRepeat 30s linear infinite;
    }
    > img {
      width: 100%;
    }
    .switch {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      text-align: center;
      span {
        font-size: 10px;
        // font-weight: bold;
        display: block;
        height: 50%;
        color: #fff;
        opacity: 0;
        line-height: 14px;
        &:first-child {
          line-height: 26px;
        }
      }
      .icondown .iconup {
        transition: 0.25s;
      }
      &:hover {
        span {
          opacity: 1;
        }
        background: rgba(0, 0, 0, 0.5);
      }
    }
  }
  .a-title {
    color: #1b1b1b;
    width: max-content;
    max-width: 300px;
    line-height: 22px;
    cursor: pointer;
    padding: 0 10px 0 0;
    &:hover {
      color: var(--themeColor);
    }
  }

  .progress {
    line-height: 22px;
    color: #999;
    width: max-content;
    padding: 0 10px 0 0;
    font-size: 12px;
    .author-name {
      display: inline-block;
      color: #a1a0d6;
      margin: 0 8px 0 0;
      cursor: pointer;
      &:hover {
        color: #8a88ef;
      }
    }
  }
}

@keyframes rotateRepeat {
  0% {
    transform: rotateZ(0);
  }
  100% {
    transform: rotateZ(360deg);
  }
}

.play-btns-wrap {
  display: flex;
  justify-content: center;
  align-content: center;
  span {
    color: #ce240a;
    font-size: 26px;
    line-height: 30px;

    cursor: pointer;
    &:hover {
      transition: 0.25s;
    }
  }
  .iconzanting {
    // animation: rotateRepeat 30s linear infinite;
  }
  .play {
    display: inline-block;
    width: 30px;
    height: 30px;
    background: #ce240a;
    text-align: center;
    border-radius: 50%;
    margin: 0 20px;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
  }
}

.other-control-wrap {
  text-align: right;
  font-size: 26px;
  .icon {
    font-size: 22px;
    margin: 0 12px 0 0;
    color: #333;
    cursor: pointer;

    &:last-child {
      margin: 0;
    }
  }
  .volume {
    position: relative;
    &.curr {
      color: var(--themeColor);
    }
    .volume-control {
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-55%, -100%) scale(0);
      background-color: rgba(81, 86, 93, 0.7);
      width: 22px;
      border-radius: 12px;
      padding: 16px 0;
      box-shadow: rgba(0, 0, 0, 0.3) 0 0 8px;
      transition: 0.15s;
      transform-origin: bottom;
      &.curr {
        transform: translate(-55%, -100%) scale(1);
      }
    }
    .slider-wrap {
      left: 50%;
      top: -20px;
      transform: translate(-50%, 0);
      position: absolute;
    }
    .el-slider__runway {
      background-color: #4d4d4e;
    }
    .el-slider.is-vertical .el-slider__button-wrapper {
      left: -16px;
    }
    .el-slider.is-vertical .el-slider__runway {
      margin: 0 10px;
      width: 3px;
    }
    .el-slider.is-vertical .el-slider__bar {
      width: 3px;
      background-color: var(--themeColor);
    }
    .el-slider__button {
      width: 12px;
      height: 12px;
      border: 3px solid #fff;
      background-color: var(--themeColor);
    }
  }
  .loop-mode {
    &:hover {
      color: var(--themeColor);
    }
  }
  .tips {
    position: absolute;
    right: 0;
    top: 0;
    > div {
      transform: translate(-105%, -110%);
    }
  }
  .play-list {
    position: relative;
    .num {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 12px;
      font-weight: bold;
      color: var(--themeColor);
      transform: translate(85%, -36%);
    }
    &.curr {
      color: var(--themeColor);
    }
  }
}

.progress-bar {
  position: absolute;
  width: calc(100% - 10px);
  left: 5px;
  top: 0;
  transform: translateY(-50%);
  .el-slider__runway {
    margin: 0;
    height: 2px;
    background-color: rgba(0, 0, 0, 0);
  }
  .el-slider__bar {
    height: 2px;
    background-color: var(--themeColor);
  }
  .el-slider__button {
    width: 10px;
    height: 10px;
    border: 3px solid var(--themeColor);
    background-color: var(--themeColor);
  }
  .el-slider__button-wrapper {
    top: -17px;
  }
}

.play-list-wrap {
  z-index: 998;
  position: fixed;
  bottom: 60px;
  width: 40%;
  height: 30vh;
  background: rgba(0, 0, 0, 0.8);
  right: 0;
  transform: translate(105%, 0);
  border-radius: 4px 4px 0 0;
  transition: 0.15s;
  transform-origin: right;
  box-shadow: -2px -2px 8px #544d4d;
  overflow: hidden;
  &.curr {
    transform: translate(0, 0);
  }
  .bg {
    position: absolute;
    width: 100%;
    filter: blur(20px);
    opacity: 0.3;
    pointer-events: none;
    z-index: -1;
    transform: translate(-10%, -20%);
  }
  .l-title {
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    display: flex;
    padding: 0 8px;
    justify-content: space-between;
    border-bottom: 1px dashed #888;
    .name {
      color: #fff;
    }
    .icon {
      font-size: 16px;
      display: inline-block;
      transform: translateY(1px);
    }
    .remove-all {
      font-size: 14px;
      line-height: 38px;
      cursor: pointer;
      color: #888;
      &:hover {
        color: #fff;
      }
    }
  }
  .list-wrap {
    color: #909090;
    height: 100%;
    padding: 8px 8px 4px 12px;
    overflow: hidden;
    .no-data {
      height: calc(100% - 46px);
      display: flex;
      justify-content: center;
      align-content: center;
      font-size: 25px;
      svg {
        width: 140px;
        opacity: 0.7;
      }
    }
    .a-list {
      scroll-behavior: smooth;
      height: calc(100% - 46px);
      margin: 4px 2px 0 0;
      padding: 0 0 0 0;
    }
    li {
      margin: 1px 16px 0 0;
      padding: 0 0 0 8px;
      display: flex;
      line-height: 24px;
      font-size: 14px;
      cursor: pointer;
      border-radius: 4px;
      &.curr {
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
      }
      &:hover {
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
      }
      .name {
        flex: 4;
        margin: 0 16px 0 0;
      }
      .author {
        flex: 1;
        text-align: right;
      }
      .remove-this {
        width: 20px;
        transition: 0.15s;
        margin: 0 6px;
        .icon {
          cursor: pointer;
          font-size: 18px;
        }
        &:hover {
          color: var(--themeColor);
        }
      }
    }
  }
}

.audio-text-panel {
  box-shadow: -2px -2px 8px #544d4d;
  z-index: 997;
  position: fixed;
  bottom: 60px;
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  right: 0;
  transform: translateY(60px);
  border-radius: 4px 4px 0 0;
  transition: 0.15s;
  transform-origin: bottom;
  overflow: hidden;
  position: relative;
  &.curr {
    transform: translateY(-100%);
  }
  .a-title {
    color: #fff;
    text-align: center;
    line-height: 50px;
    font-size: 20px;
    letter-spacing: 3px;
    font-family: TChinese, SimSun, FangSong, STSong, STZhongsong, LiSu, KaiTi,
      "Microsoft YaHei";
    .close {
      position: absolute;
      right: 4px;
      top: 6px;
      font-size: 22px;
      width: 30px;
      height: 30px;
      line-height: 30px;
      color: #ccc;
      cursor: pointer;
      &:hover {
        color: #fff;
      }
    }
  }
  span {
    &.copy-c {
      position: absolute;
      right: 22%;
      font-weight: 400;
      color: #ccc;
      &:hover {
        color: #fff;
      }
    }
  }

  .img-blur {
    width: 100%;
    position: absolute;
    filter: blur(10px);
    z-index: -1;
    top: 0;
    left: 50%;
    opacity: 0.5;
    transform: translate(-50%, -40%);
  }
  .text {
    width: 50%;
    color: #fff;
    * {
      color: #fff !important;
    }
    blockquote {
      background: none !important;
    }
    code {
      color: #12a5ad !important;
    }
    font-size: 16px;
    // line-height: 30px;
    min-height: 20vh;
    max-height: 30vh;
    overflow-y: auto;
    margin: 0 auto 20px auto;
    a {
      color: #664d9d;
    }
  }
}

@keyframes cpoySuccHide {
  50% {
    opacity: 1;
    transform: translateY(-80%);
  }
  100% {
    transform: translateY(-80%);
    opacity: 0;
  }
}
</style>
