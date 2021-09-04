var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'marketing_executive';
var upload = require('./multer');

router.get('/',(req,res)=>{
    res.render('marketing_executive',{msg : ''})
    })


router.post('/insert', (req, res) => {
    let body = req.body;
     pool.query(`insert into ${table} set ?`, body, (err, result) => {
        if(err) throw err;
        else res.render('marketing_executive',{msg : 'Your Request is successfully submitted..Our team will contact you within 24-48 hours'})
    })
})


router.get('/login',(req,res)=>{
	res.render('marketing_executive_login',{msg:''})
})


router.post('/verification',(req,res)=>{
	pool.query(`select * from marketing_executive where email = "${req.body.email}" and password = "${req.body.password}" and status = 'approve'`,(err,result)=>{
		if(err) throw err;
		else if(result[0]) {
			req.session.marketing_executive_id = result[0].id
			res.redirect('/marketing_executive/dasboard')
		}
		else res.render('marketing_executive_login',{msg: 'Invalid Login Credentials'})
	})
})


router.get('/dasboard',(req,res)=>{
	if(req.session.marketing_executive_id){
      var query = `select * from marketing_executive_data;`
      var query = `select * from marketing_executive_data;`
      pool.query(query+query1,(err,result)=>{
      	if(err) throw err;
      	else res.resnder('marketing_executive_dashboard')
      })
	}
	else{
		res.render('marketing_executive_login',{msg:'Please Login....'})
	}
})



router.get('/marketing_form',(req,res)=>{
	res.render('marketing_form',{msg : ''})
})



router.post('/marketing_executive_data_insert', (req, res) => {
    let body = req.body;
    body['marketing_executive_id'] = req.session.marketing_executive_id
     pool.query(`insert into marketing_executive_data_insert set ?`, body, (err, result) => {
        if(err) throw err;
        else res.render('marketing_form',{msg : 'submitted'})
    })
})



router.get('/track',(req,res)=>{
	pool.query(`select * from marketing_executive_data where marketing_executive_id = "${req.session.marketing_executive_id}"`,(err,result)=>{
		if(err) throw err;
		else res.render('marketing_executive_tracking',{result:result})
	})
})




module.exports = router
