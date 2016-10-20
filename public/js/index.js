/**
 * Created by Administrator on 2016/7/26.
 */

$(document).ready(function(){
    var i = 0;
    var sku = 111;
    $("#testBtn").click(function(){
        _xwq.push(['setCustomVariable', "ddd", "7777"]);
        _xwq.push(["setCustomerId", "111"]);

        _xwq.push(['trackEvent','主流程', '首页加入购物车', {
            "current_url":"http://m.benlai.com/zt/161009yz?specialChar=pk_campaign=yizhifu,pk_kwd=yizhifu,_bitrack=221226&wxErrMsg=微信授权回调防CSRF攻击校验码验证失败&wxStatus=4"
            }
        ]);

        //_xwq.push(['trackLink', 'testBtn', 'clicked']);

        console.log("点击了按钮"+(++i)+"次");
    });
});


