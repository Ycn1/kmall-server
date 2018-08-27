 const Router = require('express').Router;

const UserModel = require('../models/user.js');
const path = require('path');
const CommentModel = require('../models/comment.js');

const pagination = require('../util/pagination.js');

const hamc = require('../util/hamc.js');
 const fs = require('fs');
const hmac = require('../util/hamc.js')


 const router = new Router();

 const multer = require('multer');

var upload = multer({ dest: 'public/uploads/' })

/*router.use('/init',(req,res)=>{
				// hmac.update(req.body.password);
				 new UserModel({
					username:"admin",
					password:hmac("admin"),
					isAdmin:true
					
				
				}).save((err,data)=>{
					res.send('ok');
				})
})*/
 router.get('/',(req,res)=>{
	res.render('admin/index',{
		userInfo:req.userInfo
	});

});

 router.post('/login',(req,res)=>{

	let body = req.body;
	console.log("111",body);

	let result = {
		code:0,
		message:''
	};
	UserModel
	.findOne({username:body.username,password:hmac(body.password),isAdmin:true})
	.then((user)=>{
		
		if(user){//登录成功
			
			 req.session.userInfo = {
			 	_id:user._id,
			 	username:user.username,
			 	isAdmin:user.isAdmin
			 }
			 result.data= {
			 	username:user.username,
			 }
			 // console.log(req.session);
			 res.json(result);
		}else{
			result.code = 1;
			result.message = '用户名和密码错误'
			res.json(result);
		}
	})
	
});
 router.get('/logout',(req,res)=>{
	let result  = {
		code:0,// 0 代表成功 
		message:''
	}
	// req.cookies.set('userInfo',null);
	req.session.destroy();
	res.json(result);

});

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
 router.get('/count',(req,res)=>{
	let result  = {
		code:0,// 0 代表成功 
		message:'',
		data:{
			usernumber:1666,
			ordernumber:1888,
			productnumber:1999
		}

	}
	res.json(result)
});

 router.get('/users',(req,res)=>{
 	
	let options ={
		page:req.query.page,
		model:UserModel,
		query:{},
		projection:'',
		sort:{_id:1}
	}
	pagination(options)
	.then((data)=>{
		console.log("user!!",data)

		res.json({
			code :0,
			data:{
				list:data.list,
				page:data.page,
				total:data.total,
				pageSize:data.pageSize
			}
		});
		/*res.render('admin/users_list',{
				userInfo:req.userInfo,
				list:data.list,
				page:data.page,
				url:'/admin/users',
				pages:data.pages,
		});	*/
	})
 	
});



router.post('/uploadImages',upload.single('upload'),(req,res)=>{
	let path = "/uploads/"+req.file.filename;
	// console.log(req.body);
	res.json({
		uploaded:true,

        url:path
	})
});
router.get('/comments',(req,res)=>{
	CommentModel.getPaginationComment(req)
	.then(data=>{
		res.render('admin/comment_list',{
			userInfo:req.userInfo,
			comments:data.docs,
			page:data.page,
			pages:data.pages,
			list:data.list,
			url:'/admin/comments'
		})
	})
});

router.get('/comment/delete/:id',(req,res)=>{
	let id  = req.params.id;

	CommentModel.remove({_id:id},function(err,result){
		if(!err){
			res.render('admin/category-success',{
				userInfo:req.userInfo,
				message:'评论删除成功',
				url:'/admin/comments'
			});
		}else{
			res.render('admin/category-error',{
				userInfo:req.userInfo,
				message:'评论删除失败',
				url:'/admin/comments'
			});
		}
	})
})

router.get("/site",(req,res)=>{

	let filePath = path.normalize(__dirname + '/../site-info.json');
	fs.readFile(filePath,(err,data)=>{
		if(!err){
			let site = JSON.parse(data);
			res.render('admin/site',{
					userInfo:req.userInfo,
					site:site
			});	
		}else{
			
		}
	})

});

router.post("/site",(req,res)=>{
	let body = req.body;
	let site = {
		name:body.name,
		author:{
			name:body.authorName,
			intro:body.authorIntro,
			image:body.authorImage,
			wechat:body.authorWechat
		},
		icp:body.icp
	}
	site.carouseles = [];
	
	if(body.carouselUrl.length && (typeof body.carouselUrl == 'object')){
		for(let i = 0;i<body.carouselUrl.length;i++){
			site.carouseles.push({
				url:body.carouselUrl[i],
				path:body.carouselPath[i]
			})			
		}
	}else{
		site.carouseles.push({
			url:body.carouselUrl,
			path:body.carouselPath
		})
	}


	site.ads = [];

	if(body.adUrl.length && (typeof body.adUrl == 'object')){
		for(let i = 0;i<body.adUrl.length;i++){
			site.ads.push({
				url:body.adUrl[i],
				path:body.adPath[i]
			})			
		}
	}else{
		site.ads.push({
			url:body.adUrl,
			path:body.adPath
		})
	}

	let strSite = JSON.stringify(site);

	let filePath = path.normalize(__dirname + '/../site-info.json');
	fs.writeFile(filePath,strSite,(err)=>{
		if(!err){
			res.render('admin/category-success',{
				userInfo:req.userInfo,
				message:'更新站点信息成功',
				url:'/admin/site'
			})				
		}else{
	 		res.render('admin/category-error',{
				userInfo:req.userInfo,
				message:'更新站点信息失败,文件写入失败'
			})				
		}
	})

});

router.get('/password',(req,res)=>{
	res.render('admin/password',{
		userInfo:req.userInfo,

	})
})

router.post('/password',(req,res)=>{
	UserModel.update({_id:req.userInfo._id},{
		password:hamc(req.body.password)
	})
	.then((result)=>{
		req.session.destroy();
		res.render('admin/category-success',{
				userInfo:req.userInfo,
				message:'密码更新成功',
				url:'/'
			})	

	})
})


 module.exports = router;
