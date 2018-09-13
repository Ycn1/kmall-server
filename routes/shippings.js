 const Router = require('express').Router;

const UserModel = require('../models/user.js');

const ProductModel = require('../models/product.js');

const hmac = require('../util/hamc.js')

 const router = new Router();

 router.get('/getcartCount',(req,res)=>{
 	UserModel
 	.findOne({_id:req.userInfo._id})
 	.then(user=>{
 		if(user.cart){
 			let count = 0;
 			user.cart.cartList.forEach(item=>{
 				return count += item.count;
 			})
 			res.json({
 				code:0,
 				data:count
 			})
 		}else{
 			res.json({
 				code:0,
 				data:0
 			})
 		}
 		user.save()
 		.then(newUser=>{
 		
 				res.json({
 					code:0,
 					message:"插入成功",

 				}) 			
 		})
 	})
 	
 });
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
 			//如果购物车里面已经有此产品，数量增加即可
 			let cartItem  =  user.cart.cartList.find((item)=>{
 				return item.product == req.body.product
 			})
 			if(cartItem){
 				cartItem.count = cartItem.count + parseInt(req.body.count)
 			}else{
 				user.cart.cartList.push({
	 				product: req.body.product,
	 				count:req.body.count
 				})
 			}
 			
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
 	
 });
 router.put('/selectone',(req,res)=>{

 	UserModel
 	.findById(req.userInfo._id)
 	.then(user=>{
 		if(user.cart){
 			//如果购物车里面已经有此产品，数量增加即可
 			let cartItem  =  user.cart.cartList.find((item)=>{
 				return item.product == req.body.productId
 			})
 			if(cartItem){

 				cartItem.check = true
 			}else{
 				res.json({
 					code:1,
 					message:"购物车记录不存在",

 				}) 
 			}
 			
 		}else{
 			res.json({
 					code:1,
 					message:"还没有购物车",

 				}) 
 		}
 		user.save()
 		.then(newUser=>{
 		
 				user.getCart()
 				.then(cart=>{
 					res.json({
 						code:0,
 						data:cart
 					})
 				})	
 		})
 	})
 });
 router.put('/unselectone',(req,res)=>{

 	UserModel
 	.findById(req.userInfo._id)
 	.then(user=>{
 		if(user.cart){
 			//如果购物车里面已经有此产品，数量增加即可
 			let cartItem  =  user.cart.cartList.find((item)=>{
 				return item.product == req.body.productId
 			})
 			if(cartItem){
 				cartItem.check = false
 			}else{
 				res.json({
 					code:1,
 					message:"购物车记录不存在",

 				}) 
 			}
 			
 		}else{
 			res.json({
 					code:1,
 					message:"还没有购物车",

 				}) 
 		}
 		user.save()
 		.then(newUser=>{
 		
 				user.getCart()
 				.then(cart=>{
 					res.json({
 						code:0,
 						data:cart
 					})
 				})	
 		})
 	})
 });
 //全部选择购物车中的商品
 router.put('/selectall',(req,res)=>{

 	UserModel
 	.findById(req.userInfo._id)
 	.then(user=>{
 		if(user.cart){
 			//遍历循环，把每一个item 的check改为true
 			 user.cart.cartList.forEach(item=>{
 			 	item.check = true
 			 })
 			
 			
 		}else{
 			res.json({
 					code:1,
 					message:"还没有购物车",

 				}) 
 		}
 		user.save()
 		.then(newUser=>{
 		
 				user.getCart()
 				.then(cart=>{
 					res.json({
 						code:0,
 						data:cart
 					})
 				})	
 		})
 	})
 });
 //全部取消购物车中的商品
  router.put('/unselectall',(req,res)=>{

 	UserModel
 	.findById(req.userInfo._id)
 	.then(user=>{
 		if(user.cart){
 			 user.cart.cartList.forEach(item=>{
 			 	item.check = false
 			 })
 			
 			
 		}else{
 			res.json({
 					code:1,
 					message:"还没有购物车",

 				}) 
 		}
 		user.save()
 		.then(newUser=>{
 		
 				user.getCart()
 				.then(cart=>{
 					res.json({
 						code:0,
 						data:cart
 					})
 				})	
 		})
 	})
 });
  //删除单个商品
  router.put('/deleteone',(req,res)=>{

 	UserModel
 	.findById(req.userInfo._id)
 	.then(user=>{
 		if(user.cart){

 			console.log(req.body.productId)
 			let newCartList =  user.cart.cartList.filter(item=>{
 				return item.product != req.body.productId
 			})
 			
 			user.cart.cartList = newCartList;
 		}else{
 			res.json({
 					code:1,
 					message:"还没有购物车",

 				}) 
 		}
 		user.save()
 		.then(newUser=>{
 		
 				user.getCart()
 				.then(cart=>{
 					res.json({
 						code:0,
 						data:cart
 					})
 				})	
 		})
 	})
 });
   router.put('/deleteSelete',(req,res)=>{

 	UserModel
 	.findById(req.userInfo._id)
 	.then(user=>{
 		if(user.cart){
 			
 			let newCartList =  user.cart.cartList.filter(item=>{
 				return item.check == false
 			})
 			
 			user.cart.cartList = newCartList;
 		}else{
 			res.json({
 					code:1,
 					message:"还没有购物车",

 				}) 
 		}
 		user.save()
 		.then(newUser=>{
 		
 				user.getCart()
 				.then(cart=>{
 					res.json({
 						code:0,
 						data:cart
 					})
 				})	
 		})
 	})
 });
 router.put('/changeInput',(req,res)=>{
 		UserModel
		 	.findById(req.userInfo._id)
		 	.then(user=>{
		 		if(user.cart){
		 			let cartItem =  user.cart.cartList.filter(item=>{

		 				return item.product == req.body.productId
		 			})
		 			if(cartItem){ 
		 				 cartItem[0].count = req.body.count;
		 			}
		 			user.cart.cartList = cartItem;
		 		}
		 		else{
		 			res.json({
		 					code:1,
		 					message:"还没有购物车",

		 				}) 
		 		}
		 		user.save()
			 		.then(newUser=>{
			 		
			 				user.getCart()
			 				.then(cart=>{
			 					res.json({
			 						code:0,
			 						data:cart
			 					})
			 				})	
			 		})

		 	})
 })
 module.exports = router;

