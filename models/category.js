const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
		  	
		  	name:{
		  		type:String,
		  	},
		  	order:{
		  		type:Number,
		  		default:0
		  	},
		  	
		}); 


const categoryModel = mongoose.model('Category', categorySchema);


module.exports = categoryModel;