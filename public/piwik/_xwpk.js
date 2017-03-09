
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

    //userAgent信息
    this.parsingUserAgent = null;
    //设备信息对象
    this.equipmentInfo = {};

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

        self.parsingUserAgent = parsingUserAgent();

        /**
         * 获取请求参数
         * @returns {string}
         */
        function getRequest(){
            //version： js版本号
            params["version"] = 2;

            /**
             * 通用参数
             * title：页面标签
             * pageUrl：当前页url
             * screenPoint：分辨率
             * bitrack：获取活动关键字 来至url中的 _bitrack 参数
             * siteSearchKeyword：站内搜索关键词
             * siteSearchSkuCount：站内搜索SKU数
             * siteSearchTopSku：站内搜索结果的前10个sku编号
             * @type {*|string|string}
             */
            params["title"] = params["title"] || document.title || "";
            params["pageUrl"] =  params["pageUrl"] || encodeURIComponent( decodeURIComponent(document.location.href) || "" );
            params["screenPoint"] = params["screenPoint"] || (window.screen.width +"x"+ window.screen.height);
            params["bitrack"] = params["bitrack"] || getBitrack() || "";

            //废弃    已改用事件埋点的方式来获取
            //站内搜索信息搜集
            //try{
            //    params["siteSearchKeyword"] = params["siteSearchKeyword"] || encodeURIComponent( (getSiteSearchKeyword()||"") );
            //    params["siteSearchSkuCount"] = params["siteSearchSkuCount"] || getSiteSearchSKUCount() || "";
            //    params["siteSearchTopSku"] = params["siteSearchTopSku"] || getSiteSearchTopSku() || "";
            //}catch(e){
            //    params["errorMsg"] = "The site search data collection => "+encodeURIComponent( e.message );
            //}

            /**
             * 搜集cookie中的数据
             * customerId：客户sysno 来至cookie：userID
             * webSiteId：站点id 来至cookie：WebSiteSysNo
             * cityId：城市id 来至cookie：DeliverySysNo
             */
            params["customerId"] = params["customerId"] || getCustomerId() || "";
            params["webSiteId"] = params["webSiteId"] || getCookie("WebSiteSysNo") || "";
            params["cityId"] = params["cityId"] || getCookie("DeliverySysNo") || "";

            //操作系统
            if(params["osName"] == null){
                var infoOS;
                try{
                    //infoOS = getOS();
                    infoOS = self.parsingUserAgent.getOS();
                }catch(e){
                    params["errorMsg"] = "getOS-----:"+encodeURIComponent( e.message );
                    infoOS = { name: "", version: "" };
                }
                params["osName"] = infoOS.name;
                params["osVersion"] = infoOS.version;
            }

            //设备品牌
            params["devBrand"] = params["devBrand"] || self.parsingUserAgent.getEB() || "";

            /**
             *  app内嵌页：设备信息参数由app注入给内嵌页，然后提供给统计js
             *  web站和m站：所有参数有js获取
             */
            if(appType == "app"){
                //暂定 当前访问时间
                params["visitTime"] = params["visitTime"] || new Date().getTime();
            }else{
                //设置和获取 cookie信息
                settingCookieData();

                //uuid：    唯一标识
                params["uuid"] = params["uuid"] || uuid || "";

                /**
                 * visitTime：本次访问第一个pv时间
                 * visiterId：sesstion 访客ID - pv时间+UUID
                 */
                if(params["visitTime"] == null){
                    var _bltjb =  getCookie("_bltjb");
                    if(!!_bltjb){
                        params["visitTime"] = _bltjb;
                        params["visiterId"] = _bltjb +"-"+ uuid;
                    }
                }

                /**
                 * 当前页URL信息搜集
                 * bk：将路径中的双引号替换成单引号    .replace(/(\%22)+/g,"'")
                 * bk：获取端口好     var port = window.location.port ? (":"+window.location.port):"";
                 */
                params["pageParameter"] = params["pageParameter"] || encodeURIComponent( location.search.substr(1) || "" );
                params["pageDomain"] = params["pageDomain"] || document.domain || "";
                params["pagePath"] = params["pagePath"] || encodeURIComponent( document.location.pathname || "" );

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

                /**
                 * 来源URL信息收集
                 * 暂时取消参数字段的收集，来至搜索引擎的参数过长，信息重叠
                 */
                if(!params["referrerUrl"]){
                    var referrer = getDomainPathParameter( getCookie("bi_refer") );
                    if(params["source"] == "b"){
                        params["referrerUrl"] = encodeURIComponent(referrer.referrer);
                    }else{
                        params["referrerUrl"] = encodeURIComponent(referrer.domain + referrer.path);
                    }

                    params["referrerDomain"] = referrer.domain;
                    params["referrerPath"] = encodeURIComponent(referrer.path);
                    params["referrerParameter"] = "";
                }

                //将userAgent输出，查看未知系统
                //params["userAgent"] = self.parsingUserAgent.getUA();

                //pc or mobile
                //params["deviceType"] = params["deviceType"] || getDeviceType();
                params["deviceType"] = params["deviceType"] || self.parsingUserAgent.getDT();

                //浏览器信息
                if(params["exploreName"] == null){
                    //var browserInfo = getBrowserInfo();
                    //for(key in browserInfo){
                    //    params[key] = browserInfo[key];
                    //}

                    var browserInfo = {name:"",version:""};
                    try{
                        browserInfo = self.parsingUserAgent.getBI();
                    }catch(e){
                        params["errorMsg"] = "getBI() => "+encodeURIComponent( e.message );
                    }
                    params["exploreName"] = browserInfo.name;
                    params["exploreVersion"] = browserInfo.version;

                }
            }

            //获取到bi_refer后，将其cookie删除
            setCookie("bi_refer","","s0","");
            setCookie("bi_refer","","s0","benlai.com");
            delCookie("bi_refer");

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
         * 获取活动参数 _bitrack
         * 暂定web站和m站一致取法
         * @returns {*}
         */
        function getBitrack(){
            var isBitrack = /_bitrack=((\d)+)/i.test( decodeURIComponent(location.search.substr(1) + location.hash) );
            if(!!isBitrack)
                return RegExp['\x241'];
            return null;
        }

        /**
         * sku top20编号 page15
         * @returns {*}
         */
        function getSiteSearchTopSku(){
            if(!params["siteSearchKeyword"]) return null;

            var parentNode = null,
                goodsIds = null;

            if(appType == "web"){
                //id = SearchBox Content
                parentNode = document.getElementById("Content");
                if(!!parentNode && !!parentNode.innerHTML){
                    goodsIds = parentNode.innerHTML.match(/product=" *\d+"/g);
                    if(goodsIds && goodsIds.length){
                        goodsIds = goodsIds.slice(0,20).join(",");
                        goodsIds = goodsIds.match(/\d+/g).join(",");
                    }
                }
            }else{
                //id = scroller thelist
                parentNode = document.getElementById("thelist");
                if(!!parentNode && !!parentNode.innerHTML){
                    goodsIds = parentNode.innerHTML.match(/addProductToCart\(\d+/g);
                    if(goodsIds && goodsIds.length>0){
                        goodsIds = goodsIds.slice(0,20).join(",");
                        goodsIds = goodsIds.match(/\d+/g).join(",");
                    }
                }
            }

            return goodsIds;
        }

        /**
         * sku总数
         * @returns {*}
         */
        function getSiteSearchSKUCount(){
            if(!params["siteSearchKeyword"]) return null;

            var count = null;
            try{
                if(appType == "web"){
                    var searchBox = document.getElementById("SearchBox");
                    if(searchBox){
                        var searchBoxText = searchBox.innerText;
                        if(searchBoxText){
                            var regs = searchBoxText.match(/[相关商品]+\s*\d+\s*[个]/);
                            if(regs && regs[0]){
                                count = regs[0].match(/\d+/)[0];
                            }
                        }
                    }
                }else{
                    var goodsBox = document.getElementById("scroller");
                    if(!!goodsBox && !!goodsBox.innerHTML){
                        var items = goodsBox.innerHTML.match(/class="price"/g);
                        count = (items && items.length>0) ? items.length : null;
                    }
                }
            }catch(e){
                params["errorMsg"] = "getSiteSearchSKUCount() => "+encodeURIComponent( e.message );
            }

            return count;
        }

        /**
         * 获取站内搜索关键词
         * @param paramsStr
         * @returns {*}
         */
        function getSiteSearchKeyword(){
            var pms = location.search.substr(1).split("&");
            for(var i=0;i<pms.length;i++){
                //web站
                if(appType == "web" && pms[i].indexOf("keyword")>=0){
                    if(pms[i].split("=")[0] == "keyword"){
                        return pms[i].split("=")[1];
                    }else{
                        throw "web站 搜索结果页的搜索关键字字段有变更！";
                    }
                }

                //m站
                if(appType == "m" && pms[i].indexOf("key")>=0){
                    if(pms[i].split("=")[0] == "key"){
                        return pms[i].split("=")[1];
                    }else{
                        throw "m站 搜索结果页的搜索关键字字段有变更！";
                    }
                }
            }
            return null;
        }

        /**
         * 设置和获取 cookie信息
         */
        function settingCookieData(){
            var nowTTS = new Date().getTime();

            //设置是否是新客cookie
            var uvTime = setVisitorsCookie(nowTTS);

            //设置唯一访问cookie
            setOnlyAccessCookie(uvTime);
        }

        /**
         * 判断设备类型
         * @returns {string}
         */
        function getDeviceType(){
            var userAgentInfo = navigator.userAgent;

            //将userAgent输出，查看未知系统
            //params["userAgent"] = userAgentInfo;

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
            // 生产
            //var apiUrl = "//bitj.benlai.com/Bitj/js/commit_data.do";
            // 测试
            //var apiUrl = "//192.168.60.28:8080/Bitj/js/commit_data.do";
            // 本地
            var apiUrl = "//10.10.110.113:3333/piwik/xwpk";

            var image = new Image(1, 1);
            image.onload = function () {
                iterator = 0; // To avoid JSLint warning of empty block
                if (typeof callback === 'function') { callback(); }
            };
            image.src = apiUrl + (apiUrl.indexOf('?') < 0 ? '?' : '&') + request +"&"+ new Date().getTime();
        }

        /**
         * 设置唯一访问cookie
         * @param uvTime    uv的第一个pv访问时间
         */
        function setOnlyAccessCookie(uvTime){
            var timeList = [],
                cookieName = "_bltja",
                bltja = getCookie(cookieName);

            if(!!bltja){
                timeList = bltja.split("|");

                // 清除cookie中的uuid
                if(timeList.length > 3){
                    timeList.shift();

                    //防止当前访问时间没有取到，在发布js的时候改动难免会影响cookie中数据丢失
                    for(var i=0;i<timeList.length;i++){
                        if(!timeList[i]){
                            timeList[i] = uvTime;
                        }
                    }
                }

                // 如果uvTime和cookie的当前访问时间一致，更新cookie中的上一次访问时间和当前访问时间
                if(uvTime != timeList[2]){
                    timeList[1] = timeList[2];
                    timeList[2] = uvTime;
                }

                // 获取当前访问时间和uuid生成时间的天数差，如果大于0天就为老客2，否则为新客1
                if(!getDayByInterval( getYMDToTime(timeList[2]), getYMDToTime(timeList[0]) )){
                    params["isNewVisiter"] = 1;
                }else{
                    params["isNewVisiter"] = 2;
                }
            }else{
                timeList = [uvTime,uvTime,uvTime];
                params["isNewVisiter"] = 1;
            }

            // 上次访问时间
            params["preVisiterTime"] = timeList[1];

            setCookie(cookieName, timeList.join("|"), "y5");
        }

        /**
         * 设置访客cookie _bltjb _bltjc
         * _bltjb   30分钟有效
         * _bltjc   当前浏览器有效
         * @param nowTTS   当前时间戳
         */
        function setVisitorsCookie(nowTime){
            var isNew = null,
                shortTime = "s180",
                sessionTime = "s0",
                _bltjb = getCookie("_bltjb"),
                _bltjc = getCookie("_bltjc");

            if(!_bltjb && !_bltjc){
                setCookie("_bltjb", nowTime, shortTime);
                setCookie("_bltjc", nowTime, sessionTime);
                isNew = nowTime;
            }else{
                //如果cookie中一个不存在，则生成另一个并覆盖访客id
                if(!!_bltjb){
                    if(isNaN( new Date(Number(_bltjb)).getTime() )){
                        _bltjb = _bltjb.split("-")[0];
                    }
                    setCookie("_bltjc", _bltjb, sessionTime);
                    isNew = _bltjb;
                }
                if(!!_bltjc){
                    if(isNaN( new Date(Number(_bltjc)).getTime() )){
                        _bltjc = _bltjc.split("-")[0];
                    }
                    setCookie("_bltjb", _bltjc, shortTime);
                    isNew = _bltjc;
                }
            }

            return Number(isNew);
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

                //发送请求
                sendRequest( getRequest() );
            },
            /**
             * 获取到设备信息
             *  @param equipmentInfo
             */
            setEquipmentInfo: function(equipmentInfo){
                //self.equipmentInfo = equipmentInfo || {};

                //设备号
                params["uuid"] = equipmentInfo["uuid"] || "";

                //会话id， app token
                params["visiterId"] = equipmentInfo["visiterId"] || "";

                //来源页标识
                params["referrerUrl"] = equipmentInfo["referrerUrl"] || "";

                //推送号
                params["jpushID"] = equipmentInfo["jpushID"] || "";

                //网络模式， 待定(移动，联通)
                params["netModel"] = equipmentInfo["netModel"] || "";

                //设备品牌名称
                params["devBrand"] = equipmentInfo["devBrand"] || "";

                //app渠道
                params["appChannel"] = equipmentInfo["appChannel"] || "";

                //app版本号
                params["appVersion"] = equipmentInfo["appVersion"] || "";

                //app安装时间
                params["appInstallTime"] = equipmentInfo["appInstallTime"] || "";
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
                params["eventCat1"] = cat1 || "";
                params["eventCat2"] = cat2 || "";

                /**
                 * 对pams中的字符串进行编码，防止特殊符号对后台转json对象有影响
                 */
                for(var key in pams){
                    if(isObjectType(pams[key],"String")){
                        if( /http:\/\//i.test(pams[key]) && /\?/i.test(pams[key]) ){
                            pams[key] = encodeURIComponent(pams[key].split("?")[0]);
                        }else{
                            pams[key] = encodeURIComponent(pams[key]);
                        }
                    }
                }
                params["eventParams"] = pams;

                //请求类型：事件请求
                params["tjType"] = "event";

                //发送请求
                sendRequest( getRequest() );
            },
            /**
             * 设置customerId，未设置从cookie中获取
             * @param customerId
             */
            setCustomerId: function(customerId){
                params["customerId"] = customerId || "";
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
             * bk：params["apiUrl"] = url;
             * @param url
             */
            setApiUrl: function(url){
                apiUrl = url;
            },
            /**
             * 设置站点id
             * @param siteId 站点编号
             */
            setSiteId: function(siteId){
                params["siteId"] = siteId || "";
            },
            /**
             * 修改参数值
             * @param name 参数名
             * @param value 修改值
             */
            setParamVal: function(name, value){
                //mainParams[name] = value;
                //params[name] = value || "";
            },
            /**
             * 给本次访问设置自定义变量
             * @param name
             * @param value
             */
            setCustomVariable: function(param){
                params["cv1"] = param.cv1 || "";
                params["cv2"] = param.cv2 || "";
                //setCookie("_bjtje", values.join("|"), "y5");
            },
            /**
             * 设置渠道来源
             * 用来标识开启M站页面的第三方渠道来源
             * @param channelSource
             */
            setChannelSource: function(channelSource){
                params["channelSource"] = channelSource || "";
            },
            /**
             * 测试，暂无用处
             */
            trackLink: function(){
                //alert("trackLink");
            }
        };
    };

    /**
     * 客户端事件
     */
    var eventDataFn = (function(){
        var appType;

        for(var i=0;i<window["_xwq"].length;i++){
            var n = window["_xwq"][i];
            if(n[0] == "setAppType"){
                appType = n[1] || "web";
                break;
            }
        }

        return {
            /**
             * 搜索列表页，商品点击事件
             */
            searchListPage_goodsClick: function(){
                if(!!$ && !!$().delegate){
                    var parentNode,delegateNode;
                    if(!appType || appType == "web"){
                        parentNode = document.getElementById("Content");
                        delegateNode = ".box";
                    }else{
                        parentNode = document.getElementById("thelist");
                        delegateNode = "dl";
                    }

                    $(parentNode).delegate(delegateNode, "click", function(e){
                        e = e || window.event;
                        if(!e.target) return;

                        var self = $(e.target);
                        var innerHtml = "",
                            goodsName = "",
                            sku = "",
                            href = "";

                        if(!appType || appType == "web"){
                            if(["IMG","FONT","SPAN"].indexOf(e.target.nodeName)<0) return;

                            var aHref = self.parent().attr("href");
                            if(aHref.indexOf("javascript")<0){
                                href = self.parent().attr("href");
                            }

                            innerHtml = self.parents( delegateNode ).html();
                            goodsName = innerHtml.match(/<p class="name">.*?(<font>(.*?)<\/font>).*?<\/p>?/)[2];
                            sku = innerHtml.match(/product=['"]*\s*(\d+)\s*['"]*/)[1];
                        }else{
                            if(e.target.nodeName=="A" && self.hasClass("btn")) return;

                            var dlNode = (e.target.nodeName == "DL") ? self : self.parents("DL");
                            var aNodes = dlNode.children("a");
                            for(var i=0;i<aNodes.length;i++){
                                var n = $(aNodes[i]);
                                if(n.attr("href").indexOf("javascript")<0){
                                    href = n.attr("href");
                                }
                            }

                            innerHtml = dlNode.html();
                            goodsName = innerHtml.match(/<p(.*?)>(.*?)<\/p>/)[2];
                            sku = innerHtml.match(/addProductToCart\((\d+)/)[1];
                        }

                        if(!href) return;

                        window["_xwq"].push(["trackEvent", "搜索商品", "商品点击", {
                            goodsName: encodeURIComponent( goodsName ),
                            sku: sku,
                            url: encodeURIComponent( href )
                        }]);
                    });
                }
            }
        }
    })();

    try{
        eventDataFn.searchListPage_goodsClick();
    }catch(e){
        params["errorMsg"] = "eventDataFn.searchListPage_goodsClick() => " + encodeURIComponent( e.message );
    }


    /**
     * 获取系统、浏览器、设备信息
     */
    var parsingUserAgent = function(){
        var user_agent = navigator.userAgent.toLowerCase();

        return {
            getUA: function(){
                return user_agent;
            },
            /**
             * 获取设备品牌信息
             * Equipment Brand
             */
            getEB: function(){
                var equipment ={
                    "xiaomi": ["mi ","hm note","redmi"],
                    "huawei": ["huawei","honor","h60-l01"],
                    "oppo": ["oppo"],
                    "vivo": ["vivo"],
                    "meizu": ["meizu","metal","mx5","mx4","m040","m355","m351","m031","m2 note"],
                    "oneplus": ["oneplus"],
                    "smartisan": ["smartisan","sm7","sm6","yq6"],
                    "zte": ["zte"],
                    "lenovo": ["lenovo"],
                    "gionee": ["gionee"],
                    "asus": ["asus"],
                    "tcl": ["tcl"],
                    "letv": ["letv"],
                    "360": ["360"],
                    "haier": ["haier"],
                    "coolpad": ["coolpad"],
                    "samsung": ["samsung","gt-","gt/","sm-","sm/"],
                    "lg": ["lg"],
                    "nexus": ["nexus"],
                    "sony": ["sony","l36h"],
                    "apply": ["ipad","iphone","ipod"],
                    "htc": ["htc"],
                    "moto": ["mto","moto"],
                    "nokia": ["nokia"]
                };

                var ua = user_agent.split(")")[0];
                for(var key in equipment){
                    for(var i=0; i<equipment[key].length; i++){
                        if(ua.indexOf(equipment[key][i])>=0){
                            return key;
                        }
                    }
                }
                return "";
            },
            /**
             * 获取设备类型
             * @returns {string}
             */
            getDT: function(){
                var Agents = ["android", "iphone", "symbianos", "windows phone", "ipad", "ipod", "mac os"];
                var flag = true;
                for(var v = 0; v < Agents.length; v++){
                    if(user_agent.indexOf(Agents[v]) > 0){
                        flag = false;
                        break;
                    }
                }
                return flag?"pc":"mobile";
            },
            /**
             * 浏览器信息
             */
            getBI: function(){
                var opera = window.opera;

                //micromessenger 微信 app 优先级最高
                if ( /micromessenger\/(\d+\.\d)/i.test(user_agent) ) {
                    return { name: "wechat", version: RegExp['\x241'] };
                }

                //QQ browser
                if ( /qqbrowser\/(\d+\.\d)/i.test(user_agent) ) {
                    return { name: "qq", version: RegExp['\x241'] };
                }

                //QQ 新闻app
                if ( /qqnews\/(\d+\.\d)/i.test(user_agent) ) {
                    return { name: "qq news", version: RegExp['\x241'] };
                }

                //QQ app
                if ( /qq\/(\d+\.\d)/i.test(user_agent) ) {
                    return { name: "qq app", version: RegExp['\x241'] };
                }

                //baidu browser
                if ( /((baidu)|(bidu))browser(\/|\s)(\d\.\d)/i.test(user_agent) ) {
                    return { name: "baidu", version: RegExp['\x245'] };
                }

                //baidu app
                if ( /baiduboxapp\/((\d\_(\d+\.)+\d)|(\d\.\d))/i.test(user_agent) ) {
                    return { name: "baidu app", version: RegExp['\x241'] };
                }

                //支付宝 app
                //mozilla/5.0 (linux; u; android 6.0.1; zh-cn; mi 5s plus build/mxb48t) applewebkit/534.30 (khtml, like gecko) version/4.0 ucbrowser/1.0.0.100 u3/0.8.0 mobile safari/534.30 alipaydefined(nt:wifi,ws:393|698|2.75) aliapp(ap/10.0.0.122205) alipayclient/10.0.0.122205 language/zh-hans usestatusbar/true
                if ( /alipayclient\/(\d(\d+\.)+\d+)/i.test(user_agent) ) {
                    return { name: "alipay", version: RegExp['\x241'] };
                }

                //ucbrowser
                if ( /ucbrowser\/(\d+\.\d)/i.test(user_agent) || /ucweb\/(\d+\.\d)/i.test(user_agent) ) {
                    return { name: "uc", version: RegExp['\x241'] };
                }

                //搜狗浏览器`SE 2.X
                if ( /sogoumobilebrowser\/(\d+\.\d)/i.test(user_agent) || /se (\d+)\.*/i.test(user_agent) ) {
                    return { name: "sogou", version: RegExp['\x241'] };
                }

                //猎豹
                if ( /liebaofast\/(\d+\.\d)/i.test(user_agent) ) {
                    return { name: "liebao", version: RegExp['\x241'] };
                }

                //MxBrowser mxbrowser 遨游
                if ( /mxbrowser\/(\d+\.\d)/i.test(user_agent) || /maxthon\/(\d+\.\d)/i.test(user_agent) ) {
                    return { name: "aoyou", version: RegExp['\x241'] };
                }

                //2345浏览器
                if ( /2345browser\/(\d+\.\d)/i.test(user_agent) ) {
                    return { name: "2345", version: RegExp['\x241'] };
                }

                //ubrowser
                if ( /ubrowser\/(\d+\.\d)/i.test(user_agent) ) {
                    return { name: "ubrowser", version: RegExp['\x241'] };
                }

                //小米浏览器
                if ( /xiaomi\/miuibrowser\/(\d+\.\d)/i.test(user_agent) ) {
                    return { name: "xiaomi", version: RegExp['\x241'] };
                }

                //绿茶浏览器
                if ( /lebrowser\/(\d+\.\d)/i.test(user_agent) ) {
                    return { name: "lvcha", version: RegExp['\x241'] };
                }

                //360 会有将firefox统计成360的情况
                //if((window.navigator.mimeTypes[40] || !window.navigator.mimeTypes.length)){
                //    browser.exploreName = "360";
                //    browser.exploreVersion = "";
                //}
                if ( /360se/i.test(user_agent) ) {
                    return { name: "safari", version: "" };
                }

                //isIE6   : /msie 6.0/.test(UserAgent), // IE6
                //isIE7   : /msie 7.0/.test(UserAgent), // IE7
                //isIE8   : /msie 8.0/.test(UserAgent), // IE8
                //isIE9   : /msie 9.0/.test(UserAgent), // IE9
                //isIE10  : /msie 10.0/.test(UserAgent), // IE10
                //isIE11  : /msie 11.0/.test(UserAgent), // IE11
                //ie
                if (/(msie\s|trident.*rv:)([\w.]+)/.test(user_agent)) {
                    var version = 0;
                    var v1 = user_agent.match(/(?:msie\s([\w.]+))/);
                    var v2 = user_agent.match(/(?:trident.*rv:([\w.]+))/);
                    if (v1 && v2 && v1[1] && v2[1]) {
                        version = Math.max(v1[1] * 1, v2[1] * 1);
                    } else if (v1 && v1[1]) {
                        version = v1[1] * 1;
                    } else if (v2 && v2[1]) {
                        version = v2[1] * 1;
                    } else {
                        version = 0;
                    }

                    return {
                        name: "ie",
                        version: version
                    };
                }

                //chrome
                //"mozilla/5.0 (windows nt 6.1; wow64) applewebkit/537.36 (khtml, like gecko) chrome/48.0.2564.97 safari/537.36"
                if ( /chrome\/(\d+\.\d)/i.test(user_agent) || /crios\/(\d+\.\d)/i.test(user_agent) ) {
                    return { name: "chrome", version: RegExp['\x241'] };
                }

                //safari
                if ( /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(user_agent) ) {
                    return { name: "safari", version: (RegExp['\x241'] || RegExp['\x242']) };
                }

                //firefox
                if ( /firefox\/(\d+\.\d)/i.test(user_agent) ) {
                    return { name: "firefox", version: RegExp['\x241'] };
                }

                // Opera
                //var isOpera = /opr\/(\d+\.\d)/i.test(user_agent) || /presto\/(\d+\.\d)/i.test(user_agent);
                if ( /opera/i.test(user_agent) ){
                    return { name: "opera", version: "" };
                }

                return browser;
            },
            /**
             * 系统信息
             * @returns {*}
             */
            getOS: function(){
                if(!user_agent){
                    return { name: "", version: "" };
                }

                if( /iphone os (\d+\_\d)/i.test(user_agent) ){
                    return {
                        name: "iPhone IOS",
                        version: ""
                        //version: RegExp['\x241']
                    };
                }
                if( /ipad os (\d+\_\d)/i.test(user_agent) ){
                    return { name: "iPad IOS", version: "" };
                }
                if( /ipod/i.test(user_agent) ){
                    return { name: "iPod IOS", version: "" };
                }
                if( /mac os x/i.test(user_agent) ){
                    return { name: "mac", version: "" };
                }

                //安卓系统
                if( /android (\d+\.\d)/i.test(user_agent) ){
                    return { name: "android", version: "" };
                }

                if( /windows nt 5.0/i.test(user_agent) ){
                    return { name: "windows", version: "2000" };
                }
                if( /windows nt 5.1/i.test(user_agent) ){
                    return { name: "windows", version: "xp" };
                }
                if( /windows nt 5.2/i.test(user_agent) ){
                    return { name: "windows", version: "2003" };
                }
                if( /windows nt 6.0/i.test(user_agent) ){
                    return { name: "windows", version: "vista" };
                }
                if( /windows nt 6.1/i.test(user_agent) ){
                    return { name: "windows", version: "7" };
                }
                if( /windows nt 6.2/i.test(user_agent) ){
                    return { name: "windows", version: "8" };
                }
                if( /windows nt 6.3/i.test(user_agent) ){
                    return { name: "windows", version: "8.1" };
                }
                if( /windows nt 10/i.test(user_agent) ){
                    return { name: "windows", version: "10" };
                }

                if( /linux/i.test(user_agent) ){
                    return { name: "linux", version: "" };
                }

                var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
                if (isUnix){
                    return { name: "unix", version: "" };
                }

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
                "sem": ["baidu.com/baidu.php"]
            },
            "sogou": {
                "brand": ["ctb.brand.sogou.com"],
                "sem": ["www.sogou.com/bill_cpc"]
            },
            "360": {
                "brand": ["click.dsp.com"],
                "sem": ["e.tf.360.cn"]
            },
            "google": null,
            "yahoo": null
        };

        function init(){
            //获取cookie 中的 referrerUrl
            biRefer = getCookie("bi_refer") || document.referrer || "";
            if(!biRefer) return false;

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
     *  先从cookie "_bitj" 中获取uuid，如果没有生成一个新的并存储到 "_bitj" 的cookie中
     * @returns {*} uuid
     */
    var getUUID = function(){
        var _uuid,_bitj;

        _bitj = getCookie("_bitj");
        if(!!_bitj){
            _uuid = _bitj;
        }else{
            _uuid = Math.uuid();
        }

        setCookie("_bitj", _uuid, "y5");
        return _uuid;
    };

    /**
     * 获取年月日格式的数据
     * @param strTime
     * @returns {string}
     */
    var getYMDToTime = function(strTime){
        var ymd = Number(strTime),
            date = null;

        if(isNaN( ymd )){
            date = new Date(strTime);
        }else{
            date = new Date(ymd);
        }

        return date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
    };

    /**
     * 根据新老时间获取时间天数差
     * @param newTime   新时间,可以是时间戳，也可以是时间格式字符串
     * @param oldTime   老时间,可以是时间戳，也可以是时间格式字符串
     * @returns {days}  天数 时间没有转换成功为null，0为同一天
     */
    var getDayByInterval = function(newTime,oldTime){
        var newTimeStamp = new Date(newTime).getTime();
        var oldTimeStamp = new Date(oldTime).getTime();
        var daysStamp = 24*60*60*1000;
        var days = null;

        if(!isNaN(newTimeStamp) && !isNaN(oldTimeStamp)){
            var newDays = Math.floor( newTimeStamp/daysStamp);
            var oldDays = Math.floor( oldTimeStamp/daysStamp);
            days = newDays - oldDays ;
        }
        return days;
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

