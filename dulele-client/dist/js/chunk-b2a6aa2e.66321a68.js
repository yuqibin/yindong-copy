(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-b2a6aa2e"],{2909:function(t,n,a){"use strict";a.d(n,"a",(function(){return u}));var e=a("6b75");function r(t){if(Array.isArray(t))return Object(e["a"])(t)}a("a4d3"),a("e01a"),a("d28b"),a("a630"),a("d3b7"),a("3ca3"),a("ddb0");function i(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}var o=a("06c5");function c(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function u(t){return r(t)||i(t)||Object(o["a"])(t)||c()}},"86bb":function(t,n,a){"use strict";a.r(n);var e=function(){var t=this,n=t.$createElement,a=t._self._c||n;return a("div",{staticClass:"author-list-wrap"},[a("div",{staticClass:"container"},[a("SubTitle",{attrs:{"title-name":"可爱的作者们~","icon-name":"iconxbq19","class-name":"keaidezuozhemen"}}),a("ul",{staticClass:"author-show"},t._l(t.authorList,(function(n){return a("li",{key:n.id},[a("div",{staticClass:"img-box",on:{click:function(a){return t.goAuthorDetail(n)}}},[a("img",{attrs:{src:n.uicon,alt:""}})]),a("span",{staticClass:"name ell",attrs:{title:n.realname},on:{click:function(a){return t.goAuthorDetail(n)}}},[a("span",[t._v(t._s(n.realname))])]),a("span",{staticClass:"count ell",attrs:{title:n.readcount}},[t._v(t._s(n.readcount))])])})),0)],1),a("el-backtop",{attrs:{bottom:80,target:".author-list-wrap"}})],1)},r=[],i=(a("d3b7"),a("2909")),o=(a("96cf"),a("1da1")),c=a("22ce"),u={name:"author-list",data:function(){return{authorList:[]}},components:{SubTitle:function(){return a.e("chunk-d8901f12").then(a.bind(null,"d6cd"))}},created:function(){this.init()},methods:{init:function(){this.getAuthorList()},goAuthorDetail:function(t){this.$router.push("/author/".concat(t.authorid))},getAuthorList:function(){var t=this;return Object(o["a"])(regeneratorRuntime.mark((function n(){var a;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,Object(c["c"])();case 2:a=n.sent,a=a.data,0===a.code&&Array.isArray(a.data)&&(t.authorList=Object(i["a"])(a.data));case 5:case"end":return n.stop()}}),n)})))()}}},s=u,l=(a("fadd"),a("2877")),d=Object(l["a"])(s,e,r,!1,null,"48b57710",null);n["default"]=d.exports},c36f:function(t,n,a){},fadd:function(t,n,a){"use strict";var e=a("c36f"),r=a.n(e);r.a}}]);