const Router = require('express').Router;

const UserModel = require('../models/user.js');

const pagination = require('../util/pagination.js');

const ResourceModel = require('../models/resource.js');

const fs = require('fs');

const path = require('path');

const router = new Router();

const multer = require('multer');

var upload = multer({ dest: 'public/resource/' })


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/resource/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+path.extname(file.originalname) )
  }
})

var upload = multer({ storage: storage })


 router.get('/',(req,res)=>{
 	let options ={
		page:req.query.page,
		model:ResourceModel,
		query:{},
		// projection:'_id name order',
		sort:{_id:-1}
	}
	pagination(options)
	.then((data)=>{
		res.render('admin/resource_list',{
				userInfo:req.userInfo,
				resources:data.docs,
				page:data.page,
				list:data.list,
				pages:data.pages,
				url:'/resource'
		});
	})
	
});


router.get('/add',(req,res)=>{


	res.render('admin/resource_add',{
		userInfo:req.userInfo
	});
});


router.post('/add',upload.single('file'),(req,res)=>{

	new ResourceModel({
		name:req.body.name,
		path:'/resource/'+req.file.filename
	})
	.save()
	.then(resource=>{
		res.render('admin/category-success',{
			userInfo:req.userInfo,
			message:'资源插入成功',
			url:'/resource'
		});
	})
	
})


router.get('/delete/:id',(req,res)=>{

	let id = req.params.id;
	ResourceModel.findByIdAndRemove(id)
	.then((resource)=>{
		let filepath = path.normalize(__dirname +'/../public/'+ resource.path);

		fs.unlink(filepath,(err)=>{
			if(!err){
				res.render('admin/category-success',{
					userInfo:req.userInfo,
					message:'资源删除成功',
					url:'/resource'
				});
			}else{
				res.render('admin/category-error',{
					userInfo:req.userInfo,
					message:'资源删除失败',
					url:'/resource'
				});
			}
		})

	})
	.catch((e)=>{
		res.render('admin/category-error',{
			userInfo:req.userInfo,
			message:'资源删除失败,数据库操作失败',
			url:'/resource'
		});
	})
})

 module.exports = router;

