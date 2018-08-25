const mongoose = require('mongoose');


const resourceSchema = new mongoose.Schema({
		  	
		  	name:{
		  		type:String,
		  	},
		  	path:{
		  		type:String,
		  		
		  	},
		  	
		}); 


const ResourceModel = mongoose.model('Resource', resourceSchema);


module.exports = ResourceModel;