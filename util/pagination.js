let pagination = (options) =>{
  return	new Promise ((resolve,reject)=>{


	 	let page =  1;

	 	if(!isNaN(parseInt(options.page))){
	 		page = parseInt(options.page);
	 	}

	 	let limit =5;
	 	
	 	if(page <= 0){
	 		page = 1;
	 	}

	 	options.model.countDocuments(options.query)
			.then((count)=>{
				let pages = Math.ceil(count / limit);
				if(page > pages){
					page = pages;
				}
			

				if(pages == 0){
					page = 1;
				}

			
				
				let skip = (page - 1)*limit;

				let query = options.model.find(options.query,options.projection);

				if(options.populate){
					for(let i = 0;i<options.populate.length;i++){
						query = query.populate(options.populate[i]);
					}
				}
				query
				.sort(options.sort)
				.skip(skip)
				.limit(limit)
				.then((docs)=>{
					resolve({
						list:docs,
						current:page*1,
					
						pageSize:limit,
						total:count
					});
					// res.render('admin/users_list',{
						
						
					// });			
				});

			});
	});
}

module.exports = pagination;