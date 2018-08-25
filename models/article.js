const mongoose = require('mongoose');

const pagination = require('../util/pagination.js');

const ArticleSchema = new mongoose.Schema({
  category:{
  	type:mongoose.Schema.Types.ObjectId,
  	ref:'Category'
  },
  user:{
  	type:mongoose.Schema.Types.ObjectId,
  	ref:'Wish'
  },  
  title:{
  	type:String,
  },
  intro:{
  	type:String,
  },
  content:{
  	type:String,
  }, 
  click:{
  	type:Number,
  	default:0
  },
  createdAt:{
  	type:Date,
  	default:Date.now
  }  
});

ArticleSchema.statics.getPaginationArticles = function(req,query={}){
    return new Promise((resolve,reject)=>{
      let options = {
        page: req.query.page,
        model:this, 
        query:query, 
        projection:'-__v', 
        sort:{_id:-1}, 
        populate:[{path:'category',select:'name'},{path:'user',select:'username'}]
      }
      pagination(options)
      .then((data)=>{
        resolve(data); 
      })
    })
 }


const ArticleModel = mongoose.model('Article', ArticleSchema);

module.exports = ArticleModel;