/**
 * ajax
 */
(function($){
    var _ajax=$.ajax;

    $.ajax=function(opt){
        var fn = {
            beforeSend: function(XMLHttpRequest){},
            error: function(XMLHttpRequest, textStatus, errorThrown){},
            success: function(data, textStatus){},
            complete: function(XMLHttpRequest, textStatus){}
        };

        if(opt.beforeSend) fn.beforeSend=opt.beforeSend;
        if(opt.error) fn.error=opt.error;
        if(opt.success) fn.success=opt.success;
        if(opt.complete) fn.complete=opt.complete;

        var btnLoading = null;
        if(opt.btnLoadingId){
            btnLoading = Ladda.create( document.getElementById(opt.btnLoadingId) );
        }

        var _opt = $.extend(opt,{
            beforeSend: function(XMLHttpRequest){
                if(opt.isLoading) $('#ajaxLoadingDialog').modal('show');
                if(opt.btnLoadingId) btnLoading.start();
                fn.beforeSend(XMLHttpRequest);
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                if(opt.isLoading) $('#ajaxLoadingDialog').modal('hide');
                if(opt.btnLoadingId) btnLoading.stop();
                throw errorThrown;
                fn.error(XMLHttpRequest, textStatus, errorThrown);
            },
            success:function(data, textStatus){
                fn.success(data, textStatus);
            },
            complete: function(XMLHttpRequest, textStatus){
                if(opt.isLoading){
                    window.setTimeout(function(){
                        $('#ajaxLoadingDialog').modal('hide');
                    },1000);
                }
                if(opt.btnLoadingId) {
                    window.setTimeout(function(){
                        btnLoading.stop();
                    }, 500);
                }
                fn.complete(XMLHttpRequest, textStatus);
            }
        });
        _ajax(_opt);
    };
})(jQuery);

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
        domainStr = ";domain=" + (domain ? domain: document.domain);

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
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "=" + cval + ";expires=" + exp.toGMTString();
};

<!-- Piwik -->
//var _paq = _paq || [];
////_paq.push(['testClick', 'testing']);
//_paq.push(['trackPageView']);
//_paq.push(['enableLinkTracking']);
//(function() {
//    var u="//localhost:3000/piwik/";
//    _paq.push(['setTrackerUrl', u+'piwik']);
//    _paq.push(['setSiteId', 1]);
//    //_paq.push(['trackLink', '//localhost:3000/user/login', 'get']);
//
//    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
//    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
//})();
<!-- End Piwik Code -->


//清理参数值的中的特殊符号
//var clearJSON = function(jsonP){
//    for(var k in jsonP){
//        var n = jsonP[k];
//        if(typeof n == "string") jsonP[k] = n.replace(/[\t\n\r\'\"\\\^\*\{\}\L\<\>]/g, '');
//        if(typeof n == "object") jsonP[k] = clearJSON(jsonP[k]);
//    }
//    return jsonP;
//};
//params = clearJSON(params);



