const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
		  	
		  	name:{
		  		type:String,
		  	},
		  	pid:{
		  		type:String,
		  	},
		  	order:{
		  		type:Number,
		  		default:0
		  	},
		  	
		},{
			timestamps:true
		}); 


const categoryModel = mongoose.model('Category', categorySchema);


module.exports = categoryModel;