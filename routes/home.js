 const Router = require('express').Router;

const UserModel = require('../models/user.js');
const path = require('path');
const CommentModel = require('../models/comment.js');

const pagination = require('../util/pagination.js');

const hamc = require('../util/hamc.js');
 const fs = require('fs');

 const router = new Router();

 const multer = require('multer');

var upload = multer({ dest: 'public/uploads/' })



 

 router.get('/',(req,res)=>{
	res.render('home/index',{
		userInfo:req.userInfo
	});



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

router.get('/comments',(req,res)=>{
	CommentModel.getPaginationComment(req,{user:req.userInfo._id})
	.then(data=>{
		res.render('home/comment_list',{
			userInfo:req.userInfo,
			comments:data.docs,
			page:data.page,
			pages:data.pages,
			list:data.list,
			url:'/home/comments'
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
				url:'/home/comments'
			});
		}else{
			res.render('admin/category-error',{
				userInfo:req.userInfo,
				message:'评论删除失败',
				url:'/home/comments'
			});
		}
	})
})

router.get('/password',(req,res)=>{
	res.render('home/password',{
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
