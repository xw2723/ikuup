
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
        uintCookie,         //cookie工具
        eventGenerator,     //触发器
        uuid;               //唯一标识

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
        function getBrowserInfo(){
            var agent = navigator.userAgent.toLowerCase(),
                opera = window.opera,
                browser = {
                    explore_name: "",
                    explore_version: ""
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

                browser.explore_name = "ie";
                browser.explore_version = version;
            }

            //chrome
            if (/chrome\/(\d+\.\d)/i.test(agent)) {
                browser.explore_name = "chrome";
                browser.explore_version = RegExp['\x241'];
            }

            //micromessenger 微信
            if (/ucbrowser\/(\d+\.\d)/i.test(agent)) {
                browser.explore_name = "wechat";
                browser.explore_version = RegExp['\x241'];
            }

            //ucbrowser
            if (/ucbrowser\/(\d+\.\d)/i.test(agent)) {
                browser.explore_name = "ucbrowser";
                browser.explore_version = RegExp['\x241'];
            }

            //firefox
            if (/firefox\/(\d+\.\d)/i.test(agent)) {
                browser.explore_name = "firefox";
                browser.explore_version = RegExp['\x241'];
            }

            //safari
            if (/(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(agent) && !/chrome/i.test(agent)) {
                browser.explore_name = "safari";
                browser.explore_version = (RegExp['\x241'] || RegExp['\x242']);
            }

            // Opera 9.50+
            if (!!opera && opera.version){
                browser.explore_name = "opera";
                browser.explore_version = parseFloat(opera.version());
            }

            return browser;

            //var browser = {explore_name: "", explore_version: ""},
            //    userAgent = window.navigator.userAgent.toLowerCase();
            //console.log(userAgent);
            //debugger;
            ////IE,firefox,opera,chrome,netscape
            //if ( /(msie|edge|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test( userAgent ) ){
            //    browser.explore_name = RegExp.$1;
            //    browser.explore_version = RegExp.$2;
            //} else if ( /version\D+(\d[\d.]*).*safari/.test( userAgent ) ){ // safari
            //    browser.explore_name = 'safari';
            //    browser.explore_version = RegExp.$2;
            //
            //} else if ( userAgent.indexOf("trident") > -1 && userAgent.indexOf("rv") > -1 ){
            //    browser.explore_name = 'ie';
            //    browser.explore_version = "11";
            //}
        }

        /**
         * 获取本地操作系统信息
         * @returns {*}
         */
        function getOS() {
            var sUserAgent = navigator.userAgent;
            var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
            var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
            if (isMac) return "Mac";
            var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
            if (isUnix) return "Unix";
            var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
            if (isLinux) return "Linux";
            if (isWin) {
                var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
                if (isWin2K) return "Win2000";
                var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
                if (isWinXP) return "WinXP";
                var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
                if (isWin2003) return "Win2003";
                var isWinVista= sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
                if (isWinVista) return "WinVista";
                var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
                if (isWin7) return "Win7";
            }

            var isIOS = sUserAgent.indexOf("iPhone") > -1;
            if(isIOS) return "IOS";
            var isAndroid = sUserAgent.indexOf('Android') > -1 || sUserAgent.indexOf('Adr') > -1;
            if(isAndroid) return "Android";

            return "other";
        }

        /**
         * 获取请求参数
         * @returns {string}
         */
        function getRequest(){
            //唯一标识
            params["UUID"] = uuid;

            params["domain"] = document.domain;
            //params["path"] = document.URL;
            params["path"] = document.location.pathname;
            params["title"] = document.title;
            params["parameter"] = location.search.substr(1);

            var referrer = getDomainPathParameter();
            params["referrer"] = referrer.referrer;
            params["referrer_domain"] = referrer.domain;
            params["referrer_path"] = referrer.path;
            params["referrer_parameter"] = referrer.parameter;

            params["device_type"] = getDeviceType();
            params["os_name"] = getOS();

            var browserInfo = getBrowserInfo();
            for(key in browserInfo){
                params[key] = browserInfo[key];
            }
            params["screen_point"] = (window.screen.width + "x" + window.screen.height);

            //params["_lg"] = navigator.language;

            //来源搜索引擎类型
            params["search_engine"] = getSearchSource(referrer.referrer)||"";
            //搜索关键字
            params["search_keyword"] = getSearchKeyword(referrer.referrer)||"";

            //获取活动关键字
            params["_bitrack"] = getBitrack()||"";

            //站内搜索关键词
            params["site_search_keyword"] = getSiteSearchKeyword()||"";
            //站内搜索SKU数
            params["site_search_sku_count"] = getSiteSearchSKUCount()||"";
            //站内搜索结果的前10个sku编号
            params["site_search_top_sku"] = getSiteSearchTopSku()||"";

            //获取客户sysno
            params["customerID"] = getCookie("userID")||"";

            //获取站点id
            params["websitesysno"] = getCookie("WebSiteSysNo")||"";

            //获取城市id
            params["DeliverySysNo"] = getCookie("DeliverySysNo")||"";

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

            //拼接参数串
            //var args = '';
            //for(var i in params) {
            //    if(args != '') args += '&';
            //    args += i + '=' + encodeURIComponent(params[i]);
            //}
            //return args;
            return "data="+encodeURIComponent(JSON.stringify(params));
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
            var pms = location.search.substr(1).split("&");
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
            var paths = path.split("?")[1];
            if(paths){
                var pms = paths.split("&");
                for(var i=0;i<pms.length;i++){
                    if(pms[i].indexOf("wd")>=0 || pms[i].indexOf("query")>=0){
                        return pms[i].split("=")[1];
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
            if(!url) return null;

            var type = "",
                source = [
                    "baidu", "sogou", "so", "google", "search.yahoo"
                ];

            var url = url.split("?")[0];
            for(var i=0;i<source.length;i++){
                if(url.indexOf(source[i])>=0){
                    return source[i];
                }
            }

            return null;
        }

        /**
         * 判断设备类型
         * @returns {string}
         */
        function getDeviceType(){
            var userAgentInfo = navigator.userAgent;
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
                path = urls[0] || "";
                domain = path.split("/")[2] || "";
                parameter = urls[1] || "";
            }else{
                urls = path = domain = parameter = "";
            }

            return {
                referrer: referrer,
                domain: domain,
                path: path,
                parameter: parameter
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
            var apiUrl = "//bitj.benlai.com/Trafficstatistics/HavisitLogController/redLog.do";
            //var apiUrl = "//localhost:3000/piwik/xwpk";
            image.src = apiUrl + (apiUrl.indexOf('?') < 0 ? '?' : '&') + request;
        }

        /**
         * 设置唯一访问cookie
         * @constructor
         */
        function setOnlyAccessCookie(nowTTS){
            var bltja, bltjas=null;
            bltja = getCookie("_bltja");

            if(bltja){
                bltjas = bltja.split("|");
                if(bltjas[2] != bltjas[3]){
                    bltjas[2] = bltjas[3];
                }
                bltjas[3] = nowTTS;
                params["isNewVisiter"] = 0; //老客
            }else{
                bltjas = [];
                bltjas[0] = uuid;
                bltjas[1] = bltjas[2] = bltjas[3] = nowTTS;
                params["isNewVisiter"] = 1; //新客
            }

            //上次访问时间
            params["preVisiterTime"] = bltjas[2];

            //var bo = isOnlyAccess(bltjas);
            setCookie("_bltja", bltjas.join("|"), "y5");
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
            var _bltjb = getCookie("_bltjb"),   //30分钟过期
                _bltjc = getCookie("_bltjc");   //浏览器结束过期

            if(!_bltjb && !_bltjc){
                setCookie("_bltjb", nowTTS + "-" + uuid, "s1800");
                setCookie("_bltjc", nowTTS + "-" + uuid, "s0");
            }else{
                //如果cookie中一个不存在，则生成另一个并覆盖访客id
                if(_bltjb){
                    setCookie("_bltjc", _bltjb, "s0");
                }
                if(_bltjc){
                    setCookie("_bltjb", _bltjc, "s1800");
                }
            }

            _bltjb =  getCookie("_bltjb");
            //本次访问第一个pv时间
            params["visitTime"] = _bltjb.split("-")[0];
            //sesstion 访客ID - 会话开始时间+UUID
            params["visiterID"] = _bltjb;
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
                var nowTTS = Math.round(new Date().getTime()/1000),
                    requestList = "";

                //如果是web站或者m站获取统计方式一样
                if(appType == "web" || appType == "m"){
                    //设置唯一访问cookie
                    setOnlyAccessCookie(nowTTS);

                    //设置是否是新客cookie
                    setVisitorsCookie(nowTTS);

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
            trackEvent: function(eventID,value){
                params["trackEvent"] = JSON.stringify([eventID,value]);
                sendRequest( getRequest() );
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
                params["siteid"] = siteId;
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
                params["_cv"] = _pms.join(";");
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
            document.cookie = name + "=" + encodeURIComponent (value) + ";path=/;expires=" + exp.toGMTString();
        }else{
            document.cookie = name + "=" + encodeURIComponent (value) + ";path=/";
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


