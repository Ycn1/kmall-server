
 const Router = require('express').Router;

 const UserModel = require('../models/user.js');

 const categoryModel = require('../models/category.js')
 const router = new Router();
 const pagination = require('../util/pagination.js')

//权限控制
 router.use((req,res,next)=>{
 	
 	if(req.userInfo.isAdmin){
 		next()
 	}else{
 		res.send({
			code:10
		});
 	}

 });

router.post('/',(req,res)=>{
	let body = req.body;
	categoryModel.findOne({name:body.name,pid:body.pid})
	.then((cate)=>{
		if(cate){
			res.json({
					code:1,
					message:"分类插入失败，已有分类"
				});
		}else{
			new categoryModel({
				name:body.name,
				pid:body.pid
			})
			.save()
			.then((newCate)=>{

				if(newCate){
					res.json({
						code:0,
					});
				}
			})
			.err((e)=>{
				res.json({
						code:1,
						message:"分类插入失败，服务器错误"
					});
			})
		}
	})
	

});




 router.get('/add',(req,res)=>{
	// res.render('index');
	// res.send("index ok");
	res.render('admin/category-add-update',{
		userInfo:req.userInfo
	});

	

});


 router.post('/add',(req,res)=>{
	let body = req.body;
	// res.render('admin/category-add',{
	// 	userInfo:req.userInfo
	// });
	categoryModel.findOne({name:body.name})
	.then((cate)=>{
		if(cate){
			res.render('admin/category-error',{
				userInfo:req.userInfo,
				message:'分类插入失败，已有同名分类',
				url:'/category'
			});
		}else{
			new categoryModel({
				name:body.name,
				order:body.order
			})
			.save()
			.then((newCate)=>{

				if(newCate){
					res.render('admin/category-success',{
						userInfo:req.userInfo,
						message:'分类插入成功',
						url:'/category'
					});
				}
			})
			.err((e)=>{
				res.render('admin/category-error',{
					userInfo:req.userInfo,
					message:'分类插入失败',
					url:'/category'
				});
			})
		}
	})
	

});

router.get('/edit/:id',(req,res)=>{
	let id = req.params.id;
	categoryModel.findById(id)
				.then((category)=>{
					res.render('admin/category-add-update',{
						userInfo:req.userInfo,
						category:category
					})
				});

});

router.post('/update/',(req,res)=>{
	let body = req.body;
	/*categoryModel.findOne({name:body.name})
					.then((category)=>{
						if(category && category.order == body.order){
							res.render('admin/category-error',{
								userInfo:req.userInfo,
								message:'分类编辑失败',
								
							})
						}else{
							categoryModel.update({_id:body.id},{name:body.name,order:body.order},(err,raw)=>{
								if(!err){
									res.render('admin/category-success',{
										userInfo:req.userInfo,
										message:'分类插入成功',
										url:'/category'
									});
								}else{
									res.render('admin/category-error',{
										userInfo:req.userInfo,
										message:'分类编辑失败',
										
									})
								}
							});
							
						}
					})*/

	categoryModel.findById(body.id)
				.then((categry)=>{
					if(categry.name == body.name && categry.order == body.order){
						res.render('admin/category-error',{
							userInfo:req.userInfo,
							message:'修改内容后再提交',
									
						})
					}else{
						categoryModel.findOne({name:body.name,_id:{$ne:body.id}})
									.then((category)=>{

										if(category){
											res.render('admin/category-error',{
												userInfo:req.userInfo,
												message:'分类编辑失败,已有同名分类',
										
											})
										}else{
											categoryModel.update({_id:body.id},{name:body.name,order:body.order},(err,raw)=>{
												if(!err){
													res.render('admin/category-success',{
														userInfo:req.userInfo,
														message:'分类插入成功',
														url:'/category'
													});
												}else{
													res.render('admin/category-error',{
														userInfo:req.userInfo,
														message:'分类编辑失败',
														
													})
												}
											});
										}
										
									})
					}
				})

})


router.get('/delete/:id',(req,res)=>{

	let id  = req.params.id;

	categoryModel.remove({_id:id},function(err,result){
		if(!err){
			res.render('admin/category-success',{
				userInfo:req.userInfo,
				message:'删除成功',
				url:'/category'
			});
		}
	})

})
module.exports = router;

