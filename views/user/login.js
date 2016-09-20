/**
 * Created by Administrator on 2016/7/26.
 */

var userLoginApp = angular.module("userLoginApp", []);

//登录
userLoginApp.controller("userLoginCtrl",["$scope", function($scope){
    var self = this;

    $scope.user = {
        username: null,
        password: null,
        confirmPass: null
    };

    this.init = function(){
        angular.element(document).ready(function(){
            $("<img/>").attr('src', '/img/bg/login-bg.jpg').load(function () {
                console.log("背景图片加载完成！");
            });
        });
    };

    $scope.doRegister = function(){
        $.ajax({
            url: "doRegister",
            data:{
                username: $scope.user.username,
                password: $scope.user.password
            },
            dataType:'json',
            type:'post',
            isLoading: true,
            success: function(res){
                console.log(res.msg);
            }
        });
    };

    $scope.doLogin = function(){
        $.ajax({
            url: "doLogin",
            data:{
                username: $scope.user.username,
                password: $scope.user.password
            },
            dataType:'json',
            type:'post',
            isLoading: true,
            success: function(res){
                console.log(res.msg);
            }
        });
    };

    this.init();
}]);