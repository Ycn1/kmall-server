 const Router = require('express').Router;

const OrderModel = require('../models/user.js');
const UserModel = require('../models/user.js');

const Order = require('../models/order.js');

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
 //创建订单
 router.post('/',(req,res)=>{
 	UserModel
 	.findOne({_id:req.userInfo._id})
 	.then(user=>{
 		let order = {};
 		user
 		.getOrder()
 		.then(result=>{
 			order.payment = result.toatlPrice;
 			let productList =[];
 			result.cartList.forEach(item=>{
 				productList.push({
 					productId :item.product._id,
 					count:item.count,
 					toatlPrice:item.toatlPrice,
 					Price:item.product.price,
 					image:item.product.image,
 					name:item.product.name,

 				})
 			})
 			order.productList  = productList;
 			let shipping = user.shipping.id(req.body.shippingId);
 			order.shipping={
 				shippingId:shipping._id,
					
				name:shipping.name,
				province:shipping.province,
				city:shipping.city,
				address:shipping.address,
				phone:shipping.phone,
				zip:shipping.zip,

 			}

 			//构建订单号

 			order.orderNo = Date.now().toString() + parseInt(Math.random()*10000)
 			
 			//赋值用户id
 			order.user = user._id;
 			new OrderModel(order)
 			.save()
 			.then(newOrder=>{
 				res.json({
	 				code:0,
	 				data:newOrder
	 			})
 			})
 		

 			
 		})

 	})

 })
 
 
 module.exports = router;

