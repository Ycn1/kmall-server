 const Router = require('express').Router;

const UserModel = require('../models/user.js');

const hmac = require('../util/hamc.js')

 const router = new Router();

 router.post('/login',(req,res)=>{
	let body = req.body;
	let result = {
		code:0,
		message:''
	};
	UserModel
	.findOne({username:body.username,password:hmac(body.password),isAdmin:false})
	.then((user)=>{
		console.log(user);
		if(user){//登录成功
			 req.session.userInfo = {
			 	_id:user._id,
			 	username:user.username,
			 	isAdmin:user.isAdmin
			 }
			 console.log(req.session);
			 res.json(result);
		}else{
			result.code = 1;
			result.message = '用户名和密码错误'
			res.json(result);
		}
	})	
});
 
//注册新的用户
router.post('/',(req,res)=>{
	let body = req.body;
	let result = {
		code:0,
		message:''
	};
	UserModel
	.findOne({username:body.username})
	.then((user)=>{
		
		if(user){//登录成功
			res.json({
				code :1,
				message:"用户名已存在"
			})
		}else{
			result.code = 0;
			
			res.json(result);
		}
	})	
});
router.get('/namerigister',(req,res)=>{

	UserModel
	.findOne({username:req.query.username})
	.then((user)=>{
		
		if(user){
			res.json({
				code : 1,
				message :'用户名已存在'
			});
		}else{
			res.json({
				code:0
			})
			
		}
	})	
});

router.post('/register',(req,res)=>{
	let result = {
		code:0,
		message:''
	};

	UserModel.findOne({username:req.body.username},(err,data)=>{
		if(!err){//没有一样的username
			if(!data){
				// hmac.update(req.body.password);
				 new UserModel({
					username:req.body.username,
					password:hmac(req.body.password),
					phone:req.body.phone,
					email:req.body.email,
					
				
				}).save((err,data)=>{
					res.json(result);
				})
				
			}else{
				result.code = 1;
				result.message = '用户已存在';
				res.json(result);

			}
		}else{
			result.code = 1;
		}
	});
});

/*
 router.use((req,res,next)=>{
 	
 	if(req.userInfo.isAdmin){
 		next()
 	}else{
 		res.send({
			code:10
		});
 	}

 });*/

router.get('/logout',(req,res)=>{
	let result  = {
		code:0,// 0 代表成功 
		message:''
	}
	// req.cookies.set('userInfo',null);
	req.session.destroy();
	res.json(result);

});
router.get('/userInfo',(req,res)=>{
	if(req.userInfo._id){
		res.json({
			code :0,
			data:req.userInfo
		})
	}else{
		res.json({
			code:10
		})
	}
})
router.get('/repassword',(req,res)=>{
	
})

 module.exports = router;

