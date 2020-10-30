(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{67:function(e,n,t){"use strict";t.r(n),t.d(n,"frontMatter",(function(){return c})),t.d(n,"metadata",(function(){return s})),t.d(n,"rightToc",(function(){return l})),t.d(n,"default",(function(){return p}));var r=t(2),a=t(6),o=(t(0),t(91)),i=t(93),c={id:"hand_ins",title:"Hand-Ins",sidebar_label:"Hand-Ins"},s={unversionedId:"handbook/hand_ins",id:"handbook/hand_ins",isDocsHomePage:!1,title:"Hand-Ins",description:"SECTION_TITLE",source:"@site/docs\\handbook\\hand_ins.md",slug:"/handbook/hand_ins",permalink:"/Tutor-Management-System/docs/handbook/hand_ins",editUrl:"https://github.com/Dudrie/Tutor-Management-System/edit/main/docs/docs/handbook/hand_ins.md",version:"current",sidebar_label:"Hand-Ins",sidebar:"handbook",previous:{title:"Tutorial Management",permalink:"/Tutor-Management-System/docs/handbook/tutorial_management"},next:{title:"Scheincriterias",permalink:"/Tutor-Management-System/docs/handbook/criterias"}},l=[{value:"SECTION_TITLE",id:"section_title",children:[]}],u={rightToc:l};function p(e){var n=e.components,t=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},u,t,{components:n,mdxType:"MDXLayout"}),Object(o.b)(i.a,{roles:["admin","employee"],mdxType:"Roles"}),Object(o.b)("h2",{id:"section_title"},"SECTION_TITLE"),Object(o.b)("p",null,"\ud83d\udee0 WORK IN PROGRESS"))}p.isMDXComponent=!0},91:function(e,n,t){"use strict";t.d(n,"a",(function(){return p})),t.d(n,"b",(function(){return m}));var r=t(0),a=t.n(r);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function c(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=a.a.createContext({}),u=function(e){var n=a.a.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):c(c({},n),e)),t},p=function(e){var n=u(e.components);return a.a.createElement(l.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return a.a.createElement(a.a.Fragment,{},n)}},f=a.a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),p=u(t),f=r,m=p["".concat(i,".").concat(f)]||p[f]||d[f]||o;return t?a.a.createElement(m,c(c({ref:n},l),{},{components:t})):a.a.createElement(m,c({ref:n},l))}));function m(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var o=t.length,i=new Array(o);i[0]=f;var c={};for(var s in n)hasOwnProperty.call(n,s)&&(c[s]=n[s]);c.originalType=e,c.mdxType="string"==typeof e?e:r,i[1]=c;for(var l=2;l<o;l++)i[l]=t[l];return a.a.createElement.apply(null,i)}return a.a.createElement.apply(null,t)}f.displayName="MDXCreateElement"},92:function(e,n,t){"use strict";function r(e){var n,t,a="";if("string"==typeof e||"number"==typeof e)a+=e;else if("object"==typeof e)if(Array.isArray(e))for(n=0;n<e.length;n++)e[n]&&(t=r(e[n]))&&(a&&(a+=" "),a+=t);else for(n in e)e[n]&&(a&&(a+=" "),a+=n);return a}n.a=function(){for(var e,n,t=0,a="";t<arguments.length;)(e=arguments[t++])&&(n=r(e))&&(a&&(a+=" "),a+=n);return a}},93:function(e,n,t){"use strict";var r=t(92),a=t(0),o=t.n(a),i=t(47),c=t.n(i);n.a=function({roles:e}){const n=Object(a.useMemo)((()=>e.filter((e=>!!e)).map((e=>e.charAt(0).toUpperCase()+e.slice(1).toLowerCase())).sort()),[e]);return o.a.createElement("div",{className:c.a.roleContainer},o.a.createElement("span",{className:c.a.roleLabel},"Roles:"),n.map((e=>o.a.createElement("span",{key:e,className:Object(r.a)("badge badge--primary",c.a.role)},e))))}}}]);