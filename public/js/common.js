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
                throw JSON.stringify(errorThrown);
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

<!-- xwpk -->
var _xwq = _xwq || [];
//_xwq.push(['setParamVal', 'domain', 'test domain!!!']);
(function() {
    //var u="//localhost:3000/piwik/";
    var u="//10.10.110.113:3000/piwik/";
    //_xwq.push(["setCustomerAuto", "off"]);  //设置customerId是否自动从cookie中获取， on自动(默认)，off关闭
    _xwq.push(["setCustomerId", "101"]);
    _xwq.push(["setAppType", "web"]);
    _xwq.push(["setSiteId", 1]);

    //测试
    //_xwq.push(['setCustomVariable', "abc", "123456"]);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'_xwpk.js'; s.parentNode.insertBefore(g,s);
})();
<!-- End xwpk Code -->


//测试
//var _xwq = _xwq || [];
//(function() {
//    var u="//192.168.60.28:8090/Trafficstatistics/";
//    _xwq.push(["setApiUrl", u + 'HavisitLogController/redLog.do']);
//    //_xwq.push(['setCustomVariable', "abc", "123456"]);
//    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
//    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'tj/xwpk.min.js'; s.parentNode.insertBefore(g,s);
//})();