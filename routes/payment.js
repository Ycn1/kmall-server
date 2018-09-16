 const Router = require('express').Router;


const UserModel = require('../models/user.js');

const OrderModel = require('../models/order.js');

const hmac = require('../util/hamc.js')

 const router = new Router();


 router.get('/pay',(req,res)=>{
 	console.log(req.query.orderNo)
 	
 		res.json({
 			code:0,
 			data:{
 				orderNo:req.query.orderNo,
 				qurl:"http://127.0.0.1:3000/resource/1535680959891.jpg"
 			}
 			
 		})

 	
 });
 router.get('/status',(req,res)=>}{
 	OrderModel
 		.findOne({orderNo:req.query.orderNo,},'status')
 		.then(order=>{
 			res.json({
 				code:0,
 				data:order.status == 30
 			})
 		})
 })
 
 
 
 module.exports = router;

