/**
 * 用户表映射
 * @type {*|exports|module.exports}
 */
var mongoose = require("mongoose");

//创建模型
var Schema = mongoose.Schema;
var userScheMa = new Schema({
    name: String,       //用户名
    pass: String,       //密码
    mobile: Number,     //手机
    email: String,      //邮箱
    nickname: String,  //昵称
    birthday: Date,    //生日
    sax: {type:Number, default: 2},     //性别
    createTime: {type:Date, default:Date.now}   //创建时间
});

// 与数据库users集合表关联
exports.user = mongoose.model('users', userScheMa);