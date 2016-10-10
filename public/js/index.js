/**
 * Created by Administrator on 2016/7/26.
 */

$(document).ready(function(){
    var i = 0;
    var sku = 111;
    $("#testBtn").click(function(){
        _xwq.push(['setCustomVariable', "ddd", "7777"]);
        _xwq.push(["setCustomerId", "111"]);
        alert(123);
        _xwq.push(['trackEvent','主流程', '首页加入购物车', {
            "current_url": location.search.substr(1)
            }
        ]);

        //_xwq.push(['trackLink', 'testBtn', 'clicked']);

        console.log("点击了按钮"+(++i)+"次");
    });
});


