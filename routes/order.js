 const Router = require('express').Router;

const UserModel = require('../models/user.js');

const ProductModel = require('../models/product.js');

const hmac = require('../util/hamc.js')

 const router = new Router();

 
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
 
 
 router.get('/orderList',(req,res)=>{
 	UserModel
 	.findOne({_id:req.userInfo._id})
 	.then(user=>{
 		user
 		.getOrder()
 		.then(cart=>{
 			if (cart) {
 				res.json({
 					code:0,
 					data:cart
 				})
 			}
 		})

 	})
 	
 });
 
 module.exports = router;

