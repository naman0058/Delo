var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'category';
var upload = require('./multer');


router.get('/', (req, res) => {
    var query = `select * from subcategory where categoryid = '7';`
    var query1 = `select * from subcategory where categoryid = '8';`
    var query2 = `select * from subcategory where categoryid = '9';`
    var query3 = `select * from subcategory where categoryid = '10';`
    var query4 = `select * from subcategory where categoryid = '11';`
    var query5 = `select * from subcategory where categoryid = '12';`
    var query6 = `select * from subcategory where categoryid = '13';`
    var query7 = `select * from subcategory where categoryid = '14';`
    var query8 = `select * from subcategory where categoryid = '15';`
    var query9 = `select * from subcategory where categoryid = '16';`
    var query10 = `select * from subcategory where categoryid = '17';`
    var query11 = `select * from subcategory where categoryid = '18';`
    var query12 = `select * from subcategory where categoryid = '19';`
    var query13 = `select * from subcategory where categoryid = '21';`
    var query14 = `select * from subcategory where categoryid = '22';`
    var query15 = `select * from subcategory where categoryid = '26';`
    var query16 = `select * from subcategory where categoryid = '28';`
    var query17 = `select * from subcategory where categoryid = '29';`
    var query18 = `select * from subcategory where categoryid = '30';`
    var query19 = `select * from subcategory where categoryid = '31';`
    var query20 = `select * from subcategory where categoryid = '32';`
    var query21 = `select * from subcategory where categoryid = '33';`
    var query22 = `select * from subcategory where categoryid = '34';`
    var query23 = `select * from subcategory where categoryid = '35';`

    pool.query(query+query1+query2+query3+query4+query5+query6+query7+query8+query9+query10+query11+query12+query13+query14+query15+query16+query17+query18+query19+query20+query21+query22+query23,(err,result)=>{
        err ? console.log(err) : res.render(`sitemap`,{result:result});
    })
    
  
})


module.exports = router;