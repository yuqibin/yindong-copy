(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0c4e04"],{"3d63":function(t,n,e){"use strict";e.r(n);var a=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"story-wrap scroll-wrap",on:{scroll:t.scrollHandle}},[e("div",{staticClass:"container"},[e("SubTitle",{attrs:{"title-name":"小故事~","icon-name":"iconxbq11","class-name":"xiaogushi"}}),e("ArticleList",{attrs:{condition:t.aListCondition},on:{getNoDataFlag:t.getNoDataFlag}})],1),e("el-backtop",{attrs:{bottom:80,target:".scroll-wrap"}})],1)},o=[],i=(e("d3b7"),{name:"story",data:function(){return{tag:"story",offset:0,noMoreDataFlag:!1}},components:{ArticleList:function(){return Promise.all([e.e("chunk-20836e2e"),e.e("chunk-5fcdfa2e"),e.e("chunk-8fa2c214"),e.e("chunk-2d21ee9d")]).then(e.bind(null,"64e5"))},SubTitle:function(){return e.e("chunk-d8901f12").then(e.bind(null,"d6cd"))}},computed:{aListCondition:function(){return{offset:this.offset,tag:this.tag||""}}},created:function(){this.init()},methods:{init:function(){},scrollHandle:function(t){if(!this.noMoreDataFlag){var n=t.target||{};n.scrollHeight===n.clientHeight+n.scrollTop&&(this.offset+=10)}},getNoDataFlag:function(t){this.noMoreDataFlag=t}}}),c=i,s=e("2877"),l=Object(s["a"])(c,a,o,!1,null,"66fc3245",null);n["default"]=l.exports}}]);