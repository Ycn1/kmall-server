 const Router = require('express').Router;

const UserModel = require('../models/user.js');

const hmac = require('../util/hamc.js');

const CommentModel = require('../models/comment.js');

 const router = new Router();


router.post('/add',(req,res)=>{
	let body = req.body;

	new CommentModel({
		article:body.id,
		user:req.userInfo._id,
		content:body.content
	})
	.save()
	.then((val)=>{

		CommentModel.getPaginationComment(req,{article:body.id})
			.then((data)=>{
				res.json({
					code:'0',
					data:data
				})
			})
	})
})

router.get('/list',(req,res)=>{
	let article = req.query.id;
	let query = {};
	if(article){
		query.article = article;
	}
	CommentModel.getPaginationComment(req,query)
	.then((data)=>{
				res.json({
					code:'0',
					data:data
				})
			})
})

 module.exports = router;

