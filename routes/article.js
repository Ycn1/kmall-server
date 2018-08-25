
 const Router = require('express').Router;

 const UserModel = require('../models/user.js');

 const categoryModel = require('../models/category.js');
 const ArticleModel = require('../models/article.js');
 const router = new Router();
 const pagination = require('../util/pagination.js')

router.use((req,res,next)=>{
	if(req.userInfo.isAdmin){
		next()
	}else{
		res.send('<h1>请用管理员账号登录</h1>');
	}
})


 router.get("/",(req,res)=>{
	let options = {
		page: req.query.page,//需要显示的页码
		model:ArticleModel, //操作的数据模型
		query:{}, //查询条件
		projection:'-__v', //投影，
		sort:{_id:-1}, //排序
		populate:[{path:'category',select:'name'},{path:'user',select:'username'}]
	}

	pagination(options)
	.then((data)=>{
		console.log(data);
		res.render('admin/article',{
			userInfo:req.userInfo,
			articles:data.docs,
			page:data.page,
			list:data.list,
			pages:data.pages,
			url:'/article'
		});	
	})
	
});

 router.get('/add',(req,res)=>{
	categoryModel.find({},'_id name order')
		.sort({order:1})
		.then((categories)=>{
			res.render('admin/article_add_edit',{
				userInfo:req.userInfo,
				categories:categories
			});
			// console.log(categories);
		})
});


 router.post('/add',(req,res)=>{
	let body = req.body;

	new ArticleModel({
		category:body.category,
		user:req.userInfo._id,
		title:body.title,
		intro:body.intro,
		content:body.content

	})
	.save()
	.then((article)=>{
		res.render('admin/category-success',{
			userInfo:req.userInfo,
			message:'新增文章成功',
			url:'/article'
		});
	})
	.catch((e)=>{
			res.render('admin/category-error',{
				userInfo:req.userInfo,
				message:'新增文章失败',
				
			})
	})	

});

router.get("/edit/:id",(req,res)=>{
	let id = req.params.id;
	categoryModel.find({},'_id name')
	.sort({order:1})
	.then((categories)=>{

		ArticleModel.findById(id)
		.then((article)=>{
			res.render('admin/article_add_edit',{
				userInfo:req.userInfo,
				categories:categories,
				article:article
			});		
		})
		.catch((e)=>{
	 		res.render('admin/error',{
				userInfo:req.userInfo,
				message:'获取的文章不存在'
			})	
		})
	})
});

router.post('/update',(req,res)=>{
	let body = req.body;
	let options = {
		category:body.category,
		title:body.title,
		intro:body.intro,
		content:body.content
	}
	ArticleModel.update({_id:body.id},options,(err,raw)=>{
		if(!err){
			res.render('admin/category-success',{
				userInfo:req.userInfo,
				message:'编辑文章成功',
				url:'/article'
			})	
		}else{
	 		res.render('admin/category-error',{
				userInfo:req.userInfo,
				message:'编辑文章失败,数据库操作失败'
			})	
		}
	});
});


router.get('/delete/:id',(req,res)=>{

	let id  = req.params.id;

	ArticleModel.remove({_id:id},function(err,result){
		if(!err){
			res.render('admin/category-success',{
				userInfo:req.userInfo,
				message:'文章删除成功',
				url:'/article'
			});
		}else{
			res.render('admin/category-error',{
				userInfo:req.userInfo,
				message:'文章删除失败',
				url:'/article'
			});
		}
	})

})
module.exports = router;

