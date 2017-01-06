/**
 * Created by Administrator on 2016/7/26.
 */

function test(event){
    var ret = confirm("确认要离开吗?");
    if(ret){
        window.location.href = "user/login";
        event.preventDefault();
    }
}

var indexModule = angular.module("indexModule", []);

indexModule.controller("indexCtrl", ["$scope", "pageData", function ($scope, pageData) {
    var self = this;
    //$scope.user = {
    //    name: 'hello',
    //    id: 1
    //};
    $scope.flows = pageData.flows;
    $scope.click = function () {
        $scope.value = Math.random();
    };

    this.init = function(){
        angular.element(document).ready(function(){

        });
    };

    $scope.testBtn = function(){
        _xwq.push(["setCustomerId", "111"]);
        _xwq.push(['trackEvent','主流程', '首页加入购物车', {
            "current_url":"http://m.benlai.com/zt/161009yz?specialChar=pk_campaign=yizhifu,pk_kwd=yizhifu,_bitrack=221226&wxErrMsg=微信授权回调防CSRF攻击校验码验证失败&wxStatus=4"
            }
        ]);
    };

    this.init();
}]);

indexModule.directive("isolatedDirective", function () {
    return {
        scope: {
            //user: "=",
            action: "&"
        },
        template:
        //'Say：{{user.name}} <br>改变隔离scope的name：<input type="buttom" value="" ng-model="user.name"/>'+
        '<input type="button" value="在directive中执行父scope定义的方法" ng-click="action()"/>'
    }
});

indexModule.value("pageData", {
    flows: [
        {
            src: "/img/mt/11.jpg",
            info: "发射点发射得分士大夫撒旦法撒旦发射点发",
            browseCount: 123,
            commentCount: 123
        },
        {src:"/img/mt/11.jpg",info:"发射点发射得分士大夫撒旦法撒旦发射点发",browseCount:123,commentCount:123},
        {src:"/img/mt/11.jpg",info:"发射点发射得分士大夫撒旦法撒旦发射点发",browseCount:123,commentCount:123},
        {src:"/img/mt/11.jpg",info:"发射点发射得分士大夫撒旦法撒旦发射点发",browseCount:123,commentCount:123}
    ]
});

//$.mockjax({
//    url: "aaa",
//    responseText: {
//        name: "aaa",
//        url: "bbb"
//    }
//});
//$.mockjax({
//    url: "bbb",
//    responseText: {
//        name: "bbb",
//        url: "ccc"
//    }
//});
//$.mockjax({
//    url: "ccc",
//    responseText: {
//        name: "ccc"
//    }
//});
//
//var pending = (function(callback) {
//    var count = 0;
//    var returns = {};
//
//    console.log(count);
//    return function(key) {
//        count++;
//        console.log(count);
//        return function(data) {
//            count--;
//            console.log(count);
//            console.log(data);
//            returns[key] = data;
//            if (count === 0) {
//                callback(returns);
//            }
//        }
//    }
//});
//var done = pending(function(fileData) {
//    console.log('done');
//    console.log(JSON.stringify(fileData));
//});
//
//var fileName = ['aaa', 'bbb', 'ccc'];
//for(var i=0; i<fileName.length; i++) {
//    $.ajax({
//        url: fileName[i],
//        type: "GET",
//        dataType: "JSON",
//        success: done(fileName[i])
//    });
//}

//var itemList = [];
//var eachAjax = function(obj){
//    itemList.push({
//        name: obj.name,
//        url: obj.url
//    });
//    console.log(JSON.stringify(itemList));
//
//    if(obj.url){
//        $.ajax({
//            url: obj.url,
//            type: "GET",
//            dataType: "JSON",
//            success: function(res){
//                eachAjax(res);
//            }
//        });
//    }else{
//        console.log("结束");
//        return;
//    }
//};
//
//$.ajax({
//    url: "aaa",
//    type: "GET",
//    dataType: "JSON",
//    success: function(res){
//        eachAjax(res);
//    }
//});