//var a = {
//    "siteId": 11,
//        "eventCat1": "APP下载",
//        "eventCat2": "下载提示展现",
//        "eventParams": {
//        "current_url": "http://m.benlai.com/gpsLoading?redirUrl=sx&backurl=/bj/product/2983"
//    },
//    "tjType": "event",
//    "visitTime": "1477369503694",
//    "visiterId": "1477369503694-07568F00-6D01-4D50-9CE9-DE461508DA99",
//    "isNewVisiter": 1,
//    "preVisiterTime": 1477369503694,
//    "version": 2,
//    "uuid": "07568F00-6D01-4D50-9CE9-DE461508DA99",
//    "title": "本来生活手机站 - 中国家庭优质食品购买平台",
//    "pageUrl": "http://m.benlai.com/gpsLoading?redirUrl=sx&backurl=/bj/product/2983",
//    "pageParameter": "redirUrl=sx&backurl=/bj/product/2983",
//    "pageDomain": "m.benlai.com",
//    "pagePath": "/gpsLoading",
//    "referrerUrl": "http://m.baidu.com/from=1086k/bd_page_type=1/ssid=0/uid=0/pu=usm%401%2Csz%401320_1002%2Cta%40iphone_2_4.4_2_5.5/baiduid=D8D1110B2D32028F92E2A5FB64751F40/w=0_10_/t=iphone/l=3/tc?ref=www_iphone&lid=12649452178910875138&order=1&fm=alop&tj=www_normal_1_0_10_title&vit=osres&m=8&srd=1&cltj=cloud_title&asres=1&nt=wnor&title=%E6%81%A9%E6%96%BD%E9%AB%98%E5%B1%B1%E5%BD%93%E5%AD%A3%E6%B4%8B%E8%8D%B7500g%E4%BB%B7%E6%A0%BC%E5%A4%9A%E5%B0%91%E9%92%B1%E5%9B%BE%E7%89%87..._%E6%9C%AC%E6%9D%A5%E7%94%9F%E6%B4%BB%E7%BD%91&dict=32&w_qd=IlPT2AEptyoA_ykzy3kpxfOx3z6SgpEbtEQZfQ8S-4q&sec=16180&di=0fc14b6fe8147c37&bdenc=1&nsrc=IlPT2AEptyoA_yixCFOxXnANedT62v3IEQGG_yxV0DKvpI39h47aUbBjVjLy0Sn4S-K8vHKDfK",
//    "referrerDomain": "m.baidu.com",
//    "referrerPath": "/from=1086k/bd_page_type=1/ssid=0/uid=0/pu=usm%401%2Csz%401320_1002%2Cta%40iphone_2_4.4_2_5.5/baiduid=D8D1110B2D32028F92E2A5FB64751F40/w=0_10_/t=iphone/l=3/tc",
//    "referrerParameter": "",
//    "searchEngine": "baidu",
//    "searchKeyword": "",
//    "searchType": "seo",
//    "source": "s",
//    "userAgent": "Mozilla/5.0 (Linux; U; Android 4.4.4; zh-cn; TCL P501M Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko)Version/4.0 MQQBrowser/5.5 Mobile Safari/537.36",
//    "deviceType": "mobile",
//    "osName": "android",
//    "osVersion": "4.4",
//    "exploreName": "qq",
//    "exploreVersion": "5.5",
//    "screenPoint": "480x854",
//    "bitrack": "",
//    "siteSearchKeyword": "",
//    "siteSearchSkuCount": "",
//    "siteSearchTopSku": "",
//    "customerId": "",
//    "webSiteId": "1",
//    "cityId": "2",
//    "ip": "117.135.170.67",
//    "createTime": "1477369542778"
//};



function getDeviceInfo(){
    return {
        uuid: "24CF88A2-C295-4413-A7F3-90426672531B",
        referrerUrl: 1,
        visiterId: "1477996542820-FIEJIFE",

        jpushID: "123123",
        netModel: "中国移动",
        devBrand: "xiaomi",
        appChannel: "appstore",
        appVersion: "2.2.2",
        appInstallTime: 1477996542820
    };
}

