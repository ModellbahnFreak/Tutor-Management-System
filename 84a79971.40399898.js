(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{74:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return i})),r.d(t,"metadata",(function(){return l})),r.d(t,"rightToc",(function(){return u})),r.d(t,"default",(function(){return p}));var n=r(2),a=r(6),o=(r(0),r(94)),c=r(95),i=(r(96),{id:"ID",title:"TITLE",sidebar_label:"SIDEBAR"}),l={unversionedId:"handbook/ID",id:"handbook/ID",isDocsHomePage:!1,title:"TITLE",description:"SECTION_TITLE",source:"@site/docs\\handbook\\_template.md",slug:"/handbook/ID",permalink:"/Tutor-Management-System/docs/handbook/ID",editUrl:"https://github.com/Dudrie/Tutor-Management-System/edit/add-documentation/docs/docs/handbook/_template.md",version:"current",sidebar_label:"SIDEBAR"},u=[{value:"SECTION_TITLE",id:"section_title",children:[]}],s={rightToc:u};function p(e){var t=e.components,r=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(n.a)({},s,r,{components:t,mdxType:"MDXLayout"}),Object(o.b)(c.a,{roles:["admin"],mdxType:"Roles"}),Object(o.b)("h2",{id:"section_title"},"SECTION_TITLE"),Object(o.b)("p",null,"\ud83d\udee0 WORK IN PROGRESS"))}p.isMDXComponent=!0},93:function(e,t,r){"use strict";function n(e){var t,r,a="";if("string"==typeof e||"number"==typeof e)a+=e;else if("object"==typeof e)if(Array.isArray(e))for(t=0;t<e.length;t++)e[t]&&(r=n(e[t]))&&(a&&(a+=" "),a+=r);else for(t in e)e[t]&&(a&&(a+=" "),a+=t);return a}t.a=function(){for(var e,t,r=0,a="";r<arguments.length;)(e=arguments[r++])&&(t=n(e))&&(a&&(a+=" "),a+=t);return a}},94:function(e,t,r){"use strict";r.d(t,"a",(function(){return p})),r.d(t,"b",(function(){return d}));var n=r(0),a=r.n(n);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var u=a.a.createContext({}),s=function(e){var t=a.a.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=s(e.components);return a.a.createElement(u.Provider,{value:t},e.children)},f={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},m=a.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,c=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),p=s(r),m=n,d=p["".concat(c,".").concat(m)]||p[m]||f[m]||o;return r?a.a.createElement(d,i(i({ref:t},u),{},{components:r})):a.a.createElement(d,i({ref:t},u))}));function d(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,c=new Array(o);c[0]=m;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:n,c[1]=i;for(var u=2;u<o;u++)c[u]=r[u];return a.a.createElement.apply(null,c)}return a.a.createElement.apply(null,r)}m.displayName="MDXCreateElement"},95:function(e,t,r){"use strict";var n=r(93),a=r(0),o=r.n(a),c=r(47),i=r.n(c);t.a=function({roles:e}){const t=Object(a.useMemo)((()=>e.filter((e=>!!e)).map((e=>e.charAt(0).toUpperCase()+e.slice(1).toLowerCase())).sort()),[e]);return o.a.createElement("div",{className:i.a.roleContainer},o.a.createElement("span",{className:i.a.roleLabel},"Roles:"),t.map((e=>o.a.createElement("span",{key:e,className:Object(n.a)("badge badge--primary",i.a.role)},e))))}},96:function(e,t,r){"use strict";var n=r(93),a=r(0),o=r.n(a),c=r(48),i=r.n(c);t.a=function({icon:e,small:t}){return o.a.createElement("span",{className:Object(n.a)(i.a.wrapper,t&&i.a["wrapper-small"])},o.a.createElement(e,null))}}}]);