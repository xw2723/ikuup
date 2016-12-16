var userLoginApp = angular.module("userLoginApp", []);

//登录
userLoginApp.controller("userLoginCtrl",["$scope", function($scope){
    var self = this;

    $scope.user = {
        username: null,
        password: null,
        confirmPass: null,
        validationCode: null,
        tag: null
    };

    this.init = function(){
        angular.element(document).ready(function(){
            $.backstretch("../../img/4.jpg");
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

    $scope.updateCode = function(){
        //更新验证码
    };

    this.init();
}]);