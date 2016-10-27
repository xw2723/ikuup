
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
        eventGenerator,                     //触发器
        customerAuto = "on" || "off",     //设置customerId是否自动从cookie中获取，默认on自动
        uuid;                               //唯一标识

    this.equipmentInfo = {};      //设备信息对象

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

            //micromessenger 微信 app 优先级最高
            var isWechat = /micromessenger\/(\d+\.\d)/i.test(agent);
            if (isWechat) {
                browser.exploreName = "wechat";
                browser.exploreVersion = RegExp['\x241'];
                return browser;
            }

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
                return browser;
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
                return browser;
            }

            //baidu app
            var isBaidu_app = /alipayclient\/((\d\_(\d+\.)+\d)|(\d\.\d))/i.test(agent);
            if (isBaidu_app) {
                browser.exploreName = "alipay";
                browser.exploreVersion = RegExp['\x241'];
                return browser;
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

            //360 会有将firefox统计成360的情况
            //if((window.navigator.mimeTypes[40] || !window.navigator.mimeTypes.length)){
            //    browser.exploreName = "360";
            //    browser.exploreVersion = "";
            //}

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
            if(!sUserAgent) return {
                name: "",
                version: ""
            };

            var isIphone = sUserAgent.indexOf("iPhone;") > -1;
            if(isIphone) return {
                name: "iPhone IOS",
                //version: sUserAgent.match(/iPhone OS (\d+\_\d)/i)[1].replace("_",".")
                version: ""
            };
            var isIpad = sUserAgent.indexOf("iPad") > -1;
            if(isIpad) return {
                name: "iPad IOS",
                //version: sUserAgent.match(/iPad OS (\d+\_\d)/i)[1].replace("_",".")
                version: ""
            };
            var isIpod = sUserAgent.indexOf("iPod") > -1;
            if(isIpod) return {
                name: "iPod IOS",
                //version: sUserAgent.match(/iPhone OS (\d+\_\d)/i)[1].replace("_",".")
                version: ""
            };

            var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
            if (isMac) return {
                name: "mac",
                //version: "sUserAgent.match(/Mac OS X (\d+\.\d+)/i)[1]
                version: ""
            };

            var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
            if (isLinux){
                //var infoOS = sUserAgent.match(/(\(.*?\))+/g)[0];
                //["(Linux; Android 5.1; OPPO R9tm Build/LMY47I)", "(KHTML, like Gecko)"]
                var isAndroid = sUserAgent.indexOf('Android') > -1 || sUserAgent.indexOf('Adr') > -1;
                if( /Android (\d+\.\d)/i.test(sUserAgent) ){
                    return {
                        name: "android",
                        version: sUserAgent.match(/Android (\d+\.\d)/i)[1]
                    };
                }else{
                    return {
                        name: "linux",
                        version: ""
                    };
                }
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

            var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
            if (isUnix) return {
                name: "unix",
                version: ""
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
            //设置和获取 cookie信息
            settingCookieData();

            /**
             * version： js版本号
             * uuid：    唯一标识
             * title：   当前页标题
             */
            params["version"] = 2;
            params["uuid"] = params["uuid"] || uuid || "";
            params["title"] = params["title"] || document.title || "";

            /**
             * 当前页URL信息搜集
             * bk：将路径中的双引号替换成单引号    .replace(/(\%22)+/g,"'")
             * bk：获取端口好     var port = window.location.port ? (":"+window.location.port):"";
             * @type {string}
             */
            params["pageUrl"] =  encodeURIComponent( params["pageUrl"] || document.location.href || "" );
            params["pageParameter"] = encodeURIComponent( params["pageParameter"] || location.search.substr(1) || "" );
            params["pageDomain"] = params["pageDomain"] || document.domain || "";
            params["pagePath"] = encodeURIComponent( params["pagePath"] || document.location.pathname || "" );

            /**
             * 来源URL信息收集
             * 暂时取消参数字段的收集，来至搜索引擎的参数过长，信息重叠
             */
            if(params["referrerUrl"] == null){
                var referrer = getDomainPathParameter( getCookie("bi_refer") );
                params["referrerUrl"] = encodeURIComponent(referrer.referrer);
                params["referrerDomain"] = referrer.domain;
                params["referrerPath"] = encodeURIComponent(referrer.path);
                params["referrerParameter"] = "";
            }

            /**
             * 搜索引擎数据收集
             * searchEngine：来源搜索引擎类型
             * searchKeyword：搜索关键字
             * searchType：搜索引擎所属板块    brand(品专)，sem，seo
             * source：来源是本站，还是外站，还是搜索引擎   b,w,s
             */
            if(params["searchEngine"] == null){
                var engineParsing = null;
                try{
                    engineParsing = searchEngineParsing();
                    params["searchEngine"] = engineParsing.getSearchEngine() || "";
                    params["searchKeyword"] = encodeURIComponent(engineParsing.getSearchKeyword()) || "";
                    params["searchType"] = engineParsing.getSearchType() || "";
                    params["source"] = (params["pageDomain"] == params["referrerDomain"]) ? "b" : (engineParsing.getSource() || "");
                }catch(e){
                    params["errorMsg"] = "engineParsing-----:"+encodeURIComponent( e.message );
                }
            }

            //pc or mobile
            params["deviceType"] = params["deviceType"] || getDeviceType();

            //操作系统
            if(params["osName"] == null){
                var infoOS;
                try{
                    infoOS = getOS();
                }catch(e){
                    params["errorMsg"] = "getOS-----:"+encodeURIComponent( e.message );
                    infoOS = { name: "", version: "" };
                }
                params["osName"] = infoOS.name;
                params["osVersion"] = infoOS.version;
            }

            //浏览器信息
            if(params["exploreName"] == null){
                var browserInfo = getBrowserInfo();
                for(key in browserInfo){
                    params[key] = browserInfo[key];
                }
            }

            //分辨率
            params["screenPoint"] = params["screenPoint"] || (window.screen.width +"x"+ window.screen.height);

            //获取活动关键字 来至url中的 _bitrack 参数
            params["bitrack"] = params["bitrack"] || getBitrack() || "";

            /**
             * 站内搜索信息搜集
             * siteSearchKeyword：站内搜索关键词
             * siteSearchSkuCount：站内搜索SKU数
             * siteSearchTopSku：站内搜索结果的前10个sku编号
             * @type {*|string}
             */
            params["siteSearchKeyword"] = params["siteSearchKeyword"] || getSiteSearchKeyword() || "";
            params["siteSearchSkuCount"] = params["siteSearchSkuCount"] || getSiteSearchSKUCount() || "";
            params["siteSearchTopSku"] = params["siteSearchTopSku"] || getSiteSearchTopSku() || "";

            /**
             * 搜集cookie中的数据
             * customerId：客户sysno 来至cookie：userID
             * webSiteId：站点id 来至cookie：WebSiteSysNo
             * cityId：城市id 来至cookie：DeliverySysNo
             * @type {*|string}
             */
            params["customerId"] = params["customerId"] || getCustomerId() || "";
            params["webSiteId"] = params["webSiteId"] || getCookie("WebSiteSysNo") || "";
            params["cityId"] = params["cityId"] || getCookie("DeliverySysNo") || "";

            //将主要的参数合并到发送参数中
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
                    return params["customerId"] || getCookie("userID") || "";
                case "off":
                    return params["customerId"] || "";
                default :
                    return "";
            }
        }

        /**
         * 获取设备信息参数
         * @returns {string} data={}
         */
        function getEquipmentInfo(){
            //推送号
            params["jpushID"] = self.equipmentInfo["jpushID"] || "";

            //设备类型
            params["appType"] = self.equipmentInfo["appType"] || "";

            //网络模式
            params["netModel"] = self.equipmentInfo["netModel"] || "";

            //设备品牌
            params["devBrand"] = self.equipmentInfo["devBrand"] || "";

            //APP使用开始时间
            params["appUseStartTime"] = self.equipmentInfo["appUseStartTime"] || "";

            //设备型号
            params["devUnType"] = self.equipmentInfo["devUnType"] || "";

            //APP渠道
            params["appChannel"] = self.equipmentInfo["appChannel"] || "";

            //app版本
            params["appVersion"] = self.equipmentInfo["appVersion"] || "";

            //操作系统
            params["appUseOper"] = self.equipmentInfo["appUseOper"] || "";

            //安装时间
            params["appInstallTime"] = self.equipmentInfo["appInstallTime"] || "";

            //设备ID
            params["devId"] = self.equipmentInfo["devId"] || "";

            //客户端token即devid_time
            params["token"] = self.equipmentInfo["token"] || "";

            //系统内部生成的设备号
            params["sysDevId"] = self.equipmentInfo["sysDevId"] || "";

            //设备分辨率
            params["devReso"] = self.equipmentInfo["devReso"] || (window.screen.width +"x"+ window.screen.height) || "";

            //app使用结束时间
            params["appUseEndTime"] = self.equipmentInfo["appUseEndTime"] || "";

            //app使用时间间隔
            params["interval"] = self.equipmentInfo["interval"] || "";

            return "data=" + encodeURIComponent( JSON.stringify(params) );
        }

        /**
         * 获取活动参数 _bitrack
         * 暂定web站和m站一致取法
         * @returns {*}
         */
        function getBitrack(){
            var isBitrack = /_bitrack=((\d)+)/i.test( location.search.substr(1) + location.hash );
            if(!!isBitrack)
                return RegExp['\x241'];
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
         * 设置和获取 cookie信息
         */
        function settingCookieData(){
            //var nowTTS = Math.round(new Date().getTime()/1000),
            var nowTTS = new Date().getTime();

            //设置是否是新客cookie
            var newTime = setVisitorsCookie(nowTTS);

            //设置唯一访问cookie
            setOnlyAccessCookie(newTime);

            //设置活动统计cookie      已作废，_bitrack参数从url中取
            //setActivityCookie(nowTTS);
        }

        /**
         * 废弃
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
        function getDomainPathParameter(referrerUrl){
            var referrer,urls,domain,path,parameter;

            referrer = referrerUrl || document.referrer || "";
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
            var apiUrl = "//bitj.benlai.com/Bitj/js/commit_data.do";
            //var apiUrl = "//10.10.110.113:3000/piwik/xwpk";

            var image = new Image(1, 1);
            image.onload = function () {
                iterator = 0; // To avoid JSLint warning of empty block
                if (typeof callback === 'function') { callback(); }
            };
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

            setCookie("_bltja", bltjas.join("|"), "y5");
            setCookie("_bitj", bltjas[0], "y5");
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

            /**
             * visitTime：本次访问第一个pv时间
             * visiterId：sesstion 访客ID - pv时间+UUID
             * @type {*}
             * @private
             */
            _bltjb =  getCookie("_bltjb");
            if(_bltjb){
                params["visitTime"] = _bltjb.split("-")[0];
                params["visiterId"] = params["visitTime"] +"-"+ uuid;
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
                //请求类型：页面请求
                params["tjType"] = "pageView";

                var requestList = "";
                if(appType == "web" || appType == "m"){
                    //如果是web站或者m站获取信息方式一致
                    requestList = getRequest();
                }else{
                    //如果是app内嵌页，获取设备信息参数
                    requestList = getEquipmentInfo();
                }

                //发送请求
                sendRequest( requestList );
            },
            /**
             * 获取到设备信息对象
             *  @param equipmentInfo
             */
            setEquipmentInfo: function(equipmentInfo){
                self.equipmentInfo = equipmentInfo || {};
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
                    case "app":   //app站
                        appType = type;
                        break;
                    default :     //默认web站
                        appType = "web";
                }
            },
            /**
             * 点击事件统计
             * @param eventID  行为ID，埋点需要有枚举列表，枚举列表由埋点人定义
             * @param value    统计数据集，json对象key：value
             */
            trackEvent: function(cat1, cat2, pams){
                params["eventCat1"] = cat1;
                params["eventCat2"] = cat2;

                /**
                 * 对pams中的字符串进行编码，防止特殊符号对后台转json对象有影响
                 */
                for(var key in pams){
                    if(isObjectType(pams[key],"String"))
                        pams[key] = encodeURIComponent(pams[key]);
                }
                params["eventParams"] = pams;

                //请求类型：事件请求
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
     * 获取系统、浏览器、设备信息
     * 未使用，未完成
     */
    var parsingUserAgent = function(){
        var user_agent = navigator.userAgent.toLowerCase();

        return {
            getOS: function(){
                if(!user_agent)
                    return { name: "", version: "" };

                if( /iphone os (\d+\_\d)/i.test(user_agent) )
                    return { name: "iPhone IOS", version: RegExp['\x241'] };

                if( /ipad os (\d+\_\d)/i.test(user_agent) )
                    return { name: "iPad IOS", version: RegExp['\x241'] };

                if( /iphone os (\d+\_\d)/i.test(user_agent) && user_agent.indexOf("ipod") > -1 )
                    return { name: "iPod IOS", version: RegExp['\x241'] };

                var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
                if (isMac){
                    var reg;
                    try{
                        var a = /mac os x (\d+\.\d+)/i.test(user_agent);
                        return { name: "mac", version: RegExp['\x241'] };
                    }catch(e){
                        eventGenerator.setParamVal("errorMsg", e.message);
                    }
                    return { name: "mac", version: "" };
                }

                //安卓系统
                if( /android (\d+\.\d)/i.test(user_agent) )
                    return { name: "android", version: RegExp['\x241'] };

                if( /linux/i.test(user_agent) )
                    return { name: "linux", version: "" };

                var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
                if (isWin) {
                    var isWin2K = user_agent.indexOf("windows NT 5.0") > -1 || user_agent.indexOf("windows 2000") > -1;
                    if (isWin2K) return {
                        name: "windows",
                        version: "2000"
                    };
                    var isWinXP = user_agent.indexOf("windows NT 5.1") > -1 || user_agent.indexOf("windows XP") > -1;
                    if (isWinXP) return {
                        name: "windows",
                        version: "xp"
                    };
                    var isWin2003 = user_agent.indexOf("windows NT 5.2") > -1 || user_agent.indexOf("windows 2003") > -1;
                    if (isWin2003) return {
                        name: "windows",
                        version: "2003"
                    };
                    var isWinVista= user_agent.indexOf("windows NT 6.0") > -1 || user_agent.indexOf("windows Vista") > -1;
                    if (isWinVista) return {
                        name: "windows",
                        version: "vista"
                    };
                    var isWin7 = user_agent.indexOf("windows NT 6.1") > -1 || user_agent.indexOf("windows 7") > -1;
                    if (isWin7) return {
                        name: "windows",
                        version: "7"
                    };
                    var isWin8 = user_agent.indexOf("windows NT 6.2") > -1 || user_agent.indexOf("windows NT 6.3") || user_agent.indexOf("windows 8") > -1;
                    if (isWin8) return {
                        name: "windows",
                        version: "8"
                    };
                    var isWin10 = user_agent.indexOf("windows NT 10") > -1 || user_agent.indexOf("windows 10") > -1;
                    if (isWin10) return {
                        name: "windows",
                        version: "10"
                    };
                }

                var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
                if (isUnix)
                    return { name: "unix", version: "" };

                return { name: "", version: "" };
            }
        }
    };

    /**
     * 搜索引擎解析
     */
    var searchEngineParsing = function(referrerUrl){
        var urlToKey,               //url转key
            keyToQueryKey,          //key转搜索关键字key
            keyToModel,             //key转搜索模式
            biFefer,                //来源url
            searchEngine = "",      //搜索引擎名
            searchKeyword = "",     //搜索关键字
            searchType = "";        //搜索模式

        urlToKey = {
            "baidu.com": "baidu",
            "sogou.com": "sogou",
            "so.com": "360",
            "google.com": "google",
            "google.co.jp": "google",
            "search.yahoo.com": "yahoo"
        };
        keyToQueryKey = {
            "baidu": ["wd","word"],
            "sogou": ["query"],
            "360": ["q"],
            "google": [""],
            "yahoo": [""]
        };
        keyToModel = {
            "baidu": {
                "brand": ["bzclk.baidu.com/adrc.php","m.baidu.com/s"],
                "sem": ["baidu.com/baidu.php"],
            },
            "sogou": {
                "brand": ["ctb.brand.sogou.com"],
                "sem": ["www.sogou.com/bill_cpc"],
            },
            "360": {
                "brand": ["click.dsp.com"],
                "sem": ["e.tf.360.cn"],
            },
            "google": null,
            "yahoo": null
        };

        function init(){
            //获取cookie 中的 referrerUrl
            biRefer = getCookie("bi_refer") || document.referrer || "";
            if(!biRefer) return false;

            //获取到bi_refer后，将其cookie删除
            setCookie("bi_refer","","s0","");
            setCookie("bi_refer","","s0","benlai.com");
            delCookie("bi_refer");

            //拆分url和params
            var urls = biRefer.split("?");

            //搜索引擎名称
            for(var key in urlToKey){
                if(urls[0].indexOf(key) >= 0){
                    searchEngine = urlToKey[key];
                    break;
                }
            }

            if(!searchEngine) return false;

            //搜索模式
            var searchObj = keyToModel[searchEngine];
            if(!!searchObj){
                outerloop:
                for(var k in searchObj){
                    for(var i=0;i<searchObj[k].length;i++){
                        if(urls[0].indexOf( searchObj[k][i] ) >= 0){
                            searchType = k;
                            break outerloop;
                        }
                    }
                }
            }
            searchType = searchType || "seo";

            //搜索关键字
            var keywords = keyToQueryKey[searchEngine];
            if(urls[1] && keywords){
                var pms = urls[1].split("&");
                outerloop:
                for(var i=0;i<pms.length;i++){
                    var pmses = pms[i].split("=");
                    var pasKey = pmses.shift();     //删除属性名

                    for(var j=0;j<keywords.length;j++){
                        if(pasKey == keywords[j]){
                            searchKeyword = pmses.join("");
                            break outerloop;
                        }
                    }
                }
            }
        };

        init();

        return {
            /**
             * 获取浏览器名称
             * @returns {string}
             */
            getSearchEngine: function(){
                return searchEngine;
            },
            /**
             * 获取搜索关键字
             * @returns {string}
             */
            getSearchKeyword: function(){
                return searchKeyword;
            },
            /**
             * 获取搜索所属模式，brand(品专)，sem，seo
             */
            getSearchType: function(){
                return searchType;
            },
            /**
             * 获取来源是本站，还是外站，还是搜索引擎
             * @returns {string}
             */
            getSource: function(){
                var source = "";
                if(biRefer){
                    if(!!searchEngine){
                        source = "s";
                    }else{
                        var referUrl = biRefer.split("?")[0];
                        source = referUrl.indexOf("benlai.com")>=0 ? "b" : "w";
                    }
                }
                return source;
            }
        }
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
    var setCookie = function(name,value,time,domain){
        var strsec = getsec(time?time:"d30"),   //默认30天过期
            cookieStr = "",
            //domainStr = ";domain=" + (domain ? domain: document.domain);
            domainStr = ";domain=" + (domain || (domain==""?"":document.domain));

        if(strsec){
            var exp = new Date();
            exp.setTime(exp.getTime() + strsec*1);
            cookieStr = name + "=" + encodeURIComponent (value) + ";path=/;expires=" + exp.toGMTString() + domainStr;
        }else{
            cookieStr = name + "=" + encodeURIComponent (value) + ";path=/" + domainStr;
        }
        document.cookie = cookieStr;
    };

    /**
     * 删除cookie
     * @param name
     * @param value
     */
    var delCookie = function(name){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if(cval!=null)
            document.cookie= name + "=" + cval + ";expires=" + exp.toGMTString();
    };

    /**
     * 判断对象是不是相应的类型
     * @param obj   对象
     * @param type  对象的类型
     * @returns {boolean}
     */
    var isObjectType = function(obj, type){
        switch (type){
            case "Object":
                return Object.prototype.toString.call(obj) === '[object Object]';
            case "Array":
                return Object.prototype.toString.call(obj) === '[object Array]';
            case "String":
                return Object.prototype.toString.call(obj) === '[object String]';
            case "Number":
                return Object.prototype.toString.call(obj) === '[object Number]';
            default:
                return false;
        }
    };

    var isObject = function(obj){
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    var xwpk = {
        test: function(param, callback){
            console.log("test");
        }
    };

    this.init();
    return xwpk;
}());

//搜索引擎所属 品专，sem，seo
//var typeTokey = {
//    "test": ["wd","word"],
//    "baidu": {
//        "brand": ["bzclk.baidu.com/adrc.php"],
//        "sem": ["www.baidu.com/baidu.php","m.baidu.com/baidu.php"],
//        "seo": ["www.baidu.com/link"]
//    },
//    "sogou": {
//        "brand": ["brandapi.sogou.com/ctb.brand.sogou.com/g.gif","ctb.brand.sogou.com/f.gif"],
//        "sem": ["www.sogou.com/bill_cpc"],
//        "seo": ["www.sogou.com/link"]
//    },
//    "360": {
//        "brand": ["click.dsp.com/c"],
//        "sem": ["e.tf.360.cn/search/eclk","e.tf.360.cn/search/mclick"],
//        "seo": ["www.so.com/link","m.so.com/jump"]
//    },
//    "google": {},
//    "yahoo": {}
//};