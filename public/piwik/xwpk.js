!function(){var e="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");Math.uuid=function(r,n){var t,i=e,o=[];if(n=n||i.length,r)for(t=0;t<r;t++)o[t]=i[0|Math.random()*n];else{var a;for(o[8]=o[13]=o[18]=o[23]="-",o[14]="4",t=0;t<36;t++)o[t]||(a=0|16*Math.random(),o[t]=i[19==t?3&a|8:a])}return o.join("")},Math.uuidFast=function(){for(var r,n=e,t=new Array(36),i=0,o=0;o<36;o++)8==o||13==o||18==o||23==o?t[o]="-":14==o?t[o]="4":(i<=2&&(i=33554432+16777216*Math.random()|0),r=15&i,i>>=4,t[o]=n[19==o?3&r|8:r]);return t.join("")},Math.uuidCompact=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var r=16*Math.random()|0,n="x"==e?r:3&r|8;return n.toString(16)})}}(),"object"!=typeof _xwq&&(_xwq=[]),window.xwpk=function(){function e(e){return"string"==typeof e||e instanceof String}function r(e){var r=1*e.substring(1,e.length),n=e.substring(0,1);switch(n){case"s":return 1e3*r;case"h":return 60*r*60*1e3;case"d":return 24*r*60*60*1e3;case"m":return 30*r*24*60*60*1e3;case"y":return 365*r*24*60*60*1e3}}var n,t,i="on";this.init=function(){t=s(),n=new a;for(var e=window._xwq,r=0;r<e.length;r++)o(e[r]);window._xwq=e={},e.push=function(){o(arguments[0])},n.init()};var o=function(){var r,t,i;for(r=0;r<arguments.length;r+=1)i=arguments[r],t=i.shift(),e(t)?n[t].apply(n,i):t.apply(n,i)},a=function(){function e(e){var r=e||navigator.userAgent.toLowerCase(),n=window.opera,t={exploreName:"",exploreVersion:""},i=/micromessenger\/(\d+\.\d)/i.test(r);if(i)return t.exploreName="wechat",t.exploreVersion=RegExp.$1,t;var o=0;if(/(msie\s|trident.*rv:)([\w.]+)/.test(r)){var a=r.match(/(?:msie\s([\w.]+))/),s=r.match(/(?:trident.*rv:([\w.]+))/);o=a&&s&&a[1]&&s[1]?Math.max(1*a[1],1*s[1]):a&&a[1]?1*a[1]:s&&s[1]?1*s[1]:0,t.exploreName="ie",t.exploreVersion=o}var d=/(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(r);d&&(t.exploreName="safari",t.exploreVersion=RegExp.$1||RegExp.$2);var u=/chrome\/(\d+\.\d)/i.test(r)||/crios\/(\d+\.\d)/i.test(r);u&&(t.exploreName="chrome",t.exploreVersion=RegExp.$1);var l=/firefox\/(\d+\.\d)/i.test(r);l&&(t.exploreName="firefox",t.exploreVersion=RegExp.$1);var p=/qqbrowser\/(\d+\.\d)/i.test(r)&&!/micromessenger\/(\d+\.\d)/i.test(r);p&&(t.exploreName="qq",t.exploreVersion=RegExp.$1);var c=/qqnews\/(\d+\.\d)/i.test(r);c&&(t.exploreName="qq news",t.exploreVersion=RegExp.$1);var f=/qq\/(\d+\.\d)/i.test(r);if(f)return t.exploreName="qq app",t.exploreVersion=RegExp.$1,t;var m=/((baidu)|(bidu))browser(\/|\s)(\d\.\d)/i.test(r);m&&(t.exploreName="baidu",t.exploreVersion=RegExp.$5);var v=/baiduboxapp\/((\d\_(\d+\.)+\d)|(\d\.\d))/i.test(r);if(v)return t.exploreName="baidu app",t.exploreVersion=RegExp.$1,t;var x=/ucbrowser\/(\d+\.\d)/i.test(r)||/ucweb\/(\d+\.\d)/i.test(r);x&&(t.exploreName="uc",t.exploreVersion=RegExp.$1);var g=/sogoumse,sogoumobilebrowser\/(\d+\.\d)/i.test(r)||/se (\d+)\.*/i.test(r);g&&(t.exploreName="sogou",t.exploreVersion=RegExp.$1);var h=/liebaofast\/(\d+\.\d)/i.test(r);h&&(t.exploreName="liebao",t.exploreVersion=RegExp.$1);var w=/mxbrowser\/(\d+\.\d)/i.test(r)||/maxthon\/(\d+\.\d)/i.test(r);w&&(t.exploreName="aoyou",t.exploreVersion=RegExp.$1);var w=/2345browser\/(\d+\.\d)/i.test(r);w&&(t.exploreName="2345",t.exploreVersion=RegExp.$1);var b=/ubrowser\/(\d+\.\d)/i.test(r);b&&(t.exploreName="ubrowser",t.exploreVersion=RegExp.$1);var y=/xiaomi\/miuibrowser\/(\d+\.\d)/i.test(r);y&&(t.exploreName="xiaomi",t.exploreVersion=RegExp.$1);var S=/lebrowser\/(\d+\.\d)/i.test(r);S&&(t.exploreName="lvcha",t.exploreVersion=RegExp.$1),!window.navigator.mimeTypes[40]&&window.navigator.mimeTypes.length||(t.exploreName="360",t.exploreVersion="");var O=/opr\/(\d+\.\d)/i.test(r)||/presto\/(\d+\.\d)/i.test(r);return(n&&n.version||O)&&(t.exploreName="opera",t.exploreVersion=n?parseFloat(n.version()):RegExp.$1),t}function r(){var e=navigator.userAgent,r=e.match(/(\(.*?\))+/g)[0],n="Mac68K"==navigator.platform||"MacPPC"==navigator.platform||"Macintosh"==navigator.platform||"MacIntel"==navigator.platform;if(n)return{name:"mac",version:""};var t="X11"==navigator.platform&&!o&&!n;if(t)return{name:"unix",version:""};var i=String(navigator.platform).indexOf("Linux")>-1;if(i){e.indexOf("Android")>-1||e.indexOf("Adr")>-1;return/Android (\d+\.\d)/i.test(r)?{name:"android",version:r.match(/Android (\d+\.\d)/i)[1]}:{name:"linux",version:""}}var o="Win32"==navigator.platform||"Windows"==navigator.platform;if(o){var a=e.indexOf("Windows NT 5.0")>-1||e.indexOf("Windows 2000")>-1;if(a)return{name:"windows",version:"2000"};var s=e.indexOf("Windows NT 5.1")>-1||e.indexOf("Windows XP")>-1;if(s)return{name:"windows",version:"xp"};var d=e.indexOf("Windows NT 5.2")>-1||e.indexOf("Windows 2003")>-1;if(d)return{name:"windows",version:"2003"};var u=e.indexOf("Windows NT 6.0")>-1||e.indexOf("Windows Vista")>-1;if(u)return{name:"windows",version:"vista"};var l=e.indexOf("Windows NT 6.1")>-1||e.indexOf("Windows 7")>-1;if(l)return{name:"windows",version:"7"};var p=e.indexOf("Windows NT 6.2")>-1||e.indexOf("Windows NT 6.3")||e.indexOf("Windows 8")>-1;if(p)return{name:"windows",version:"8"};var c=e.indexOf("Windows NT 10")>-1||e.indexOf("Windows 10")>-1;if(c)return{name:"windows",version:"10"}}var f=e.indexOf("iPhone;")>-1;if(f)return{name:"iPhone IOS",version:r.match(/iPhone OS (\d+\_\d)/i)[1].replace("_",".")};var m=e.indexOf("iPad")>-1;if(m)return{name:"iPad IOS",version:r.match(/iPad OS (\d+\_\d)/i)[1].replace("_",".")};var v=e.indexOf("iPod")>-1;return v?{name:"iPod IOS",version:r.match(/iPhone OS (\d+\_\d)/i)[1].replace("_",".")}:{name:"",version:""}}function n(){if(y.uuid=y.uuid?y.uuid:t,y.title=y.title?y.title:document.title,y.pageUrl=y.pageUrl?y.pageUrl:document.location.href.replace(/(\%22)+/g,"'"),y.pageParameter=y.pageParameter?y.pageParameter:location.search.substr(1).replace(/(\%22)+/g,"'"),y.pageDomain=y.pageDomain?y.pageDomain:document.domain+(window.location.port?":"+window.location.port:""),y.pagePath=y.pagePath?y.pagePath:document.location.pathname,!y.referrerUrl){var n=g();y.referrerUrl=n.referrer,y.referrerDomain=n.domain,y.referrerPath=n.path,y.referrerParameter=n.parameter,y.searchEngine=y.searchEngine?y.searchEngine:m(n.referrer)||"",y.searchKeyword=y.searchKeyword?y.searchKeyword:f(n.referrer)||""}if(y.deviceType=y.deviceType?y.deviceType:x(),!y.osName){var i=r();y.osName=i.name,y.osVersion=i.version}if(!y.exploreName){var a=e();for(key in a)y[key]=a[key]}y.screenPoint=y.screenPoint?y.screenPoint:window.screen.width+"x"+window.screen.height,y.bitrack=y.bitrack?y.bitrack:s()||"",y.siteSearchKeyword=y.siteSearchKeyword?y.siteSearchKeyword:c()||"",y.siteSearchSkuCount=y.siteSearchSkuCount?y.siteSearchSkuCount:p()||"",y.siteSearchTopSku=y.siteSearchTopSku?y.siteSearchTopSku:l()||"",y.customerId=y.customerId?y.customerId:o()||"",y.webSiteSysno=y.webSiteSysno?y.webSiteSysno:d("WebSiteSysNo")||"",y.deliverySysno=y.deliverySysno?y.deliverySysno:d("DeliverySysNo")||"";for(key in S){var u=!1;for(name in y)key==name&&(y[name]=S[key],u=!0);u||(y[key]=S[key])}return"data="+encodeURIComponent(JSON.stringify(y))}function o(){switch(i){case"on":return y.customerId?y.customerId:d("userID")||"";case"off":return y.customerId?y.customerId:""}}function a(){return y.jpushID="",y.appType="",y.netModel="",y.devBrand="",y.appUseStartTime="",y.devUnType="",y.appChannel="",y.appVersion="",y.appUseOper="",y.appInstallTime="",y.devId="",y.token="",y.sysDevId="",y.devReso="",y.appUseEndTime="",y.interval="","data="+JSON.stringify(y)}function s(){var e=location.search.substr(1)||location.hash;if(e.indexOf("_bitrack")==-1)return null;for(var r=e.split("&"),n=0;n<r.length;n++)if(r[n].indexOf("_bitrack")>=0)return r[n].split("=")[1];return null}function l(){if(!y.siteSearchKeyword)return null;if("web"==O){var e=document.getElementById("Content");if(e){var r=e.innerHTML;if(r){var n=r.match(/(product="\d+"\s+data-type="AddCartBtn")|(data-type="AddCartBtn"\s+product="\d+")/g);if(n.length>=1){for(var t=[],i=0;i<n.length&&10!=i;i++){var o=n[i];t.push(o.match(/\d+/))}return t.join(",")}}}}else{var a=document.getElementById("productListUL");if(a){var s=a.innerHTML.match(/id="pdList_product_\d+"/g);if(s.length>=0){for(var d=[],i=0;i<s.length;i++)d.push(s[i].match(/\d+/));return d.join(",")}}}return null}function p(){if(!y.siteSearchKeyword)return null;var e=null;if("web"==O){var r=document.getElementById("SearchBox");if(r){var n=r.innerText;if(n){var t=n.match(/[相关商品]+\d+[个]/);e=t[0]?t[0].match(/\d+/)[0]:null}}}else{var i=document.getElementById("productListUL");if(i){var o=i.getElementsByClassName("buy");o.length>0&&(e=o.length)}}return e}function c(){if("web"==O){for(var e=location.search.substr(1).split("&"),r=0;r<e.length;r++)if(e[r].indexOf("keyword")>=0)return e[r].split("=")[1]}else{var n=document.location.pathname.split("/"),t=n.indexOf("search");if(t>=0)return n[t+1]}return null}function f(e){if(!e)return null;var r=e.split("?")[1],n={test:["wd","word"],baidu:["wd","word"],sogou:["query"],360:["q"],google:[""],yahoo:[""]},t=m(e)||"",i=n[t]||"";if(r&&i)for(var o=r.split("&"),a=0;a<o.length;a++)for(var s=o[a].split("="),d=s.shift(),u=0;u<i.length;u++)if(d==i[u])return s.join("");return null}function m(e){if(!e)return null;var r={"10.10.110.113":"test","baidu.com":"baidu","sogou.com":"sogou","so.com":"360","google.com":"google","google.co.jp":"google","search.yahoo.com":"yahoo"},n=e.split("?")[0];for(var t in r)if(n.indexOf(t)>=0)return v(r[t]),r[t];return null}function v(e){switch(e){case"baidu":if(y.referrerParameter&&y.referrerParameter.indexOf("clk_info")>=0){for(var r=y.referrerParameter.split("&"),n=0;n<r.length;n++)r[n].indexOf("clk_info")>=0&&(r[n]="clk_info=");y.referrerParameter=r.join("&"),y.referrerUrl=y.referrerDomain+y.referrerPath+"?"+y.referrerParameter}break;case"sogou":break;case"360":break;case"google":break;case"yahoo":}}function x(){var e=navigator.userAgent;y.userAgent=e;for(var r=["Android","iPhone","SymbianOS","Windows Phone","iPad","iPod"],n=!0,t=0;t<r.length;t++)if(e.indexOf(r[t])>0){n=!1;break}return n?"pc":"mobile"}function g(){var e,r,n,t,i;if(e=document.referrer.replace(/(\%22)+/g,"'"),e&&(r=e.split("?"),r.length>=1)){n=r[0].split("/")[2]||"";var o=n?r[0].indexOf(n):null;t=r[0].substring(o+n.length),i=r[1]}return{referrer:e||"",domain:n||"",path:t||"",parameter:i||""}}function h(e,r){var n=new Image(1,1);n.onload=function(){iterator=0,"function"==typeof r&&r()};var t="//bitj.benlai.com/Bitj/js/commit_data.do";n.src=t+(t.indexOf("?")<0?"?":"&")+e+"&"+(new Date).getTime()}function w(e){var r,n=null,r=d("_bltja");d("_bitj");r?(n=r.split("|"),n[2]!=n[3]&&(n[2]=n[3]),n[3]=e?e:n[3],n[1]==n[2]&&n[1]==n[3]?y.isNewVisiter=1:y.isNewVisiter=2):(n=[],n[0]=t,n[1]=n[2]=n[3]=e,y.isNewVisiter=1),y.preVisiterTime=n[2],u("_bltja",n.join("|"),"y5"),u("_bitj",n[0],"y5")}function b(e){var r=null,n=d("_bltjb"),i=d("_bltjc");return n||i?(n&&u("_bltjc",n,"s0"),i&&u("_bltjb",i,"s180")):(u("_bltjb",e+"-"+t,"s180"),u("_bltjc",e+"-"+t,"s0"),r=e),n=d("_bltjb"),n&&(y.visitTime=n.split("-")[0],y.visiterId=n),r}var y={},S={},O="web";return{init:function(){var e=(new Date).getTime(),r="";if(y.tjType="pageView","web"==O||"m"==O){var t=b(e);w(t),r=n()}else r=a();h(r)},setAppType:function(e){switch(e){case"m":O=e;break;case"app":O=e;break;default:O="web"}},trackEvent:function(e,r,t){y.eventCat1=e,y.eventCat2=r,y.eventParams=t,y.tjType="event",h(n())},setCustomerId:function(e){y.customerId=e},setCustomerAuto:function(e){i=e},setApiUrl:function(e){apiUrl=e},setSiteId:function(e){y.siteId=e},setParamVal:function(e,r){S[e]=r},setCustomVariable:function(e,r){var n,i,o;if(n=d("_bjtje")){i=n.split("|");for(var a=!0,s=0;s<i.length;s++){var l=i[s].split("=");l[0]==e&&(i[s]=l[0]+"="+l[1],a=!1)}a&&i.push(e+"="+r),o=i.join("|")}else o=t+"|"+e+"="+r;u("_bjtje",o,"y5");var p=o.split("|");p.shift(),y.cv=p.join(";")},trackLink:function(){}}},s=function(){var e=d("_bltja");return e&&e.split("|")[0]?e.split("|")[0]:Math.uuid()},d=function(e){for(var r=document.cookie.split("; "),n=0;n<r.length;n++)if(r[n].split("=")[0]==e)return decodeURIComponent(r[n].split("=")[1]);return null},u=function(e,n,t,i){var o=r(t?t:"d30"),a="";if(o){var s=new Date;s.setTime(s.getTime()+1*o),a=e+"="+encodeURIComponent(n)+";path=/;expires="+s.toGMTString()+(i?";domain="+i:"")}else a=e+"="+encodeURIComponent(n)+";path=/"+(i?";domain="+i:"");document.cookie=a},l={test:function(e,r){console.log("test")}};return this.init(),l}();