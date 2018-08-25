
 const Router = require('express').Router;

 const UserModel = require('../models/user.js');

 const categoryModel = require('../models/category.js')
 const router = new Router();
 const pagination = require('../util/pagination.js')



 router.get('/',(req,res)=>{
	// res.render('index');
	// res.send("index ok");
	/*res.render('admin/category',{
		userInfo:req.userInfo
	});*/
	let options ={
		page:req.query.page,
		model:categoryModel,
		query:{},
		projection:'_id name order',
		sort:{order:1}
	}
	pagination(options)
	.then((data)=>{
		// console.log(data);
		res.render('admin/category',{
				userInfo:req.userInfo,
				categories:data.docs,
				page:data.page,
				list:data.list,
				pages:data.pages,
				url:'/category'
		});	
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

