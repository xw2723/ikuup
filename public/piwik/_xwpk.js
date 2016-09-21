
(function() {
    // Private array of chars to use
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    Math.uuid = function (len, radix) {
        var chars = CHARS, uuid = [], i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random()*16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    };

    // A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
    // by minimizing calls to random()
    Math.uuidFast = function() {
        var chars = CHARS, uuid = new Array(36), rnd=0, r;
        for (var i = 0; i < 36; i++) {
            if (i==8 || i==13 ||  i==18 || i==23) {
                uuid[i] = '-';
            } else if (i==14) {
                uuid[i] = '4';
            } else {
                if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
                r = rnd & 0xf;
                rnd = rnd >> 4;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
        return uuid.join('');
    };

    // A more compact, but less performant, RFC4122v4 solution:
    Math.uuidCompact = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    };
})();

if (typeof _xwq !== 'object') {
    _xwq = [];
}

window.xwpk = (function(){
    var self = this,
        uintCookie,             //cookie工具
        eventGenerator,         //触发器
        customerAuto = "on",   //设置customerId是否自动从cookie中获取，默认on自动
        uuid;                   //唯一标识

    this.init = function(){
        uuid = getUUID();
        eventGenerator = new Generator();

        var h = window["_xwq"];
        for(var i=0;i<h.length;i++){
            apply(h[i]);
        }
        window["_xwq"] = h = {};
        h.push = function() {
            apply(arguments[0]);
        };

        eventGenerator.init();
    };

    /**
     * 根据参数执行对应函数
     */
    var apply = function(){
        var i, f, parameterArray;
        for (i = 0; i < arguments.length; i += 1) {
            parameterArray = arguments[i];
            f = parameterArray.shift();

            if (isString(f)) {
                eventGenerator[f].apply(eventGenerator, parameterArray);
            } else {
                f.apply(eventGenerator, parameterArray);
            }
        }
    };

    /**
     * 判断是不是字符串类型
     * @param property
     * @returns {boolean}
     */
    function isString(property) {
        return typeof property === 'string' || property instanceof String;
    }

    /**
     *  格式化时间序列
     * @param timeNumber
     * @returns {string}
     */
    function getTimeFormat(timeNumber){
        var time = new Date(timeNumber);
        return time.getFullYear() +"/"+ (time.getMonth()+1) +"/"+ time.getDate();
    }

    /**
     * 事件触发器
     * @returns {{trackEvent: Function}}
     * @constructor
     */
    var Generator = function(){
        //参数列表
        var params = {};
        //优先级参数列表
        var mainParams = {};
        //web站，m站，app应用，默认web站
        var appType = "web" || "m" || "app";

        /**
         * 获取浏览器信息
         * @returns {{b_n: string, b_v: number}}
         */
        function getBrowserInfo(userAgent){
            var agent = userAgent || navigator.userAgent.toLowerCase(),
                opera = window.opera,
                browser = {
                    exploreName: "",
                    exploreVersion: ""
                };

            var version = 0;
            //ie
            if (/(msie\s|trident.*rv:)([\w.]+)/.test(agent)) {
                var v1 = agent.match(/(?:msie\s([\w.]+))/);
                var v2 = agent.match(/(?:trident.*rv:([\w.]+))/);
                if (v1 && v2 && v1[1] && v2[1]) {
                    version = Math.max(v1[1] * 1, v2[1] * 1);
                } else if (v1 && v1[1]) {
                    version = v1[1] * 1;
                } else if (v2 && v2[1]) {
                    version = v2[1] * 1;
                } else {
                    version = 0;
                }

                browser.exploreName = "ie";
                browser.exploreVersion = version;
            }

            //safari
            //var isSafari = /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(agent) && !/chrome/i.test(agent) && !/crios\/(\d+\.\d)/i.test(agent);
            var isSafari = /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(agent);
            if (isSafari) {
                browser.exploreName = "safari";
                browser.exploreVersion = (RegExp['\x241'] || RegExp['\x242']);
            }

            //chrome
            var isChrome = /chrome\/(\d+\.\d)/i.test(agent) || /crios\/(\d+\.\d)/i.test(agent);
            if (isChrome) {
                browser.exploreName = "chrome";
                browser.exploreVersion = RegExp['\x241'];
            }

            //firefox
            var isFirefox = /firefox\/(\d+\.\d)/i.test(agent);
            if (isFirefox) {
                browser.exploreName = "firefox";
                browser.exploreVersion = RegExp['\x241'];
            }

            //360
            if((window.navigator.mimeTypes[40] || !window.navigator.mimeTypes.length)){
                browser.exploreName = "360";
                browser.exploreVersion = "";
            }

            //QQ browser
            var isQQ_pc = /qqbrowser\/(\d+\.\d)/i.test(agent) && !/micromessenger\/(\d+\.\d)/i.test(agent);
            if (isQQ_pc) {
                browser.exploreName = "qq";
                browser.exploreVersion = RegExp['\x241'];
            }

            //QQ 新闻app
            var isQQ_news = /qqnews\/(\d+\.\d)/i.test(agent);
            if (isQQ_news) {
                browser.exploreName = "qq news";
                browser.exploreVersion = RegExp['\x241'];
            }

            //QQ app
            var isQQ_app = /qq\/(\d+\.\d)/i.test(agent);
            if (isQQ_app) {
                browser.exploreName = "qq app";
                browser.exploreVersion = RegExp['\x241'];
            }

            //micromessenger 微信 app
            var isWechat = /micromessenger\/(\d+\.\d)/i.test(agent);
            if (isWechat) {
                browser.exploreName = "wechat";
                browser.exploreVersion = RegExp['\x241'];
            }

            //baidu browser
            var isBaidu = /((baidu)|(bidu))browser(\/|\s)(\d\.\d)/i.test(agent);
            if (isBaidu) {
                browser.exploreName = "baidu";
                browser.exploreVersion = RegExp['\x245'];
            }

            //baidu app
            var isBaidu_app = /baiduboxapp\/((\d\_(\d+\.)+\d)|(\d\.\d))/i.test(agent);
            if (isBaidu_app) {
                browser.exploreName = "baidu app";
                browser.exploreVersion = RegExp['\x241'];
            }

            //ucbrowser
            var isUC = /ucbrowser\/(\d+\.\d)/i.test(agent) || /ucweb\/(\d+\.\d)/i.test(agent);
            if (isUC) {
                browser.exploreName = "uc";
                browser.exploreVersion = RegExp['\x241'];
            }

            //搜狗浏览器`SE 2.X
            var isSogou = /sogoumse,sogoumobilebrowser\/(\d+\.\d)/i.test(agent) || /se (\d+)\.*/i.test(agent);
            if (isSogou) {
                browser.exploreName = "sogou";
                browser.exploreVersion = RegExp['\x241'];
            }

            //猎豹
            var isLB = /liebaofast\/(\d+\.\d)/i.test(agent);
            if (isLB) {
                browser.exploreName = "liebao";
                browser.exploreVersion = RegExp['\x241'];
            }

            //MxBrowser mxbrowser 遨游
            var isAY = /mxbrowser\/(\d+\.\d)/i.test(agent) || /maxthon\/(\d+\.\d)/i.test(agent);
            if (isAY) {
                browser.exploreName = "aoyou";
                browser.exploreVersion = RegExp['\x241'];
            }

            //2345浏览器
            var isAY = /2345browser\/(\d+\.\d)/i.test(agent);
            if (isAY) {
                browser.exploreName = "2345";
                browser.exploreVersion = RegExp['\x241'];
            }

            //ubrowser
            var isU = /ubrowser\/(\d+\.\d)/i.test(agent);
            if (isU) {
                browser.exploreName = "ubrowser";
                browser.exploreVersion = RegExp['\x241'];
            }

            //小米浏览器
            var isXiaomi = /xiaomi\/miuibrowser\/(\d+\.\d)/i.test(agent);
            if (isXiaomi) {
                browser.exploreName = "xiaomi";
                browser.exploreVersion = RegExp['\x241'];
            }

            //绿茶浏览器
            var isLe = /lebrowser\/(\d+\.\d)/i.test(agent);
            if (isLe) {
                browser.exploreName = "lvcha";
                browser.exploreVersion = RegExp['\x241'];
            }

            // Opera
            var isOpera = /opr\/(\d+\.\d)/i.test(agent) || /presto\/(\d+\.\d)/i.test(agent);
            if ((!!opera && opera.version) || isOpera){
                browser.exploreName = "opera";
                browser.exploreVersion = opera ? parseFloat(opera.version()) : RegExp['\x241'];
            }

            return browser;
        }

        /**
         * 获取本地操作系统信息
         * @returns {*}
         */
        function getOS() {
            var sUserAgent = navigator.userAgent;
            var infoOS = sUserAgent.match(/(\(.*?\))+/g)[0];

            var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
            if (isMac) return {
                name: "mac",
                version: ""
            };

            var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
            if (isUnix) return {
                name: "unix",
                version: ""
            };

            var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
            if (isLinux){
                //["(Linux; Android 5.1; OPPO R9tm Build/LMY47I)", "(KHTML, like Gecko)"]
                var isAndroid = sUserAgent.indexOf('Android') > -1 || sUserAgent.indexOf('Adr') > -1;
                if( /Android (\d+\.\d)/i.test(infoOS) ) return {
                    name: "android",
                    version: infoOS.match(/Android (\d+\.\d)/i)[1]
                };
                else return {
                    name: "linux",
                    version: ""
                };
            }

            var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
            if (isWin) {
                var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
                if (isWin2K) return {
                    name: "windows",
                    version: "2000"
                };
                var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
                if (isWinXP) return {
                    name: "windows",
                    version: "xp"
                };
                var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
                if (isWin2003) return {
                    name: "windows",
                    version: "2003"
                };
                var isWinVista= sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
                if (isWinVista) return {
                    name: "windows",
                    version: "vista"
                };
                var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
                if (isWin7) return {
                    name: "windows",
                    version: "7"
                };
                var isWin8 = sUserAgent.indexOf("Windows NT 6.2") > -1 || sUserAgent.indexOf("Windows NT 6.3") || sUserAgent.indexOf("Windows 8") > -1;
                if (isWin8) return {
                    name: "windows",
                    version: "8"
                };
                var isWin10 = sUserAgent.indexOf("Windows NT 10") > -1 || sUserAgent.indexOf("Windows 10") > -1;
                if (isWin10) return {
                    name: "windows",
                    version: "10"
                };
            }

            var isIphone = sUserAgent.indexOf("iPhone;") > -1;
            if(isIphone) return {
                name: "iPhone IOS",
                version: infoOS.match(/iPhone OS (\d+\_\d)/i)[1].replace("_",".")
            };
            var isIpad = sUserAgent.indexOf("iPad") > -1;
            if(isIpad) return {
                name: "iPad IOS",
                version: infoOS.match(/iPad OS (\d+\_\d)/i)[1].replace("_",".")
            };
            var isIpod = sUserAgent.indexOf("iPod") > -1;
            if(isIpod) return {
                name: "iPod IOS",
                version: infoOS.match(/iPhone OS (\d+\_\d)/i)[1].replace("_",".")
            };

            return {
                name: "",
                version: ""
            };
        }

        /**
         * 获取请求参数
         * @returns {string}
         */
        function getRequest(){
            //唯一标识
            params["uuid"] = params["uuid"] ? params["uuid"] : uuid;

            params["pageUrl"] =  params["pageUrl"] ? params["pageUrl"] : document.location.href;
            params["pageDomain"] = params["pageDomain"] ? params["pageDomain"] : (document.domain + (window.location.port?":"+window.location.port:""));
            params["pagePath"] = params["pagePath"] ? params["pagePath"] : document.location.pathname;
            params["title"] = params["title"] ? params["title"] : document.title;
            params["pageParameter"] = params["pageParameter"] ? params["pageParameter"] : location.search.substr(1);

            if(!params["referrerUrl"]){
                var referrer = getDomainPathParameter();
                params["referrerUrl"] = referrer.referrer;
                params["referrerDomain"] = referrer.domain;
                params["referrerPath"] = referrer.path;
                params["referrerParameter"] = referrer.parameter;

                //来源搜索引擎类型
                params["searchEngine"] = params["searchEngine"] ? params["searchEngine"] : (getSearchSource(referrer.referrer)||"");
                //搜索关键字
                params["searchKeyword"] = params["searchKeyword"] ? params["searchKeyword"] : (getSearchKeyword(referrer.referrer)||"");
            }

            //pc or mobile
            params["deviceType"] = params["deviceType"] ? params["deviceType"] : getDeviceType();

            //操作系统
            if(!params["osName"]){
                var infoOS = getOS();
                params["osName"] = infoOS.name;
                params["osVersion"] = infoOS.version;
            }

            //浏览器信息
            if(!params["exploreName"]){
                var browserInfo = getBrowserInfo();
                for(key in browserInfo){
                    params[key] = browserInfo[key];
                }
            }

            //分辨率
            params["screenPoint"] = params["screenPoint"] ? params["screenPoint"] : (window.screen.width +"x"+ window.screen.height);

            //获取活动关键字
            params["bitrack"] = params["bitrack"] ? params["bitrack"] : (getBitrack()||"");

            //站内搜索关键词
            params["siteSearchKeyword"] = params["siteSearchKeyword"] ? params["siteSearchKeyword"] : (getSiteSearchKeyword()||"");
            //站内搜索SKU数
            params["siteSearchSkuCount"] = params["siteSearchSkuCount"] ? params["siteSearchSkuCount"] : (getSiteSearchSKUCount()||"");
            //站内搜索结果的前10个sku编号
            params["siteSearchTopSku"] = params["siteSearchTopSku"] ? params["siteSearchTopSku"] : (getSiteSearchTopSku()||"");

            //获取客户sysno
            params["customerId"] = params["customerId"] ? params["customerId"] : (getCustomerId()||"");
            //获取站点id
            params["webSiteSysno"] = params["webSiteSysno"] ? params["webSiteSysno"] : (getCookie("WebSiteSysNo")||"");
            //获取城市id
            params["deliverySysno"] = params["deliverySysno"] ? params["deliverySysno"] : (getCookie("DeliverySysNo")||"");

            for(key in mainParams){
                var isExist = false;
                for(name in params){
                    if(key == name){
                        params[name] = mainParams[key];
                        isExist = true;
                    }
                }
                if(!isExist){
                    params[key] = mainParams[key];
                }
            }

            return "data="+encodeURIComponent(JSON.stringify(params));
        }

        /**
         * 获取customerId
         * 根据customerAuto的 on 或者 off来开启是否自动获取
         */
        function getCustomerId(){
            switch (customerAuto){
                case "on":
                    return params["customerId"] ? params["customerId"] : (getCookie("userID")||"");
                case "off":
                    return params["customerId"] ? params["customerId"] : "";
                default :
                    break;
            }
        }

        /**
         * 获取设备信息参数
         * @returns {string} data={}
         */
        function getEquipmentInfo(){
            //推送号
            params["jpushID"] = "";

            //设备类型
            params["appType"] = "";

            //网络模式
            params["netModel"] = "";

            //设备品牌
            params["devBrand"] = "";

            //APP使用开始时间
            params["appUseStartTime"] = "";

            //设备型号
            params["devUnType"] = "";

            //APP渠道
            params["appChannel"] = "";

            //app版本
            params["appVersion"] = "";

            //操作系统
            params["appUseOper"] = "";

            //安装时间
            params["appInstallTime"] = "";

            //设备ID
            params["devId"] = "";

            //客户端token即devid_time
            params["token"] = "";

            //系统内部生成的设备号
            params["sysDevId"] = "";

            //设备分辨率
            params["devReso"] = "";

            //app使用结束时间
            params["appUseEndTime"] = "";

            //app使用时间间隔
            params["interval"] = "";

            return "data="+JSON.stringify(params);
        }

        /**
         * 获取活动参数 _bitrack
         * 暂定web站和m站一致取法
         * @returns {*}
         */
        function getBitrack(){
            var param = location.search.substr(1) || location.hash;
            if(param.indexOf("_bitrack")==-1) return null;

            var pms = param.split("&");
            for(var i=0;i<pms.length;i++){
                if(pms[i].indexOf("_bitrack")>=0){
                    return pms[i].split("=")[1];
                }
            }
            return null;
        }

        /**
         * sku top10编号 page15
         * @returns {*}
         */
        function getSiteSearchTopSku(){
            if(!params["siteSearchKeyword"]) return null;

            if(appType == "web"){
                var listBox = document.getElementById("Content");
                if(listBox){
                    var htmlstr = listBox.innerHTML;
                    if(htmlstr){
                        var itemRegs = htmlstr.match(/(product="\d+"\s+data-type="AddCartBtn")|(data-type="AddCartBtn"\s+product="\d+")/g);
                        if(itemRegs.length>=1){
                            var tops = [];
                            for(var i=0;i<itemRegs.length;i++){
                                if(i==10) break;
                                var n =  itemRegs[i];
                                tops.push(n.match(/\d+/));
                            }
                            return tops.join(",");
                        }
                    }
                }
            }else{
                var goodsBox = document.getElementById("productListUL");
                if(goodsBox){
                    var goodsIds = goodsBox.innerHTML.match(/id="pdList_product_\d+"/g);
                    if(goodsIds.length>=0){
                        var goodsSKU = [];
                        for(var i=0;i<goodsIds.length;i++){
                            goodsSKU.push( goodsIds[i].match(/\d+/) );
                        }
                        return goodsSKU.join(",");
                    }
                }
            }

            return null;
        }

        /**
         * sku总数
         * @returns {*}
         */
        function getSiteSearchSKUCount(){
            if(!params["siteSearchKeyword"]) return null;

            var count = null;
            if(appType == "web"){
                var searchBox = document.getElementById("SearchBox");
                if(searchBox){
                    var searchBoxText = searchBox.innerText;
                    if(searchBoxText){
                        var regs = searchBoxText.match(/[相关商品]+\d+[个]/);
                        count = regs[0]?regs[0].match(/\d+/)[0]:null;
                    }
                }
            }else{
                var goodsBox = document.getElementById("productListUL");
                if(goodsBox){
                    var items = goodsBox.getElementsByClassName("buy");
                    if(items.length>0){
                        count = items.length;
                    }
                }
            }
            return count;
        }

        /**
         * 获取站内搜索关键词
         * @param paramsStr
         * @returns {*}
         */
        function getSiteSearchKeyword(){
            if(appType == "web"){   //web站
                var pms = location.search.substr(1).split("&");
                for(var i=0;i<pms.length;i++){
                    if(pms[i].indexOf("keyword")>=0){
                        return pms[i].split("=")[1];
                    }
                }
            }else{  //m站
                var paths = document.location.pathname.split("/");
                var idx = paths.indexOf("search");
                if(idx>=0){
                    return paths[idx+1];
                }
            }
            return null
        }

        /**
         * 获取搜索引擎关键词
         * @param path
         * @returns {*}
         */
        function getSearchKeyword(path){
            if(!path) return null;

            var paths = path.split("?")[1],
                typeTokey = {
                    "baidu": "wd",
                    "sogou": "query",
                    "360": "q",
                    "google": "",
                    "yahoo": ""
                },
                searchType = getSearchSource(path) || "",
                searchKey = typeTokey[searchType] || "";

            if(paths && searchKey){
                var pms = paths.split("&");
                for(var i=0;i<pms.length;i++){
                    var pmses = pms[i].split("=");
                    var pasKey = pmses.shift();     //删除属性名
                    if(pasKey == searchKey){
                        return pmses.join("");
                    }
                }
            }
            return null;
        }

        /**
         * 获取来源搜索引擎类型
         * @param path
         * @returns {*}
         */
        function getSearchSource(path){
            if(!path) return null;

            var type = "",
                source = {
                    "baidu.com": "baidu",
                    "sogou.com": "sogou",
                    "so.com": "360",
                    "google.com": "google",
                    "google.co.jp": "google",
                    "search.yahoo.com": "yahoo"
                };

            var url = path.split("?")[0];
            for(var key in source){
                if(url.indexOf(key)>=0){
                    disposeSEParams(source[key]);
                    return source[key];
                }
            }

            return null;
        }

        /**
         * 处理搜索引擎的特殊参数
         * @param type
         */
        function disposeSEParams(type){
            switch (type){
                case "baidu":
                    if(params["referrerParameter"] && params["referrerParameter"].indexOf("clk_info")>=0){
                        var pms = params["referrerParameter"].split("&");
                        for(var i=0;i<pms.length;i++){
                            if(pms[i].indexOf("clk_info")>=0){
                                pms[i] = "clk_info=";
                            }
                        }
                        params["referrerParameter"] = pms.join("&");
                        params["referrerUrl"] = params["referrerDomain"] + params["referrerPath"] +"?"+ params["referrerParameter"];
                    }
                    break;
                case "sogou":
                    break;
                case "360":
                    break;
                case "google":
                    break;
                case "yahoo":
                    break;
            }
        }

        /**
         * 判断设备类型
         * @returns {string}
         */
        function getDeviceType(){
            var userAgentInfo = navigator.userAgent;

            //将userAgent输出，查看未知系统
            params["userAgent"] = userAgentInfo;

            var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag?"pc":"mobile";
        }

        /**
         * 获取referrer url中的响应数据
         * @returns {{referrer: (string|*), domain: *, path: *, parameter: *}}
         */
        function getDomainPathParameter(){
            var referrer,urls,domain,path,parameter;

            referrer = document.referrer;
            if(referrer){
                urls = referrer.split("?");
                if(urls.length>=1){
                    domain = urls[0].split("/")[2] || "";
                    var idx = domain?urls[0].indexOf(domain):null;
                    path = urls[0].substring(idx+domain.length);
                    parameter = urls[1];
                }
            }
            return {
                referrer: referrer||"",
                domain: domain||"",
                path: path||"",
                parameter: parameter||""
            };
        }

        /**
         * 发送参数到服务器
         * 模拟图片请求
         * 格式：uuid|首次访问时间|上次访问时间|本次访问时间
         * @param request
         * @param callback
         */
        function sendRequest(request, callback){
            var image = new Image(1, 1);
            image.onload = function () {
                iterator = 0; // To avoid JSLint warning of empty block
                if (typeof callback === 'function') { callback(); }
            };
            var apiUrl = "//bitj.benlai.com/Bitj/js/commit_data.do";
            //var apiUrl = "//10.10.110.113:3000/piwik/xwpk";

            image.src = apiUrl + (apiUrl.indexOf('?') < 0 ? '?' : '&') + request +"&"+ new Date().getTime();
        }

        /**
         * 设置唯一访问cookie
         * @constructor
         */
        function setOnlyAccessCookie(newTime){
            var bltja, bltjas=null,
            bltja = getCookie("_bltja"),
            bitj = getCookie("_bitj");

            if(bltja){
                bltjas = bltja.split("|");
                if(bltjas[2] != bltjas[3]){
                    bltjas[2] = bltjas[3];
                }
                bltjas[3] = newTime?newTime:bltjas[3];

                if(bltjas[1] == bltjas[2] && bltjas[1] == bltjas[3]){
                    params["isNewVisiter"] = 1; //新客
                }else{
                    params["isNewVisiter"] = 2; //老客
                }
            }else{
                bltjas = [];
                bltjas[0] = uuid;
                bltjas[1] = bltjas[2] = bltjas[3] = newTime;
                params["isNewVisiter"] = 1; //新客
            }

            //上次访问时间
            params["preVisiterTime"] = bltjas[2];

            //var bo = isOnlyAccess(bltjas);
            setCookie("_bltja", bltjas.join("|"), "y5");
            setCookie("_bitj", bltjas[0], "y5");
        }

        /**
         * 判断是不是唯一访问
         * @param bltjas    cookie为bltja的参数组
         * @returns {boolean}
         */
        function isOnlyAccess(bltjas){
            if(bltjas[1]==bltjas[2] && bltjas[1]==bltjas[3]){
                return true;
            }
            return false;
        }

        /**
         * 设置访客cookie _bltjb _bltjc
         * _bltjb   30分钟有效
         * _bltjc   当前浏览器有效
         * @param nowTTS   当前时间戳
         */
        function setVisitorsCookie(nowTTS){
            var isNew = null,
                _bltjb = getCookie("_bltjb"),   //30分钟过期
                _bltjc = getCookie("_bltjc");   //浏览器结束过期

            if(!_bltjb && !_bltjc){
                setCookie("_bltjb", nowTTS + "-" + uuid, "s180");
                setCookie("_bltjc", nowTTS + "-" + uuid, "s0");
                isNew = nowTTS;
            }else{
                //如果cookie中一个不存在，则生成另一个并覆盖访客id
                if(_bltjb){
                    setCookie("_bltjc", _bltjb, "s0");
                }
                if(_bltjc){
                    setCookie("_bltjb", _bltjc, "s180");
                }
            }

            _bltjb =  getCookie("_bltjb");
            if(_bltjb){
                //本次访问第一个pv时间
                params["visitTime"] = _bltjb.split("-")[0];
                //sesstion 访客ID - 会话开始时间+UUID
                params["visiterId"] = _bltjb;
            }

            return isNew;
        }

        /**
         * 设置活动cookie _bltjd    已作废
         * 6个月有效期，累计添加活动
         * 活动从URL里面获取 取参数名 _bitrack
         * 规则 uuid|(活动名称,加入时间.活动名称,加入时间)
         */
        function setActivityCookie(nowTTS){
            var pms, _bitrack;

            //获取当前url中_bitrack参数值(活动名称)
            pms = location.search.substr(1).split("&")||[];
            if(pms.length>=1){
                for(var i=0;i<pms.length;i++){
                    if(pms[i].indexOf("_bitrack")>=0){
                        _bitrack = pms[i].split("=")[1];
                    }
                }
            }

            if(_bitrack){
                var _bltjd, _bltjds, cookieVal;
                _bltjd = getCookie("_bltjd");

                if(!_bltjd){
                    cookieVal = uuid +"|"+ _bitrack +","+ nowTTS;
                }else{
                    _bltjds = _bltjd.split("|");

                    _bltjds_pms = _bltjds[1].split(".");
                    var bo = true;
                    for(var i=0;i<_bltjds_pms.length;i++){
                        var key_val = _bltjds_pms[i].split(",");
                        if(key_val[0] == _bitrack){
                            _bltjds_pms[i] = _bitrack +","+ nowTTS;
                            bo = false;
                        }
                    }

                    if(bo) _bltjds_pms.push(_bitrack+","+nowTTS);
                    cookieVal = uuid +"|"+ _bltjds_pms.join(".");
                }

                setCookie("_bltjd", cookieVal, "m6");

                //将活动添加进参数列表
                params["ad"] = cookieVal.split("|")[1];
            }
        }

        return {
            /**
             * 初始化组件并发送请求参数
             */
            init: function () {
                //var nowTTS = Math.round(new Date().getTime()/1000),
                var nowTTS = new Date().getTime(),
                    requestList = "";

                //请求类型 页面请求
                params["tjType"] = "pageView";

                //如果是web站或者m站获取统计方式一样
                if(appType == "web" || appType == "m"){
                    //设置是否是新客cookie
                    var newTime = setVisitorsCookie(nowTTS);

                    //设置唯一访问cookie
                    setOnlyAccessCookie(newTime);

                    //设置活动统计cookie      已作废
                    //setActivityCookie(nowTTS);    //放弃这个cookie _bitrack参数从url中取

                    requestList = getRequest();
                }else{
                    //如果是app，获取设备信息参数
                    requestList = getEquipmentInfo();
                }

                //发送请求
                sendRequest( requestList );
            },
            /**
             * 设置app模式
             * 不同的模式，发送的参数不同
             * @param type （0:默认模式，web模式；1：手机app模式）
             */
            setAppType: function(type){
                switch (type){
                    case "m":     //m站
                        appType = type;
                        break;
                    case "app":     //app站
                        appType = type;
                        break;
                    default :   //默认web站
                        appType = "web";
                }
            },
            /**
             * 点击事件统计
             * @param eventID  行为ID，埋点需要有枚举列表，枚举列表由埋点人定义
             * @param value    统计数据集，json对象key：value
             */
            trackEvent: function(cat1, cat2, pams){
                //params["trackEvent"] = JSON.stringify([eventID,value]);

                params["eventCat1"] = cat1;
                params["eventCat2"] = cat2;
                params["eventParams"] = pams;

                //请求类型 事件请求
                params["tjType"] = "event";

                sendRequest( getRequest() );
            },
            /**
             * 设置customerId，未设置从cookie中获取
             * @param customerId
             */
            setCustomerId: function(customerId){
                params["customerId"] = customerId;
            },
            /**
             * 设置customerId，是否需要自动获取
             * @param auto on开启，off关闭
             */
            setCustomerAuto: function(auto){
                customerAuto = auto;
            },
            /**
             * 设置接收数据api url
             * @param url
             */
            setApiUrl: function(url){
                apiUrl = url;
                //params["apiUrl"] = url;
            },
            /**
             * 设置站点id
             * @param siteId
             */
            setSiteId: function(siteId){
                //逻辑有待进一步调整，以下为测试写法
                params["siteId"] = siteId;
            },
            /**
             * 修改参数值
             * @param name 参数名
             * @param value 修改值
             */
            setParamVal: function(name, value){
                mainParams[name] = value;
            },
            /**
             * 给本次访问设置自定义变量
             * @param name
             * @param value
             */
            setCustomVariable: function(name,value){
                var _bjtje, _bjtjes, val;
                _bjtje = getCookie("_bjtje");

                if(_bjtje){
                    _bjtjes = _bjtje.split("|");
                    var bo = true;
                    for(var i=0;i<_bjtjes.length;i++){
                        var key_val = _bjtjes[i].split("=");

                        if(key_val[0] == name){
                            _bjtjes[i] = key_val[0] +"="+key_val[1];
                            bo = false;
                        }
                    }
                    if(bo) _bjtjes.push(name+"="+value);
                    val = _bjtjes.join("|");
                }else{
                    val = uuid +"|"+ name +"="+ value;
                }
                setCookie("_bjtje", val, "y5");

                var _pms = val.split("|");
                _pms.shift();
                params["cv"] = _pms.join(";");
            },
            trackLink: function(){
                //alert("trackLink");
            }
        };
    };

    /**
     *  获取uuid
     * @returns {*} uuid
     */
    var getUUID = function(){
        var _bltja = getCookie("_bltja");

        if(_bltja && _bltja.split("|")[0]){
            return _bltja.split("|")[0];
        }

        return Math.uuid();
    };

    /**
     * 获取cookie
     * @param name
     * @returns {*}
     */
    var getCookie = function(name){
        //cookie中的数据都是以分号加空格区分开
        var arr = document.cookie.split("; ");
        for(var i=0; i<arr.length; i++){
            if(arr[i].split("=")[0] == name){
                return decodeURIComponent(arr[i].split("=")[1]);
            }
        }
        return null;
    };

    /**
     * setCookie辅助方法
     * @param str   过期时间
     * @returns {number}
     */
    function getsec(str) {
        var str1 = str.substring(1,str.length)*1;
        var str2 = str.substring(0,1);
        switch (str2){
            case "s":
                return str1*1000;
            case "h":
                return str1*60*60*1000;
            case "d":
                return str1*24*60*60*1000;
            case "m":
                return str1*30*24*60*60*1000;
            case "y":
                return str1*365*24*60*60*1000;
        }
    }

    /**
     * 添加cookie
     * 这是有设定过期时间的使用示例：
     * setCookie("name","hayden","s20");
     * s20是代表20秒
     * h是指小时，如12小时则是：h12
     * d是天数，30天则：d30
     * @param name
     * @param value
     */
    var setCookie = function(name,value,time){
        //默认30天过期
        var strsec = getsec(time?time:"d30");
        if(strsec){
            var exp = new Date();
            exp.setTime(exp.getTime() + strsec*1);
            document.cookie = name + "=" + encodeURIComponent (value) + ";path=/;domain=benlai.com;expires=" + exp.toGMTString();
            //document.cookie = name + "=" + encodeURIComponent (value) + ";path=/;expires=" + exp.toGMTString();
        }else{
            document.cookie = name + "=" + encodeURIComponent (value) + ";path=/;domain=benlai.com";
            //document.cookie = name + "=" + encodeURIComponent (value) + ";path=/";
        }
    };

    /**
     * 删除cookie
     * @param name
     * @param value
     */
    var delCookie = function(name){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=getCookie(name);
        if(cval!=null)
            document.cookie= name + "=" + cval + ";expires=" + exp.toGMTString();
    };

    var xwpk = {
        test: function(param, callback){
            console.log("test");
        }
    };

    this.init();
    return xwpk;
}());


