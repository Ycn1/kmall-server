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
 
 router.post('/add',(req,res)=>{

 	UserModel
 	.findById(req.userInfo._id)
 	.then(user=>{
 		if(user.cart){
 			// let cartItem  =  user.cart.findOne()
 			user.cart.cartList.push({
 				product: req.body.product,
 				count:req.body.count
 			})
 		}else{
 			user.cart = {
 				cartList:[

 					{
 						product: req.body.product,
 						count:req.body.count
 					}
 				]
 			}
 		}
 		user.save()
 		.then(newUser=>{
 			console.log(newUser)
 				res.json({
 					code:0,
 					message:"插入成功",

 				}) 			
 		})
 	})
 

 });
 router.get('/getcart',(req,res)=>{
 	UserModel
 	.findOne({_id:req.userInfo._id})
 	.then(user=>{
 		user
 		.getCart()
 		.then(cart=>{
 			if (cart) {
 				res.json({
 					code:0,
 					data:cart
 				})
 			}
 		})

 	})
 	
 })
 module.exports = router;

