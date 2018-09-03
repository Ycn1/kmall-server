
 const Router = require('express').Router;

const path = require('path');
 const router = new Router();

const multer = require('multer');

const ProductModel = require('../models/product.js');

var upload = multer({ dest: 'public/uploadImage/' })

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploadImage/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+path.extname(file.originalname) )
  }
})

var upload = multer({ storage: storage })

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
//处理商品图片
router.post('/uploadImage',upload.single('file'),(req,res)=>{
	const  filePath = 'http://127.0.0.1:3000/uploadImage/'+req.file.filename;

	
	res.send(filePath)
	
})

router.post('/uploadRichEditor',upload.single('upload'),(req,res)=>{
	const  filePath = 'http://127.0.0.1:3000/uploadImage/'+req.file.filename;

	res.json({
		 "success": true,
  		 "msg": "上传成功", 
  		 "file_path": filePath
	})
	
})


router.post('/add',(req,res)=>{
	
	// res.send("ok")
	let body = req.body;


			new ProductModel({
				name:body.name,
				dec:body.dec,
				price:body.price,
				image:body.image,
				detail:body.detail,
				stock:body.stock,
				CategoryId:body.CategoryId,

			})
			.save()
			.then((newProduct)=>{

				if(newProduct){
					ProductModel
						.getPaginationProduct(1,{})
						.then((data)=>{
							

							res.json({
								code :0,
								data:{
									list:data.list,
									current:data.current,
									total:data.total,
									pageSize:data.pageSize,
									name:newProduct.name,
									dec:newProduct.dec,
									price:newProduct.price,
									image:newProduct.image,
									detail:newProduct.detail,
									stock:newProduct.stock,

								}
							})
						})

				}
			})
			
			.catch(e=>{
				res.json({
						code :1,
						message:'商品添加失败'
					})
			})
		
	})

router.put('/add',(req,res)=>{
	
	let body = req.body;

			let update = 	{
				name:body.name,
				dec:body.dec,
				price:body.price,
				image:body.image,
				detail:body.detail,
				stock:body.stock,
				Category:body.CategoryId,

			}
			ProductModel
			.update({_id:body.id},update)
			.then((raw)=>{

				res.json({
					code:0,
					message:"编辑商品成功"
				})
			})
			
			.catch(e=>{
				res.json({
						code :1,
						message:'编辑商品成功失败'
					})
			})
		
	})


router.get('/',(req,res)=>{

	let page = req.query.page;



	ProductModel
	.getPaginationProduct(page,{})
	.then((data)=>{
		

		res.json({
			code :0,
			data:{
				list:data.list,
				current:data.current,
				total:data.total,
				pageSize:data.pageSize,
				status:data.status
				

			}
		})
	})

});

router.put('/updateOrder',(req,res)=>{
	let body = req.body;

		ProductModel.update({_id:body.id},{order:body.order})
			.then(product=>{
				if(product){
					ProductModel.getPaginationProduct(body.page,{})
					.then(data=>{
							res.json({
								code :0,
								data:{
									list:data.list,
									current:data.current,
									total:data.total,
									pageSize:data.pageSize,
									order:data.order
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
router.put('/updateStatus',(req,res)=>{
	let body = req.body;

		ProductModel.update({_id:body.id},{status:body.status})
			.then(product=>{
				if(product){
					res.json({
						code :0,
						message:'更新操作成功',
					})
				}else{
					ProductModel.getPaginationProduct(body.page,{})
					.then(data=>{
							res.json({
								code :1,
								message:'更新操作失败',
								data:{
									list:data.list,
									current:data.current,
									total:data.total,
									pageSize:data.pageSize,
									status:data.status
								}
							})
					})
				}
			})
})
router.get('/edit',(req,res)=>{
	

	let id = req.query.id;
		ProductModel
		.findById(id,'-__v -order -status -timestamps -createdAt -updatedAt')
		.populate({path:'CategoryId',select:'_id pid'})
		.then(product=>{
			res.json({
					code :0,
					data:product
				})
		})
		.catch(e=>{
			res.json({
				code:1,
				message:"失败"
			})
		})
			
})
router.get('/serarchName',(req,res)=>{
	

	let id = req.query.id;

	let keyword = req.query.keyword;

	let page =  req.query.page;
	ProductModel
	.getPaginationProduct(page,{
		name:{$regex:new RegExp(keyword,'i')}
	})
	.then(data=>{
			res.json({
				code :0,
				
				data:{
					list:data.list,
					current:data.current,
					total:data.total,
					pageSize:data.pageSize,
					status:data.status,
					keyword:keyword
				}
			})
	})
		.catch(e=>{
			res.json({
				code:1,
				message:"失败"
			})
		})
			
})

module.exports = router;

