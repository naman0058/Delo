var express = require('express')
var router = express.Router()
var table = "rate_card"
var pool = require('./pool')

router.get('/',(req,res)=> req.session.usernumber ? res.render(`rate_card`,{login:false}) :  res.render('rate_card',{login:false}))




router.post('/insert', (req, res) => {
    let body = req.body;
    var dirt = false
    var seo_variable = (body.name.split(' ').join('-')).toLowerCase()
    body['seo_name'] = seo_variable 
    pool.query(`insert into ${table} set ?`, body, (err, result) => {
        if(err) throw err;
        else res.redirect('/rate_card')
    })
})


router.get('/all',(req,res)=>{
	pool.query(`select r.* , c.name as categoryname, s.name as subcategoryname from ${table} r left join category c on c.id=r.categoryid left join subcategory s on s.id = r.subcategoryid`,(err,result)=>{
		err ? conosle.log(err) : res.json(result)
	})
})



router.get('/delete', (req, res) => {
    const { id } = req.query
    pool.query(`delete from ${table} where id = ${id}`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})

router.post('/update', (req, res) => {
    console.log(req.body)
    pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})

module.exports = router
