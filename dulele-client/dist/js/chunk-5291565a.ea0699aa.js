(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5291565a"],{"3f9b":function(c,t,e){},"9afe":function(c,t,e){"use strict";var s=e("3f9b"),n=e.n(s);n.a},"9d88":function(c,t,e){"use strict";e.r(t);var s=function(){var c=this,t=c.$createElement,e=c._self._c||t;return e("span",{staticClass:"copy icon iconfont iconcopy",on:{click:c.copyText}},[e("span",{staticClass:"tips",class:{curr:c.copySuccessFlag}},[c._v("写轮眼复制成功~!")]),e("textarea",{ref:"copy",staticClass:"hide-text"})])},n=[],o={name:"copy-text",data:function(){return{copySuccessFlag:!1}},props:{cText:{default:""}},methods:{copyText:function(){var c=this,t=this.$refs.copy;t.innerText=this.cText+"\n -- 来自【音咚-http://www.yindong.club】",t.select(),document.execCommand("copy")&&(this.copySuccessFlag=1,setTimeout((function(){c.copySuccessFlag=0}),1e3))}}},a=o,i=(e("9afe"),e("2877")),u=Object(i["a"])(a,s,n,!1,null,"372040e7",null);t["default"]=u.exports}}]);