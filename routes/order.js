 const Router = require('express').Router;


const UserModel = require('../models/user.js');

const OrderModel = require('../models/order.js');

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
 					product:item.product._id,
 					count:item.count,
 				
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

 			order.orderNo = Date.now().toString() + parseInt(Math.random()*10000);
 		
 			//赋值用户id
 			order.user = user._id;
 			
 			new OrderModel(order)
 			.save()
 			.then(newOrder=>{
 				//删除购物车中的已提交订单的数据留下未选择的数据
 				UserModel
				 	.findOne({_id:req.userInfo._id})
				 	.then(user=>{
				 		let newCartList =  user.cart.cartList.filter(item=>{
			 				return item.check == false;
			 			})
			 			
			 			
				 	
				 	user.cart.cartList = newCartList;
				 	user.save()
				 	.then(newUser=>{
				 		res.json({
			 				code:0,
			 				data:newOrder
			 			})
				 	})
 				})
 			})			
 		})

 	})

 });

 //获取购物订单
 router.get('/getlist',(req,res)=>{
 	let page = req.query.page;
 	let query = {
 		user:req.userInfo._id
 	}

 	OrderModel
 	.getPaginationProduct(page,query)
	.then(data=>{
		
		res.json({
			code :0,
			
			data:{
				list:data.list,
				current:data.current,
				total:data.total,
				pageSize:data.pageSize,
				status:data.status
			}
		})
	})
 });

//获取全部订单
 router.get('/order',(req,res)=>{
 	let page = req.query.page;
 	OrderModel
 	.getPaginationProduct(page)
	.then(data=>{
		
		res.json({
			code :0,
			
			data:{
				list:data.list,
				current:data.current,
				total:data.total,
				pageSize:data.pageSize,
				status:data.status
			}
		})
	})
});
//搜索订单号

router.get('/search',(req,res)=>{
	

	let id = req.query.id;

	let keyword = req.query.keyword;

	let page =  req.query.page;
	OrderModel
	.getPaginationProduct(page,{
		orderNo:{$regex:new RegExp(keyword,'i')}
	})
	.then(data=>{
			res.json({
				code :0,
				
				data:{
					list:data.list,
					current:data.current,
					total:data.total,
					pageSize:data.pageSize,
					status:data.status,
					keyword:keyword
				}
			})
	})
		.catch(e=>{
			res.json({
				code:1,
				message:"失败"
			})
		})
			
})
 //获取订单详情页 用户界面
 router.get('/detail',(req,res)=>{
 
 	console.log(req.query.orderNo)
 	OrderModel
 	.findOne({orderNo:req.query.orderNo,user:req.userInfo._id})
	.then(data=>{
		res.json({
			code :0,
			
			data:data
		})
	})
 });
 //获取订单详情  管理员界面
  router.get('/detailAdmin',(req,res)=>{
 
 	console.log(req.query.orderNo)
 	OrderModel
 	.findOne({orderNo:req.query.orderNo})
	.then(data=>{
		res.json({
			code :0,
			
			data:data
		})
	})
 });
 //取消订单
 router.put('/cancel',(req,res)=>{
 		OrderModel
 		.findOneAndUpdate(
 			{orderNo:req.body.orderNo,user:req.userInfo._id},
 			{status:"20",statusDesc:"取消"},
 			{new :true}
 			)
		.then(data=>{
			console.log("data",data)
		
			res.json({
				code :0,
				
				data:data
			})
		})
		.catch(e=>{
			res.json({
				code :0,
				
				message:"取消订单失败"
			})
		})
	})

 
 
 module.exports = router;

