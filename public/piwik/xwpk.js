!function(){var e="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");Math.uuid=function(r,n){var t,i=e,o=[];if(n=n||i.length,r)for(t=0;t<r;t++)o[t]=i[0|Math.random()*n];else{var a;for(o[8]=o[13]=o[18]=o[23]="-",o[14]="4",t=0;t<36;t++)o[t]||(a=0|16*Math.random(),o[t]=i[19==t?3&a|8:a])}return o.join("")},Math.uuidFast=function(){for(var r,n=e,t=new Array(36),i=0,o=0;o<36;o++)8==o||13==o||18==o||23==o?t[o]="-":14==o?t[o]="4":(i<=2&&(i=33554432+16777216*Math.random()|0),r=15&i,i>>=4,t[o]=n[19==o?3&r|8:r]);return t.join("")},Math.uuidCompact=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var r=16*Math.random()|0,n="x"==e?r:3&r|8;return n.toString(16)})}}(),"object"!=typeof _xwq&&(_xwq=[]),window.xwpk=function(){function e(e){return"string"==typeof e||e instanceof String}function r(e){var r=1*e.substring(1,e.length),n=e.substring(0,1);switch(n){case"s":return 1e3*r;case"h":return 60*r*60*1e3;case"d":return 24*r*60*60*1e3;case"m":return 30*r*24*60*60*1e3;case"y":return 365*r*24*60*60*1e3}}var n,t,i="on";this.equipmentInfo={},this.init=function(){t=d(),n=new a;for(var e=window._xwq,r=0;r<e.length;r++)o(e[r]);window._xwq=e={},e.push=function(){o(arguments[0])},n.init()};var o=function(){var r,t,i;for(r=0;r<arguments.length;r+=1)i=arguments[r],t=i.shift(),e(t)?n[t].apply(n,i):t.apply(n,i)},a=function(){function e(e){var r=e||navigator.userAgent.toLowerCase(),n=window.opera,t={exploreName:"",exploreVersion:""},i=/micromessenger\/(\d+\.\d)/i.test(r);if(i)return t.exploreName="wechat",t.exploreVersion=RegExp.$1,t;var o=0;if(/(msie\s|trident.*rv:)([\w.]+)/.test(r)){var a=r.match(/(?:msie\s([\w.]+))/),s=r.match(/(?:trident.*rv:([\w.]+))/);o=a&&s&&a[1]&&s[1]?Math.max(1*a[1],1*s[1]):a&&a[1]?1*a[1]:s&&s[1]?1*s[1]:0,t.exploreName="ie",t.exploreVersion=o}var d=/(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(r);d&&(t.exploreName="safari",t.exploreVersion=RegExp.$1||RegExp.$2);var c=/chrome\/(\d+\.\d)/i.test(r)||/crios\/(\d+\.\d)/i.test(r);c&&(t.exploreName="chrome",t.exploreVersion=RegExp.$1);var u=/firefox\/(\d+\.\d)/i.test(r);u&&(t.exploreName="firefox",t.exploreVersion=RegExp.$1);var l=/qqbrowser\/(\d+\.\d)/i.test(r)&&!/micromessenger\/(\d+\.\d)/i.test(r);l&&(t.exploreName="qq",t.exploreVersion=RegExp.$1);var f=/qqnews\/(\d+\.\d)/i.test(r);f&&(t.exploreName="qq news",t.exploreVersion=RegExp.$1);var m=/qq\/(\d+\.\d)/i.test(r);if(m)return t.exploreName="qq app",t.exploreVersion=RegExp.$1,t;var p=/((baidu)|(bidu))browser(\/|\s)(\d\.\d)/i.test(r);p&&(t.exploreName="baidu",t.exploreVersion=RegExp.$5);var g=/baiduboxapp\/((\d\_(\d+\.)+\d)|(\d\.\d))/i.test(r);if(g)return t.exploreName="baidu app",t.exploreVersion=RegExp.$1,t;var g=/alipayclient\/((\d\_(\d+\.)+\d)|(\d\.\d))/i.test(r);if(g)return t.exploreName="alipay",t.exploreVersion=RegExp.$1,t;var v=/ucbrowser\/(\d+\.\d)/i.test(r)||/ucweb\/(\d+\.\d)/i.test(r);v&&(t.exploreName="uc",t.exploreVersion=RegExp.$1);var x=/sogoumse,sogoumobilebrowser\/(\d+\.\d)/i.test(r)||/se (\d+)\.*/i.test(r);x&&(t.exploreName="sogou",t.exploreVersion=RegExp.$1);var h=/liebaofast\/(\d+\.\d)/i.test(r);h&&(t.exploreName="liebao",t.exploreVersion=RegExp.$1);var w=/mxbrowser\/(\d+\.\d)/i.test(r)||/maxthon\/(\d+\.\d)/i.test(r);w&&(t.exploreName="aoyou",t.exploreVersion=RegExp.$1);var w=/2345browser\/(\d+\.\d)/i.test(r);w&&(t.exploreName="2345",t.exploreVersion=RegExp.$1);var b=/ubrowser\/(\d+\.\d)/i.test(r);b&&(t.exploreName="ubrowser",t.exploreVersion=RegExp.$1);var y=/xiaomi\/miuibrowser\/(\d+\.\d)/i.test(r);y&&(t.exploreName="xiaomi",t.exploreVersion=RegExp.$1);var N=/lebrowser\/(\d+\.\d)/i.test(r);N&&(t.exploreName="lvcha",t.exploreVersion=RegExp.$1);var S=/opr\/(\d+\.\d)/i.test(r)||/presto\/(\d+\.\d)/i.test(r);return(n&&n.version||S)&&(t.exploreName="opera",t.exploreVersion=n?parseFloat(n.version()):RegExp.$1),t}function r(){var e=navigator.userAgent;if(!e)return{name:"",version:""};var r=e.indexOf("iPhone;")>-1;if(r)return{name:"iPhone IOS",version:""};var n=e.indexOf("iPad")>-1;if(n)return{name:"iPad IOS",version:""};var t=e.indexOf("iPod")>-1;if(t)return{name:"iPod IOS",version:""};var i="Mac68K"==navigator.platform||"MacPPC"==navigator.platform||"Macintosh"==navigator.platform||"MacIntel"==navigator.platform;if(i)return{name:"mac",version:""};var o=String(navigator.platform).indexOf("Linux")>-1;if(o){e.indexOf("Android")>-1||e.indexOf("Adr")>-1;return/Android (\d+\.\d)/i.test(e)?{name:"android",version:e.match(/Android (\d+\.\d)/i)[1]}:{name:"linux",version:""}}var a="Win32"==navigator.platform||"Windows"==navigator.platform;if(a){var s=e.indexOf("Windows NT 5.0")>-1||e.indexOf("Windows 2000")>-1;if(s)return{name:"windows",version:"2000"};var d=e.indexOf("Windows NT 5.1")>-1||e.indexOf("Windows XP")>-1;if(d)return{name:"windows",version:"xp"};var c=e.indexOf("Windows NT 5.2")>-1||e.indexOf("Windows 2003")>-1;if(c)return{name:"windows",version:"2003"};var u=e.indexOf("Windows NT 6.0")>-1||e.indexOf("Windows Vista")>-1;if(u)return{name:"windows",version:"vista"};var l=e.indexOf("Windows NT 6.1")>-1||e.indexOf("Windows 7")>-1;if(l)return{name:"windows",version:"7"};var f=e.indexOf("Windows NT 6.2")>-1||e.indexOf("Windows NT 6.3")||e.indexOf("Windows 8")>-1;if(f)return{name:"windows",version:"8"};var m=e.indexOf("Windows NT 10")>-1||e.indexOf("Windows 10")>-1;if(m)return{name:"windows",version:"10"}}var p="X11"==navigator.platform&&!a&&!i;return p?{name:"unix",version:""}:{name:"",version:""}}function n(){if(S.version=2,S.title=S.title||document.title||"",S.pageUrl=S.pageUrl||encodeURIComponent(decodeURIComponent(document.location.href)||""),S.screenPoint=S.screenPoint||window.screen.width+"x"+window.screen.height,S.bitrack=S.bitrack||a()||"",S.siteSearchKeyword=S.siteSearchKeyword||encodeURIComponent(v()||""),S.siteSearchSkuCount=S.siteSearchSkuCount||g()||"",S.siteSearchTopSku=S.siteSearchTopSku||d()||"",S.customerId=S.customerId||o()||"",S.webSiteId=S.webSiteId||l("WebSiteSysNo")||"",S.cityId=S.cityId||l("DeliverySysNo")||"",null==S.osName){var n;try{n=r()}catch(e){S.errorMsg="getOS-----:"+encodeURIComponent(e.message),n={name:"",version:""}}S.osName=n.name,S.osVersion=n.version}if("app"==I)S.visitTime=S.visitTime||(new Date).getTime();else{if(x(),S.uuid=S.uuid||t||"",null==S.visitTime){var i=l("_bltjb");i&&(S.visitTime=i,S.visiterId=i+"-"+t)}if(S.pageParameter=S.pageParameter||encodeURIComponent(location.search.substr(1)||""),S.pageDomain=S.pageDomain||document.domain||"",S.pagePath=S.pagePath||encodeURIComponent(document.location.pathname||""),null==S.referrerUrl){var c=w(l("bi_refer"));S.referrerUrl=encodeURIComponent(c.referrer),S.referrerDomain=c.domain,S.referrerPath=encodeURIComponent(c.path),S.referrerParameter=""}if(null==S.searchEngine){var u=null;try{u=s(),S.searchEngine=u.getSearchEngine()||"",S.searchKeyword=encodeURIComponent(u.getSearchKeyword())||"",S.searchType=u.getSearchType()||"",S.source=S.pageDomain==S.referrerDomain?"b":u.getSource()||""}catch(e){S.errorMsg="engineParsing-----:"+encodeURIComponent(e.message)}}if(S.deviceType=S.deviceType||h(),null==S.exploreName){var f=e();for(key in f)S[key]=f[key]}}for(key in T){var m=!1;for(name in S)key==name&&(S[name]=T[key],m=!0);m||(S[key]=T[key])}return"data="+encodeURIComponent(JSON.stringify(S))}function o(){switch(i){case"on":return S.customerId||l("userID")||"";case"off":return S.customerId||"";default:return""}}function a(){var e=/_bitrack=((\d)+)/i.test(decodeURIComponent(location.search.substr(1)+location.hash));return e?RegExp.$1:null}function d(){if(!S.siteSearchKeyword)return null;var e=null,r=null;if("web"==I){e=document.getElementById("Content"),e&&e.innerHTML&&(r=e.innerHTML.match(/product=" *\d+"/g),r.length&&(r=r.slice(0,20).join(","),r=r.match(/\d+/g).join(",")));try{window.setTimeout(function(){$&&$().delegate&&$(e).delegate(".box","click",["IMG","FONT","SPAN"],m)},1)}catch(e){S.errorMsg="getSiteSearchTopSku------"+encodeURIComponent(e.message)}}else{e=document.getElementById("thelist"),e&&e.innerHTML&&(r=e.innerHTML.match(/addProductToCart\(\d+/g),r.length>0&&(r=r.slice(0,20).join(","),r=r.match(/\d+/g).join(",")));try{window.setTimeout(function(){$&&$().delegate&&$(e).delegate("dl","click",m)},1)}catch(e){S.errorMsg="getSiteSearchTopSku------"+encodeURIComponent(e.message)}}return r}function m(e){if(e=e||window.event,e.target){var r=$(e.target),t="",i="",o="",a="";if("web"==I){if(e.data.indexOf(e.target.nodeName)<0)return;var s=r.parent().attr("href");s.indexOf("javascript")<0&&(a=r.parent().attr("href")),t=r.parents(".box").html(),i=t.match(/<p class="name">.*?(<font>(.*?)<\/font>).*?<\/p>?/)[2],o=t.match(/product=['"]*\s*(\d+)\s*['"]*/)[1]}else{if("A"==e.target.nodeName&&r.hasClass("btn"))return;for(var d="DL"==e.target.nodeName?r:r.parents("DL"),c=d.children("a"),u=0;u<c.length;u++){var l=$(c[u]);l.attr("href").indexOf("javascript")<0&&(a=l.attr("href"))}t=d.html(),i=t.match(/<p(.*?)>(.*?)<\/p>/)[2],o=t.match(/addProductToCart\((\d+)/)[1]}a&&(S.tjType="event",S.eventCat1="搜索商品",S.eventCat2="商品点击",S.eventParams={goodsName:encodeURIComponent(i),sku:o,url:encodeURIComponent(a)},b(n()))}}function g(){if(!S.siteSearchKeyword)return null;var e=null;if("web"==I){var r=document.getElementById("SearchBox");if(r){var n=r.innerText;if(n){var t=n.match(/[相关商品]+\s*\d+\s*[个]/);e=t[0]?t[0].match(/\d+/)[0]:null}}}else{var i=document.getElementById("scroller");if(i&&i.innerHTML){var o=i.innerHTML.match(/class="price"/g);e=o.length>0?o.length:null}}return e}function v(){if("web"==I){for(var e=location.search.substr(1).split("&"),r=0;r<e.length;r++)if(e[r].indexOf("keyword")>=0)return e[r].split("=")[1]}else{var n=document.location.pathname.split("/"),t=n.indexOf("search");if(t>=0)return n[t+1]}return null}function x(){var e=(new Date).getTime(),r=N(e);y(r)}function h(){var e=navigator.userAgent;S.userAgent=e;for(var r=["Android","iPhone","SymbianOS","Windows Phone","iPad","iPod"],n=!0,t=0;t<r.length;t++)if(e.indexOf(r[t])>0){n=!1;break}return n?"pc":"mobile"}function w(e){var r,n,t,i,o;if(r=e||document.referrer||"",r&&(n=r.split("?"),n.length>=1)){t=n[0].split("/")[2]||"";var a=t?n[0].indexOf(t):null;i=n[0].substring(a+t.length),o=n[1]}return{referrer:r||"",domain:t||"",path:i||"",parameter:o||""}}function b(e,r){var n="//bitj.benlai.com/Bitj/js/commit_data.do",t=new Image(1,1);t.onload=function(){iterator=0,"function"==typeof r&&r()},t.src=n+(n.indexOf("?")<0?"?":"&")+e+"&"+(new Date).getTime()}function y(e){var r=[],n="_bltja",t=l(n);if(t){if(r=t.split("|"),r.length>3){r.shift();for(var i=0;i<r.length;i++)r[i]||(r[i]=e)}e!=r[2]&&(r[1]=r[2],r[2]=e),u(c(r[2]),c(r[0]))?S.isNewVisiter=2:S.isNewVisiter=1}else r=[e,e,e],S.isNewVisiter=1;S.preVisiterTime=r[1],f(n,r.join("|"),"y5")}function N(e){var r=null,n="s180",t="s0",i=l("_bltjb"),o=l("_bltjc");return i||o?(i&&(isNaN(new Date(Number(i)).getTime())&&(i=i.split("-")[0]),f("_bltjc",i,t),r=i),o&&(isNaN(new Date(Number(o)).getTime())&&(o=o.split("-")[0]),f("_bltjb",o,n),r=o)):(f("_bltjb",e,n),f("_bltjc",e,t),r=e),Number(r)}var S={},T={},I="web";return{init:function(){S.tjType="pageView",b(n())},setEquipmentInfo:function(e){S.uuid=e.uuid||"",S.visiterId=e.visiterId||"",S.referrerUrl=e.referrerUrl||"",S.jpushID=e.jpushID||"",S.netModel=e.netModel||"",S.devBrand=e.devBrand||"",S.appChannel=e.appChannel||"",S.appVersion=e.appVersion||"",S.appInstallTime=e.appInstallTime||""},setAppType:function(e){switch(e){case"m":I=e;break;case"app":I=e;break;default:I="web"}},trackEvent:function(e,r,t){S.eventCat1=e,S.eventCat2=r;for(var i in t)p(t[i],"String")&&(t[i]=encodeURIComponent(t[i]));S.eventParams=t,S.tjType="event",b(n())},setCustomerId:function(e){S.customerId=e},setCustomerAuto:function(e){i=e},setApiUrl:function(e){apiUrl=e},setSiteId:function(e){S.siteId=e},setParamVal:function(e,r){T[e]=r},setCustomVariable:function(e,r){var n=[e,r];S.cv=n.join(";"),f("_bjtje",n.join("|"),"y5")},trackLink:function(){}}},s=function(e){function r(){if(biRefer=l("bi_refer")||document.referrer||"",!biRefer)return!1;f("bi_refer","","s0",""),f("bi_refer","","s0","benlai.com"),m("bi_refer");var e=biRefer.split("?");for(var r in n)if(e[0].indexOf(r)>=0){o=n[r];break}if(!o)return!1;var d=i[o];if(d)e:for(var c in d)for(var u=0;u<d[c].length;u++)if(e[0].indexOf(d[c][u])>=0){s=c;break e}s=s||"seo";var p=t[o];if(e[1]&&p){var g=e[1].split("&");e:for(var u=0;u<g.length;u++)for(var v=g[u].split("="),x=v.shift(),h=0;h<p.length;h++)if(x==p[h]){a=v.join("");break e}}}var n,t,i,o="",a="",s="";return n={"baidu.com":"baidu","sogou.com":"sogou","so.com":"360","google.com":"google","google.co.jp":"google","search.yahoo.com":"yahoo"},t={baidu:["wd","word"],sogou:["query"],360:["q"],google:[""],yahoo:[""]},i={baidu:{brand:["bzclk.baidu.com/adrc.php","m.baidu.com/s"],sem:["baidu.com/baidu.php"]},sogou:{brand:["ctb.brand.sogou.com"],sem:["www.sogou.com/bill_cpc"]},360:{brand:["click.dsp.com"],sem:["e.tf.360.cn"]},google:null,yahoo:null},r(),{getSearchEngine:function(){return o},getSearchKeyword:function(){return a},getSearchType:function(){return s},getSource:function(){var e="";if(biRefer)if(o)e="s";else{var r=biRefer.split("?")[0];e=r.indexOf("benlai.com")>=0?"b":"w"}return e}}},d=function(){var e,r;return r=l("_bitj"),e=r?r:Math.uuid(),f("_bitj",e,"y5"),e},c=function(e){var r=Number(e),n=null;return n=isNaN(r)?new Date(e):new Date(r),n.getFullYear()+"/"+(n.getMonth()+1)+"/"+n.getDate()},u=function(e,r){var n=new Date(e).getTime(),t=new Date(r).getTime(),i=864e5,o=null;if(!isNaN(n)&&!isNaN(t)){var a=Math.floor(n/i),s=Math.floor(t/i);o=a-s}return o},l=function(e){for(var r=document.cookie.split("; "),n=0;n<r.length;n++)if(r[n].split("=")[0]==e)return decodeURIComponent(r[n].split("=")[1]);return null},f=function(e,n,t,i){var o=r(t?t:"d30"),a="",s=";domain="+(i||(""==i?"":document.domain));if(o){var d=new Date;d.setTime(d.getTime()+1*o),a=e+"="+encodeURIComponent(n)+";path=/;expires="+d.toGMTString()+s}else a=e+"="+encodeURIComponent(n)+";path=/"+s;document.cookie=a},m=function(e){var r=new Date;r.setTime(r.getTime()-1);var n=l(e);null!=n&&(document.cookie=e+"="+n+";expires="+r.toGMTString())},p=function(e,r){switch(r){case"Object":return"[object Object]"===Object.prototype.toString.call(e);case"Array":return"[object Array]"===Object.prototype.toString.call(e);case"String":return"[object String]"===Object.prototype.toString.call(e);case"Number":return"[object Number]"===Object.prototype.toString.call(e);default:return!1}},g={test:function(e,r){console.log("test")}};return this.init(),g}();