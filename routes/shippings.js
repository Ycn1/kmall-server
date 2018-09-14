 const Router = require('express').Router;

const UserModel = require('../models/user.js');

const ProductModel = require('../models/product.js');

const hmac = require('../util/hamc.js')

 const router = new Router();

 router.post('/add',(req,res)=>{
 	let body = req.body;
 	UserModel.findById(req.userInfo._id)
 	.then(user=>{
 		if(user.shipping){
 			user.shipping.push(body)
 		}else{
 			user.shipping = [body]
 		}
 		user.save()
 		.then(newUser=>{
 		
 				res.json({
 					code:0,
 					data:user.shipping

 				}) 			
 		})
 	})
 	
 });
  router.get('/list',(req,res)=>{
 	let body = req.body;
 	UserModel.findById(req.userInfo._id)
 	.then(user=>{
 		res.json({
 					code:0,
 					data:user.shipping

 				}) 		
 			
 		})
 		.catch(e=>{
 			res.json({
 					code:1,
 					message:'获取用户地址失败'

 				}) 	
 		})
 	
 });

 router.put('/delete',(req,res)=>{
  	let body = req.body;
 	UserModel.findById(req.userInfo._id)
 	.then(user=>{
 		console.log(body.shippingId)
 		user.shipping.id(body.shippingId).remove();
 		
 		user.save()
 		.then(newUser=>{
 		
 				res.json({
 					code:0,
 					data:user.shipping

 				}) 			
 		})
 	})
  });
  router.get('/shipping',(req,res)=>{
 	let body = req.body;
 	UserModel.findById(req.userInfo._id)
 	.then(user=>{
 		res.json({
 					code:0,
 					data:user.shipping.id(req.query.shippingId)

 				}) 		
 			
 		})
 		.catch(e=>{
 			res.json({
 					code:1,
 					message:'获取用户地址失败'

 				}) 	
 		})
 	
 });
  router.put('/edit',(req,res)=>{
  	let body = req.body;
 	UserModel.findById(req.userInfo._id)
 	.then(user=>{
 		
 		let shipping = user.shipping.id(body.shippingId);

 			shipping.name =  body.name;
 			shipping.province =  body.province;
 			shipping.city =  body.city;
 			shipping.address =  body.address;
 			shipping.phone =  body.phone;
 			shipping.zip =  body.zip;
 		
 		user.save()
 		.then(newUser=>{
 		
 				res.json({
 					code:0,
 					data:user.shipping

 				}) 			
 		})
 	})
  })
//普通权限控制
 router.use((req,res,next)=>{
 	
 	if(req.userInfo._id){
 		next()
 	}else{
 		res.json({
			code:10
		});
 	}

 });
 
 
 module.exports = router;

