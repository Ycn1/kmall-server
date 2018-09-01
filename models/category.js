const mongoose = require('mongoose');

const pagination = require('../util/pagination.js');

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




categorySchema.statics.getPaginationCategory = function(page,query={}){
    return new Promise((resolve,reject)=>{
      let options = {
        page: page,
        model:this, 
        query:query, 
        projection:'-__v', 
        sort:{order:-1}, 
        populate:[{path:'category',select:'name'},{path:'user',select:'username'}]
      }
      pagination(options)
      .then((data)=>{
        resolve(data); 
      })
    })
 }

const categoryModel = mongoose.model('Category', categorySchema);

module.exports = categoryModel;