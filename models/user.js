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
		type:Number
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
				return (null);
			}
			//map方法返回的就是一个数组
			let getCartItems = function(){
				return _this.cart.cartList.map(CartItem=>{
					console.log("::::111",CartItem)
					return ProductModel.findById(CartItem.product)
					.then(product=>{
					console.log("::::222",product)	
						CartItem.product =  product;
						CartItem.Price = product.price * CartItem.count;
						return CartItem;
					})

					
				})
			}

			Promise.all(getCartItems())
			.then(CartItems=>{
				
				var CartItemTotolPrices = 0;
				
				CartItems.forEach(item=>{
					CartItemTotolPrices += item.Price;
				})
				this.cart.toatlPrice = CartItemTotolPrices;
				this.cart.cartList = CartItems;
				resolve(this.cart)
			})
		}) 
	}


const UserModel = mongoose.model('User', newSchema);


module.exports = UserModel;