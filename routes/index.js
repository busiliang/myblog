//引入集合操作方法
var User = require('../model/User');
var Post = require('../model/Post');
//引入一个加密插件
var crypto = require('crypto');
//引入上传的文件
var multer= require('multer');
var storage = multer.diskStorage({
    destination:function (req,file,cd) {
        cd(null,'./public/images')
    },
    filename:function (req,file,cd) {
        cd(null,file.originalname);
    }
})
var upload = multer({storage:storage})



//未登录的时候
function checkLogin(req,res,next) {
    if(!req.session.user){
        req.flash('error','未登录');
        return res.redirect('/login');

    }
    next();
}
// 已登录的情况下
function checkNotLogin(req,res,next) {
    if(req.session.user){
        req.flash('error','已登录');
        return res.redirect('back');

    }
    next();
}
module.exports = function (app) {
    app.get('/',function (req,res) {

        Post.get(null,function (err,docs) {
            if(err){
                req.flash('error',err);
                return res.redirect('/')
            }
            res.render('index',{
                title:'首页',
                user:req.session.user,
                success:req.flash('success').toString(),
                error:req.flash('error').toString(),
                docs:docs
            })

        })

    })
    // 注册页面
    app.get('/reg',checkNotLogin,function (req,res) {
        res.render('reg',{
            title:'注册页面',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        })
    })
    //注册行为
    app.post('/reg',function (req,res) {
    //把数据存放到数据库中
    //    1.收集数据
        var username = req.body.username;
        var password = req.body.password;
        var password_repeat = req.body['password_repeat'];

    //     2.判断两次密码是否正确
        if(password != password_repeat){
            req.flash('error','两次密码输入不正确');
            return res.redirect('/reg');
        }
    //     3.对密码进行加密
        var md5 = crypto.createHash('md5');
        password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            username :username,
            password :password,
            email:req.body.email
        })
        // 4.
        User.get(newUser.username,function (err,user) {
            if(err){
                req.flash('error',err);
                return res.redirect('/reg');
            }
            if(user){
                req.flash('error','用户名已存在');
                return res.redirect('/reg');
            }

    //    5.
        newUser.save(function (err,user) {
            if(err){
                req.flash('error',err);
                return res.redirect('/reg');
            }
            req.session.user = newUser;
            req.flash('success','注册成功');
            return res.redirect('/');

        })
        })
    })
    //登录
    app.get('/login',checkNotLogin,function (req,res) {
        res.render('login',{
            title:'登录页面',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        })
    })
    //登录行为
    app.post('/login',function (req,res) {
        //1.对密码进行加密 2.判断用户是否存在 3.判断密码是否正确
        // 4.把用户登陆的信息保存在session中 并给出提示 跳转到首页


        // 2.对密码进行加密
        var md5 = crypto.createHash('md5');
        password = md5.update(req.body.password).digest('hex');
        // 3.

        User.get(req.body.username,function (err,user) {
            if(err){
                req.flash('error',err);
                return res.redirect('/login');
            }
            if(!user){
                req.flash('error','用户名不存在');
                return res.redirect('/login');
            }
            if(user.password != password){
                req.flash('error','密码错误');
                return res.redirect('/login');
            }
            req.session.user = user;
            req.flash('success','登录成功');
            return res.redirect('/');

        })



    })
    // 发表页面
    app.get('/post',checkLogin,function (req,res) {
        res.render('post',{
            title:'发表页面',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        })
    })
    // 发表行为
    app.post('/post',function (req,res) {
        var currentName = req.session.user.username;
        var newPost = new Post(currentName,req.body.title,req.body.content);
        newPost.save(function (err) {
            if(err){
                req.flash('error',err);
                return res.redirect('/');
            }
            req.flash('success','发表行为');
            return res.redirect('/');
        })

    })
    // 退出
    app.get('/logout',checkLogin,function (req,res) {
        //将session里面的信息清除 并给出提示信息 跳转到首页
        req.session.user = null;
        req.flash('success','成功退出');
        return res.redirect('/');
    })
    app.get('/upload',checkLogin,function (req,res) {
        res.render('upload',{
            title:'上传',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        })
    })
    app.post('/upload',upload.array('filename',5),function (req,res) {
        req.flash('success','上传成功');
        return res.redirect('/upload');
    })



}
