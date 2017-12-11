// 面对对象编程
//链接数据库实例
var mongodb = require('./db');
//创建一个构造函数 命名为user 里面的username，password email 分别存放用户名 密码和email

function User(user) {
    this.username = user.username;
    this.password = user.password;
    this.email = user.email;
}
module.exports = User;
User.prototype.save = function (callback) {
    var user = {
        username :this.username,
        password :this.password,
        email:this.email
    }
    mongodb.open(function (err,db) {
    //
        if(err){
            return callback(err);
        }
        db.collection('users',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            //将数据插入到users集合中
            collection.insert(user,{safe:true},function (err,user) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,user[0]);
            })
        })
    })

}
User.get = function (username,callback) {
//    打开数据库
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('users',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            //查询出name未指定用户名的用户信息，将结果返回
            collection.findOne({username:username},function (err,user) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,user)
            })
        })
    })
}
User.get = function (username,callback) {
//    打开数据库
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('users',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            //查询出name未指定用户名的用户信息，将结果返回
            collection.findOne({username:username},function (err,user) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,user)
            })
        })
    })
}