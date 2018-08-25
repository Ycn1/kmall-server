
 const Router = require('express').Router;

 const UserModel = require('../models/user.js');
const ArticleModel = require('../models/article.js');
 const categoryModel = require('../models/category.js');
const pagination = require('../util/pagination.js');

const CommentModel = require('../models/comment.js');
 const router = new Router();
const getCommonData = require('../util/getCommonData.js');


 router.get('/',(req,res)=>{

ArticleModel.getPaginationArticles(req)
	.then(pageData=>{
		getCommonData()
		.then(data=>{
			res.render('main/index',{
				userInfo:req.userInfo,
				articles:pageData.docs,
				page:pageData.page,
				list:pageData.list,
				pages:pageData.pages,
				categories:data.categories,
				topArticles:data.topArticles,
				site:data.site,
				url:'/articles'
			});	
			// console.log("1",data.site);			
		})
	})
})

 router.get("/articles",(req,res)=>{

		let category = req.query.id;

		let query = {};

		if(category){
			query.category = category
		}

		console.log(query);
		ArticleModel.getPaginationArticles(req,query)
			.then((data)=>{
				res.json({
					code:'0',
					data:data
				})
			})
		});


 router.get('/view/:id',(req,res)=>{
 	let id = req.params.id;

	ArticleModel.findByIdAndUpdate(id,{$inc:{click:1}},{new:true})
	.populate('user','username')
	.populate('category','name')

	.then(article=>{
		getCommonData()
		.then(data=>{
			CommentModel.getPaginationComment(req,{article:id})
			  .then((dataPage)=>{
			  	
			  	console.log(article);
			    res.render('main/detail',{
					userInfo:req.userInfo,
					article:article,
					categories:data.categories,
					topArticles:data.topArticles,
					list:dataPage.list,
					page:dataPage.page,
					pages:dataPage.pages,
					comments:dataPage.docs,
					site:data.site,
					category:article.category._id.toString()
					

				})	
			  	

			  })
			
				
		})
	})
 });

 router.get('/list/:id',(req,res)=>{
 	let id = req.params.id;
 	ArticleModel.getPaginationArticles(req,{category:id})
	.then(pageData=>{
		getCommonData()
		.then(data=>{
			res.render('main/list',{
				userInfo:req.userInfo,
				articles:pageData.docs,
				page:pageData.page,
				list:pageData.list,
				pages:pageData.pages,
				categories:data.categories,
				topArticles:data.topArticles,
				category:id,
				site:data.site,
				url:'/list'
			});				
		})
	})
 })

 module.exports = router;
