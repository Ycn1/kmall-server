 const Router = require('express').Router;

const UserModel = require('../models/user.js');

const hmac = require('../util/hamc.js')

 const router = new Router();

// const hmac = crypto.createHmac('sha256', 'ycnsgxnh');

 router.post('/login',(req,res)=>{
	// res.render('index');
	// res.send("index ok");
	// console.log('111');
	// console.log(req.body);
	let body = req.body;
	let result = {
		code:0,
		message:''
	};
	UserModel
	.findOne({username:body.username,password:hmac(body.password)})
	.then((user)=>{
		console.log(user);
		if(user){//登录成功
			 // result.data 
			 // req.cookies.set('userInfo',JSON.stringify(result.data));
			 req.session.userInfo = {
			 	_id:user._id,
			 	username:user.username,
			 	isAdmin:user.isAdmin
			 }
			 console.log(req.session);
			 res.json(result);
		}else{
			result.code = 10;
			result.message = '用户名和密码错误'
			res.json(result);
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


			console.log(data);
			if(!data){
				// hmac.update(req.body.password);
				 new UserModel({
					username:req.body.username,
					password:hmac(req.body.password),
					
				
				}).save((err,data)=>{
					res.json(result);
				})
				
			}else{
				result.code = 10;
				result.message = '用户已存在';
				res.json(result);

			}
		}else{
			result.code = 10;
		}
	});
});

router.get('/logout',(req,res)=>{
	let result  = {
		code:0,// 0 代表成功 
		message:''
	}
	// req.cookies.set('userInfo',null);
	req.session.destroy();
	res.json(result);

});

router.get('/repassword',(req,res)=>{
	
})

 module.exports = router;