//测试
//"http://bzclk.baidu.com/adrc.php?t=06K00c00fZHzw60JfGy0Kay6jPf0Im00000caYpj300000IEc9BV.THvkE_aYzxJee6K85yF9pywdpAqVuNqsusK15yRYuW01PyN-nj0snjTznW00IHYdPYPKnjfsnj-DnW6Ynb7KwRuAnYnsn1m3nW0YPW9KfsK95gTqFhdWpyfqnW6zPWmvP16nBusThqbpyfqnHm0uHdCIZwsrBtEIIQhF-Uhk9pi4WUvYEfdKHRhNbpgF-mfOTFW5ydsFMP4Tv4E5HckPHn3PiudThsqmR9inAPDUunnvf1uZbdpNGgPgPuNvVdyHc4IDb1fMFmnb4Cm-9apA7guZNfNDNVmYIYuhD1uAVfNDRqFMKogvP9UgK9pyI85HDhTAVxpIb5HD0mFW5HDzPWc4&tpl=tpl_10085_14394_1&l=1047049344&wd=%E6%9C%AC%E6%9D%A5%E7%94%9F%E6%B4%BB&issp=1&f=3&ie=utf-8&rqlang=cn&tn=baiduhome_pg&rsp=0",
//"https://www.baidu.com/baidu.php?sc.060000jZYuibWkd0MB6IS3j0aNftz67K7YAh6MhtYTJGXKayuxtSSUqgPNz7I9XIRXuBIY4pu5S1Ksgcfyv2MNvb5h0Nn4qxwNOK6Rm68yu8e9bzE6zbVqfkpmtcj2nJoJ_7FNlPcd3EodKDd80TFVn05JuAFnjz85KQ_7rgA2d12YBf.Db_aqnN7-lc59OPS5SVP14bsYrtTYQAMZdWYwkrmotIW__l3FJQj5eOS8zZqOSFYOoYUSPAZKOvP5O76EORS85qXMtEYgOW_zsOJRPxOmzxy9jSGqTxtWFvU3xd2raZqHl3OSkbeIn5l-jy1k8ex1xtjtVAOtejZgZvt_QrMAzONDkWx7WuxaOoWeXgV3QhcYlNPHV2XgZJyAp7WIgYe-0.U1Yk0ZDq_Ue0VnMl8S30IjvkE_aYzxJee6KGUHYznjf0u1dBUW0s0ZNG5yF9pywd0ZKGujYz0APGujY1rHb0UgfqnH0zndtknjDg1nknWKxnH0krfKopHYs0ZFY5H61PsK-pyfqnHfzPdtznjT4PNtkrjc3nNtkP1bYndtznH03P7tznHnPdtznHD4n7tznHnndtznHnzn6KBpHYznjwxnHRd0AdW5H7xnW04rjT3njf1g1Dsn-tznjbYnjndnW60TgKGujYs0Z7Wpyfqn0Kzuw9u1Ys0AqvUjYzPWm4Qywlg1cvPW-mQywlg1n3PHcVn7t3PHbVnsK9mWYsg100ugFM5H00TZ0qnWRPjnknjfd0A4vTjYsQW0snj0snj0s0AdYTjYs0AwbU0qn0KzpWYs0Aw-IWdsmsKhIjYs0ZKC5H00Unqn0KBI1Ykn0K8IjYs0ZPl5fKYIgnqnHn3PWcYn1m3n1TdnWc4n103nfKzug7Y5HDYP1m3P101Pjb1PWR0Tv-b5yRYuW01PyN-nj0snjTznW00mPV5HI7fWT3njIAnHwDfYndnDc0mynqnfKsUWYs0Z7VIjYs0Z7VT1Ys0ZGY5H00UyPxuMFEUHYsg1Kxn7ts0AwYpyfqn0K-IA-b5iYk0A71TAPW5H00IgKGUhPW5H00Tydh5H00uhPdIjYs0ZGsUZN15H00mFW5HczrHc&us=0.0.0.0.0.0.10&ck=4081.8.88.259.303.292.282.490&shh=www.baidu.com&sht=baiduhome_pg&us=1.0.3.0.3.1203.0&wd=%E6%9C%AC%E6%9D%A5%E7%94%9F%E6%B4%BB&issp=1&f=3&ie=utf-8&rqlang=cn&tn=baiduhome_pg&rsp=0"
//"https://www.baidu.com/link?url=B-veTkk6WZgts_eC2UUa8AxUNAW9y-1P3eThQxaxdiCC7N0yVFsRUYhC60r5sdz&wd=&eqid=e4f035ee0000722000000003580740cd"
//https://www.google.co.jp/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=0ahUKEwiQhMuf4ejPAhVJzFQKHWKYA28QFggcMAA&url=https%3A%2F%2Fwww.benlai.com%2F&usg=AFQjCNE9uBkOAby653Sub7FW29gq0Z-vuA&cad=rja
setCookie(
    "bi_refer",
    "http://bzclk.baidu.com/adrc.php?t=06K00c00fZHzw60JfGy0Kay6jPf0Im00000caYpj300000IEc9BV.THvkE_aYzxJee6K85yF9pywdpAqVuNqsusK15yRYuW01PyN-nj0snjTznW00IHYdPYPKnjfsnj-DnW6Ynb7KwRuAnYnsn1m3nW0YPW9KfsK95gTqFhdWpyfqnW6zPWmvP16nBusThqbpyfqnHm0uHdCIZwsrBtEIIQhF-Uhk9pi4WUvYEfdKHRhNbpgF-mfOTFW5ydsFMP4Tv4E5HckPHn3PiudThsqmR9inAPDUunnvf1uZbdpNGgPgPuNvVdyHc4IDb1fMFmnb4Cm-9apA7guZNfNDNVmYIYuhD1uAVfNDRqFMKogvP9UgK9pyI85HDhTAVxpIb5HD0mFW5HDzPWc4&tpl=tpl_10085_14394_1&l=1047049344&wd=%E6%9C%AC%E6%9D%A5%E7%94%9F%E6%B4%BB&issp=1&f=3&ie=utf-8&rqlang=cn&tn=baiduhome_pg&rsp=0"
);

