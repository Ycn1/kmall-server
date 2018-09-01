
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

				if(body.pid==0){
					categoryModel.find({pid:body.pid})
								.then(result=>{
									res.json({
										code:0,
										data:result
									});
								})
					
				}
				else{
					res.json({
							code:0,
							message:"分类插入成功"
							
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


router.get('/',(req,res)=>{
	let pid = req.query.pid;
	let page = req.query.page;

	if(page){

		/*let options ={
			page:req.query.page,
			model:categoryModel,
			query:{pid:pid},
			projection:'',
			sort:{order:1}
		}
		pagination(options)*/

		categoryModel
		.getPaginationCategory(req,{pid:pid})
		.then((data)=>{
			

			res.json({
				code :0,
				data:{
					list:data.list,
					current:data.current,
					total:data.total,
					pageSize:data.pageSize
				}
			})
		})

	}else{
		categoryModel.find({pid:pid})
				.then((categories)=>{
				
					res.json({
						code:0,
						data:categories
						
					})
				})
				.catch(e=>{
					res.json({
						code:1,
						message:"获取分类失败!!!"
					})
				})
	}
	

});

router.put('/update/',(req,res)=>{
	
	let body = req.body;
		console.log("0",body)
	categoryModel
	.findOne({name:body.name,pid:body.pid})
	.then((category)=>{
		if(category){
			res.json({
						code:1,
						message:"分类名称修改失败,已有同名分类"
					})
		}else{
			categoryModel.update({_id:body.id},{name:body.name})
			.then(cate=>{
				if(cate){
					categoryModel.getPaginationCategory(body.page,{pid:body.pid})
					.then((data)=>{
					
							res.json({
								code :0,
								data:{
									list:data.list,
									current:data.current,
									total:data.total,
									pageSize:data.pageSize
								}
							})
					})
				}else{
						res.json({
							code:1,
							message:"分类名称修改失败,数据库错误"
						})
				}
			})
			
		}
})
	.catch(e=>{
		res.json({
							code:1,
							message:"分类名称修改失败"
						})
	})
})

router.put('/updateOrder',(req,res)=>{
	let body = req.body;

		categoryModel.update({_id:body.id},{order:body.order})
			.then(cate=>{
				if(cate){
					categoryModel.getPaginationCategory(body.page,{pid:body.pid})
					.then(data=>{
							res.json({
								code :0,
								data:{
									list:data.list,
									current:data.current,
									total:data.total,
									pageSize:data.pageSize
								}
							})
					})
				}else{
						res.json({
							code:1,
							message:"分类名称修改失败,数据库错误"
						})
				}
			})
})














//so far so far
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
											})
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

