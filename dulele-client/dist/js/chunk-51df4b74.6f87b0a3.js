(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-51df4b74"],{"0418":function(t,e,n){"use strict";n.r(e);var c=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"header-wrap",class:{curr:t.currMenu}},[n("div",{staticClass:"m-header"},[n("ul",{staticClass:"menu-wrap"},[n("li",{class:{curr:!t.currMenu},on:{click:function(e){return t.changeMenu()}}},[n("span",{staticClass:"icon iconfont iconhome"}),t._v("首页")]),t._l(t.menuList,(function(e){return n("li",{key:e.name,class:{curr:t.currMenu===e.name},on:{click:function(n){return t.changeMenu(e)}}},[t._v(" "+t._s(e.describe)+" ")])}))],2),n("div",{staticClass:"search-wrap"},[n("el-input",{staticClass:"search-input",attrs:{maxlength:"20",placeholder:"请输入关键字..."},on:{input:t.userInputing},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.searchEnter(e)}},model:{value:t.searchWord,callback:function(e){t.searchWord=e},expression:"searchWord"}}),n("span",{staticClass:"icon iconfont iconicon-search",on:{click:t.searchEnter}})],1),n("div",{staticClass:"others-wrap"},[n("div",{staticClass:"authors",on:{click:t.goAuthorList}},[t._v("作者们")]),n("el-popover",{attrs:{placement:"top-start",width:"200",trigger:"hover",content:"请联系 Q: 930174189"}},[n("el-button",{staticClass:"btn",attrs:{slot:"reference"},slot:"reference"},[t._v("投稿&合作")])],1)],1)]),n("video",{staticClass:"video-bg",attrs:{src:"http://cdn.yindong.club/yindong_header_bg.mp4",autoplay:"",muted:"",loop:""},domProps:{muted:!0}}),t._m(0),n("div",{staticClass:"yinfu-bg"},t._l(28,(function(e){return n("span",{key:e,staticClass:"icon iconfont",class:t.makeYinFuIconClass(),style:t.makeIconStyle(e)})})),0)])},a=[function(){var t=this,e=t.$createElement,c=t._self._c||e;return c("div",{staticClass:"logo"},[c("img",{attrs:{src:n("19fe"),alt:"yindong.club"}}),c("div",{staticClass:"logo-name yindong"},[t._v("音咚")])])}],r=(n("99af"),n("b0c0"),n("ac1f"),n("5319"),n("96cf"),n("1da1")),s=n("22ce"),o=n("9977"),i={name:"header-c",data:function(){return{menuList:[],currMenu:"",searchWord:""}},watch:{"$route.path":function(){this.routeChangeHighMenu()}},components:{},created:function(){this.init()},methods:{init:function(){this.routeChangeHighMenu(),this.getMenuList()},routeChangeHighMenu:function(){this.currMenu=this.$route.path.replace(/\//g,"")||""},goAuthorList:function(){this.$router.push("/author-list")},userInputing:function(){this.searchWord=this.searchWord.replace(/[^0-9a-zA-Z\u4e00-\u9fa5]/g,"")},searchEnter:function(){this.searchWord&&this.$router.push("/search/".concat(this.searchWord))},changeMenu:function(t){var e=this.currMenu;t&&t.name==e||!t&&!e||(this.currMenu=t?t.name:"",this.$router.push(t?"/".concat(t.name):"/"))},makeYinFuIconClass:function(){var t=["fade-in-out","yfrotate","yf-fade-top","fade-scale"],e=Math.floor(Math.random()*t.length);return"iconyf".concat(Object(o["e"])(1,16)," ").concat(t[e])},makeIconStyle:function(t){var e=7,n=Math.floor(100/e),c=t<n?Object(o["e"])(t*e,(t+1)*e):Object(o["e"])((t-n)*e,(t-n+1)*e),a=t<n?Object(o["e"])(0,30):Object(o["e"])(35,75);return"color: ".concat(Object(o["c"])(),";left:").concat(c,"%;top:").concat(a,"%;")},getMenuList:function(){var t=this;return Object(r["a"])(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(s["e"])();case 2:n=e.sent.data,0===n.code?t.menuList=n.data||[]:t.$message.error("服务器异常~");case 4:case"end":return e.stop()}}),e)})))()}}},u=i,l=(n("a901"),n("2877")),h=Object(l["a"])(u,c,a,!1,null,null,null);e["default"]=h.exports},"19fe":function(t,e,n){t.exports=n.p+"img/yindong.6fe7f3b4.png"},"328b":function(t,e,n){},a901:function(t,e,n){"use strict";var c=n("328b"),a=n.n(c);a.a}}]);