//setCookie("_bltja","1476028800000|1476028800000|1476028800000","y5")

<!-- xwpk -->
var _xwq = _xwq || [];
//_xwq.push(['setParamVal', 'domain', 'test domain!!!']);
//_xwq.push(['trackEvent','主流程', '首页加入购物车',
//    {
//        "current_url":"http://m.benlai.com/zt/161009yz?specialChar=pk_campaign=yizhifu,pk_kwd=yizhifu,_bitrack=221226&wxErrMsg=微信授权回调防CSRF攻击校验码验证失败&wxStatus=4"
//    }
//]);
(function() {
    //生产
    //var u = "//bitj.benlai.com/Trafficstatistics/tj/";
    //测试
    //var u = "//192.168.60.28:8080/Bitj/tj/";
    //本地
    //var u="//localhost:3000/piwik/";
    var u="//10.10.110.113:3000/piwik/";

    _xwq.push(["setSiteId", 888]);
    _xwq.push(["setChannelSource", 789]);
    //_xwq.push(["setCustomVariable", {
    //    "cv1":"页面名称",
    //    "cv2":"页面说明"
    //}]);
    //_xwq.push(["setCustomerAuto", "off"]);    //设置customerId是否自动从cookie中获取， on自动(默认)，off关闭
    //_xwq.push(["setCustomerId", "101"]);      //设置customerId
    //_xwq.push(["setAppType", "m"]);         //默认为web站, m, app
    //_xwq.push(["setEquipmentInfo", getDeviceInfo()]);   //默认为web站

    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'_xwpk.js'; s.parentNode.insertBefore(g,s);
})();
<!-- End xwpk Code -->


//android 13
//ios 12


//示例    PC站
//var _xwq = _xwq || [];
//(function () {
//    var u = "";
//    //假设环境字段为environmentType
//    if(environmentType=="生产"){
//        u = "//bitj.benlai.com/Trafficstatistics/";
//    }else{
//        u = "//192.168.60.28:8080/Bitj/";
//    }
//    _xwq.push(["setSiteId", 10]);
//    var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
//    g.type = 'text/javascript'; g.async = true; g.defer = true; g.src = u + 'tj/xwpk.js'; s.parentNode.insertBefore(g, s);
//})();


//示例    M站
//var _xwq = _xwq || [];
//(function () {
//    var u = "";
//    //假设环境字段为environmentType
//    if(environmentType=="生产"){
//        u = "//bitj.benlai.com/Trafficstatistics/";
//    }else{
//        u = "//192.168.60.28:8080/Bitj/";
//    }
//    _xwq.push(["setSiteId", 11]);
//    var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
//    g.type = 'text/javascript'; g.async = true; g.defer = true; g.src = u + 'tj/xwpk.js'; s.parentNode.insertBefore(g, s);
//})();