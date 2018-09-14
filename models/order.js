const mongoose = require('mongoose');

const ProductModel =  require('./product.js');

const ProductSchema  =  new mongoose.Schema({
	product:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'Product'
	},
	name:{
		type:String
	},
	image:{
		type:String
	},
	Price:{
		type:Number,
		deafult:0
	},
	count:{
		type:Number,
		deafult:1
	},
	toatlPrice:{
		type:Number,
		deafult:0
	},

})


const shippingSchema  = new mongoose.Schema({
	shippingId:{
		type:String
	},
	name:{
		type:String
	},
	province:{
		type:String
	},
	city:{
		type:String
	},
	address:{
		type:String
	},
	phone:{
		type:Number
	},
	zip:{
		type:Number
	}

})
const orderSchema = new mongoose.Schema({
			//订单所属
		  	user:{
		  		type:mongoose.Schema.Types.ObjectId,
				ref:'User'
		  	},
		  	orderNo:{
		  		type:String,
		  	},
		  	//支付金额
		  	payment:{
		  		type:Number,
		  	},
		  	paymentType:{
		  		type:String,
		  		enmu:["10","20"],//10-支付宝  20-微信
		  		default:"10"
		  	},
		  	 paymentTypeDesc:{
		  		type:String,
		  		enmu:["支付宝","微信"],//10-支付宝  20-微信
		  		default:"支付宝"
		  	},
		  	paymentTime:{
		  		type:Date
		  	},
		  	status:{
		  		type:String,
		  		enmu:["10",'20',"30","40","50"],
		  		default:"10" //10- 未支付  20 - 取消 30-已支付
		  	},
		  	statusDesc:{
		  		type:String,
		  		enmu:["未支付",'取消',"已支付","已发货","完成"],
		  		default:"未支付" //10- 未支付  20 - 取消 30-已支付  40-已发货 50-完成
		  	},
		  	//商品信息
		  	productList:{
		  		type:[ProductSchema],
		  		deafult:[]
		  	},
		  	//配送地址
		  	shipping:{
		  		type:shippingSchema
		  	}

		},{
			timestamps:true
		}); 

	orderSchema.methods.getCart =function(){
		return new Promise((resolve,reject)=>{
			var _this = this;
			if(!this.cart){
				resolve({
					cartList:[]
				});
			}
			//map方法返回的就是一个数组
			let getCartItems =  this.cart.cartList.map(CartItem=>{
				
					return ProductModel.findById(CartItem.product)
					.then(product=>{
						console.log("123",product.price)
						CartItem.product =  product;
						CartItem.Price = product.price * CartItem.count;
						return CartItem;
					})

					
				})

			Promise.all(getCartItems)
			.then(CartItems=>{
				let totaopricecart = 0;
				CartItems.forEach(item=>{
					if(item.check){
						totaopricecart += item.Price
					}
				})
				this.cart.toatlPrice = totaopricecart;
				
				
				this.cart.cartList = CartItems;

				let hasallcheck = CartItems.find(item=>{
					return item.check ==  false
				})
				if(hasallcheck){
				
					this.cart.totalCheck =  false;
				}else{
					this.cart.totalCheck =  true;
				}
				this.cart.cartList = CartItems;
				resolve(this.cart)
			})
		}) 
	}
	//订单页面的订单获取
	orderSchema.methods.getOrder =function(){
		return new Promise((resolve,reject)=>{
			var _this = this;
			if(!this.cart){
				resolve({
					cartList:[]
				});
			}

			let checkList = this.cart.cartList.filter(item=>{
				return item.check;
			})
			//map方法返回的就是一个数组
			let getCartItems = checkList.map(CartItem=>{
					
					return ProductModel.findById(CartItem.product)
					.then(product=>{
					
						CartItem.product =  product;
						CartItem.Price = product.price * CartItem.count;
						return CartItem;
					})

					
				})

			Promise.all(getCartItems)
			.then(CartItems=>{
				let totaopricecart = 0;
				CartItems.forEach(item=>{
					if(item.check){
						totaopricecart += item.Price
					}
				})
				this.cart.toatlPrice = totaopricecart;
						
				this.cart.cartList = CartItems;
				resolve(this.cart)
			})
		}) 
	}


const OrderModel = mongoose.model('Order',orderSchema);


module.exports = OrderModel;