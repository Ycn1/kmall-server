 const Router = require('express').Router;

const UserModel = require('../models/user.js');

const ProductModel = require('../models/product.js');
const hmac = require('../util/hamc.js')

 const router = new Router();
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



router.get('/logout',(req,res)=>{
	let result  = {
		code:0,// 0 代表成功 
		message:''
	}
	// req.cookies.set('userInfo',null);
	req.session.destroy();
	res.json(result);

});


router.get('/username',(req,res)=>{
	if(req.userInfo._id){
		res.json({
			code :0,
			data:{
				username:req.userInfo.username
			}
		})
	}else{
		res.json({
			code:1
		})
	}
});
router.get('/productList',(req,res)=>{
	let page = req.query.page;
	let query = {status:0};
	if(req.query.categoryId){

		query.CategoryId = req.query.categoryId
	}else{
		query.name = {$regex:new RegExp(req.query.keyword,'i')}
	}

	let sort  = {order:-1}

	if(req.query.orderBy == 'price_asc'){
		sort  = {price:1}
	}else{
		sort  = {price:-1}
	}
	let projection = '';

	ProductModel.getPaginationProduct(page,query,projection,sort)
	.then(result=>{
		console.log(result)
		res.json({
			code :0,
			data:{
				list:result.list,
				current:result.current,
				total:result.total,
				pageSize:result.pageSize,
				status:result.status
			}
		})
	})
	.catch(e=>{
		res.json({
			code :1,
		})
	})


});

router.get('/productDetail',(req,res)=>{
	
	ProductModel
	.findOne({status:0,_id:req.query.productId},'-__v -createAt')
	.then(product=>{
		
		res.json({
			code:0,
			data:product
		})
	})
	.catch(e=>{
		res.json({
			code:1,
			msg:"获取详情失败"
		})
	})
});
//权限控制
 router.use((req,res,next)=>{
 	
 	if(req.userInfo._id){
 		next()
 	}else{
 		res.json({
			code:10
		});
 	}

 });
 router.get('/userInfo',(req,res)=>{
	if(req.userInfo._id){
		
			UserModel.findById(req.userInfo._id,"username phone email")
			.then(user=>{
				res.json({
					code :0,
					data:user
				})
			})
			
		
		
	}else{
		res.json({
			code:1
		})
	}
});

router.put('/updatepassword',(req,res)=>{
	UserModel.update({_id:req.userInfo._id},{password:hmac(req.body.password)})
	.then(raw=>{
		res.json({
			code:0,
			message:'密码更新成功'
		})
	})
	.catch(e=>{
		res.json({
			code:1,
			message:'密码更新失败'
		})
	})

})

 module.exports = router;

