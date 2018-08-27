const mongoose = require('mongoose');


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
		  	}

		},{
			timestamps:true
		}); 


const UserModel = mongoose.model('User', newSchema);


module.exports = UserModel;