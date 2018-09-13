const mongoose = require('mongoose');

const ProductModel =  require('./product.js');

const CartItem  =  new mongoose.Schema({
	product:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'Product'
	},
	Price:{
		type:Number,
		deafult:0
	},
	count:{
		type:Number,
		deafult:1
	},
	check:{
		type:Boolean,
		default:true
	}
})

const CartSchema  = new mongoose.Schema({
	cartList:{
		type:[CartItem]
	},
	toatlPrice:{
		type:Number,
		deafult:0
	},
	totalCheck:{
		type:Boolean,
		default:true
	}
})
const newSchema = new mongoose.Schema({
		  	
		  	username:{
		  		type:String,
		  	},
		  	password:{
		  		type:String,
		  	},
		  	isAdmin:{
		  		type:Boolean,
		  		default:false
		  	},
		  	email:{
		  		type:String
		  	},
		  	phone:{
		  		type:Number
		  	},
		  	cart:{
		  		type:CartSchema
		  	},

		},{
			timestamps:true
		}); 

	newSchema.methods.getCart =function(){
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
	newSchema.methods.getOrder =function(){
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


const UserModel = mongoose.model('User', newSchema);


module.exports = UserModel;