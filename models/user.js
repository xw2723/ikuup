/**
 * 用户表映射
 * @type {*|exports|module.exports}
 */
var mongoose = require("mongoose");

//创建模型
var Schema = mongoose.Schema;
var userScheMa = new Schema({
    username: String,   //用户名
    password: String,   //密码
    sax: {type:Number, default: 2}, //性别
    createTime: {type:Date, default:Date.now}   //创建时间
});

// 与数据库users集合表关联
exports.user = mongoose.model('users', userScheMa);