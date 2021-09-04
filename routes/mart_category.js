var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'delomart_category';
var upload = require('./multer');

router.get('/', (req, res) => {
    // if(req.session.adminid ||    req.session.componentadminid) {
    // res.render(`${table}`, { login: true , msg  : '' });
    // }
    // else
    // {
         res.render(`mart_category`,{msg : ''});
    
})

router.post('/insert',upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'image', maxCount: 1 }]), (req, res) => {
    let body = req.body;
    var dirt = false
    var seo_variable = (body.name.split(' ').join('-')).toLowerCase()
    body['logo'] = req.files['logo'][0].filename
    body['image'] = req.files['image'][0].filename
    body['seo_name'] = seo_variable 
    pool.query(`insert into ${table} set ?`, body, (err, result) => {
        if(err) throw err;
        else res.render('mart_category',{msg : 'Successfully Inserted'})
    })
})



router.get('/all', (req, res) => {
   
    pool.query(`select * from ${table}`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })

})



router.get('/single', (req, res) => {
    const { id } = req.query
    pool.query(`select * from ${table} where id = ${id}`, (err, result) => {
        if(err) throw err;
        else res.json(result);
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


router.post('/update_image',upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'image', maxCount: 1 }]), (req, res) => {
    let body = req.body;

    body['logo'] = req.files['logo'][0].filename
    body['image'] = req.files['image'][0].filename
   console.log(body)
   pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) throw err;
        else res.redirect('/mart_category')
    })
})



router.get('/allcategory', (req, res) => {
    pool.query(`select * from ${table}`, (err, result) => {
        if(err) throw err;
        else res.render(`allcategory`,{result : result});
    })
})



router.post('/bysubcategory',(req,res)=>{
    console.log(req.body)
})



router.get('/all-lisiting', (req, res) => {
   
    pool.query(`select * from dial_category`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })

})



router.get('/city', (req, res) => {
   
    pool.query(`select * from city`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })

})



router.get('/locality', (req, res) => {
    pool.query(`select * from locality`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })
})


router.get('/dial_categories', (req, res) => {
    pool.query(`select * from dial_category order by name`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })

})


router.get('/dial_subcategory', (req, res) => {
    pool.query(`select * from dial_subcategory order by name`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })

})




router.get('/dial_subservices', (req, res) => {
    pool.query(`select * from dial_subservices order by name`, (err, result) => {
        if(err) throw err;
        else res.json(result);
    })

})












router.get('/search',(req,res)=>{

  pool.query(`select id , seo_name , subcategoryid from delomart_subservices where name = "${req.session.search}"`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
 let subservices_seo_name = result[0].seo_name
  let subcategoryid = result[0].subcategoryid
      console.log('subservicesid',result[0].id)
      let query = `select p.*,
               (select c.name from mart_user c where c.number = p.number) as companyname,
               (select l.address from mart_user l where l.number = p.number) as companyaddress,
               (select ci.name as cityname from city ci where ci.id = (select lis.cityid from mart_user lis where lis.number = p.number)) as cityname,
                (select lo.name as localityname from locality lo where lo.id = (select list.localityid from mart_user list where list.number = p.number)) as localityname
       from delomart_product p where p.subservicesid = "${result[0].id}";`
        var query1 = `select * from delomart_subservices order by name;`
        var query2 = `select * from city order by name;`
        var query3 = `select * from delomart_brand where subservicesid = "${result[0].id}";`
        var query4 = `select d.*,  
        (select s.seo_name from delomart_subcategory s where s.id = d.subcategoryid) as seosubcategoryname,
        (select c.seo_name from delomart_category c where c.id = d.categoryid) as seocategoryname
 from delomart_subservices d where d.subcategoryid = "${subcategoryid}";`
       pool.query(query+query1+query2+query3+query4,(err,result)=>{
        if(err) throw err;
        else if(result[0][0]) res.render('product_show',{result:result,name:subservices_seo_name})
                else res.send("data not available")
      })
    }
    else{
  res.render('not_search',{msg:'Tell us what are you looking for?',search:req.session.search})
    }
  })
    
})














module.exports = router;