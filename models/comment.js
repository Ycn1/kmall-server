const mongoose = require('mongoose');

const pagination = require('../util/pagination.js');

const CommentSchema = new mongoose.Schema({
  article:{
  	type:mongoose.Schema.Types.ObjectId,
  	ref:'Article'
  },
  user:{
  	type:mongoose.Schema.Types.ObjectId,
  	ref:'Wish'
  },  
  content:{
  	type:String,
  }, 
  
  createdAt:{
  	type:Date,
  	default:Date.now
  }  
});


CommentSchema.statics.getPaginationComment = function(req,query={}){
    return new Promise((resolve,reject)=>{
      let options = {
        page: req.query.page,
        model:this, 
        query:query, 
        projection:'-__v', 
        sort:{_id:-1}, 
        populate:[{path:'article',select:'title'},{path:'user',select:'username'}]
      }
      pagination(options)
      .then((data)=>{
        resolve(data); 
      })
    })
 }


const CommentModel = mongoose.model('Comment', CommentSchema);

module.exports = CommentModel;