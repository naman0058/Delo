var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'booking';
var upload = require('./multer');



router.get('/enquiry/:id/:name',(req,res)=>{
	pool.query(`select number from delomart_product where id="${req.params.id}"`,(err,result)=>{
		if(err) throw err;
		else{
			res.render('send_enquiry',{msg:result[0].number})
		}
	})
})

module.exports = router
