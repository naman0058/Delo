var express = require('express')
var router = express.Router();
var pool = require('./pool')



router.get('/',(req,res)=>{
	if(req.session.listing_number){
		pool.query(`select * from listing where number = "${req.session.listing_number}"`,(err,result)=>{
			if(err) throw err;
			else res.render('manage_campign',{result:result})
		})
		
	}
	else{
		res.send('You have not access...')
	}
})
module.exports = router
