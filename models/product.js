const mongoose = require('mongoose');
const pagination = require('../util/pagination.js');


const productSchema = new mongoose.Schema({
		  	
		  	name:{
		  		type:String,
		  	},
		  	dec:{
		  		type:String,
		  	},
		  	price:{
		  		type:String,
		  	},
		  	stock:{
		  		type:String,
		  	},
		  	image:{
		  		type:String,
		  	},
		  	order:{
			  	type:Number,
			  	default:0
			 },
			status:{
				type:String, 
			  	default:'0'
			 },
		  	detail:{
		  		type:String,
		  	},
		  	CategoryId:{
		  			type:mongoose.Schema.Types.ObjectId,
  					ref:'Category'
		  	},
		  
		  	
		},{
			timestamps:true
		}); 

productSchema.statics.getPaginationProduct = function(page,query={}){
    return new Promise((resolve,reject)=>{
      let options = {
        page: page,
        model:this, 
        query:query, 
        projection:'-__v', 
        sort:{order:-1}, 
        // populate:[{path:'category',select:'name'},{path:'user',select:'username'}]
      }
      pagination(options)
      .then((data)=>{
        resolve(data); 
      })
    })
 }
const ProductModel = mongoose.model('Product', productSchema);


module.exports = ProductModel;