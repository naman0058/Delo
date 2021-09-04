var express = require('express');
var router = express.Router();
var pool = require('./pool')
var upload = require('./multer');
var table = 'team'




var today = new Date();
var dd = today.getDate();

var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();
if(dd<10) 
{
    dd='0'+dd;
} 

if(mm<10) 
{
    mm='0'+mm;
} 
today = yyyy+'-'+mm+'-'+dd;





//router.get('/',(req,res)=>res.render('team',{msg : ''}));

router.get('/',(req,res)=>{
  if(req.session.teamnumber || req.session.loginverify)
  res.render('team',{msg : ''})
  else res.redirect('/team_login')
})


//////////////////////////for team insert//////////////////////////
router.post('/insert',upload.fields([{ name: 'image', maxCount: 1 }, { name: 'front_side', maxCount: 1 },{name:'back_side', maxCount : 1}, { name: 'pan_front_side', maxCount: 1 }, { name: 'pan_back_side', maxCount: 1 }]),(req,res)=>{
    if(req.session.teamnumber){
    let body = req.body
    body['image'] = req.files['image'][0].filename
    body['front_side'] = req.files['front_side'][0].filename
    body['back_side'] = req.files['back_side'][0].filename
    body['pan_front_side'] = req.files['pan_front_side'][0].filename
    body['pan_back_side'] = req.files['pan_back_side'][0].filename
    body['number'] = req.session.teamnumber
    body['created_date'] = today
    console.log(body)
    pool.query(`select * from ${table} where number = "${req.session.teamnumber}"`,(err,result)=>{
      if(err) throw err;
      else if(result[0]) res.render('team',{msg : 'Number is already registered...'})
      else{
        pool.query(`insert into ${table} set ?`, body, (err, result) => {
          if(err) throw err;
          else res.redirect('/processing');
      })
      }
    })
   
}
else{
    res.redirect('/team_login');
}
  })



  router.post('/insert1',upload.single('image'),(req,res)=>{
    if(req.session.teamnumber){
let body = req.body
console.log(req.body)
    body['image'] = req.file.filename
    body['number'] = req.session.teamnumber
    body['created_date'] = today
    console.log(body)
    pool.query(`select * from team1 where number = "${req.session.teamnumber}"`,(err,result)=>{
      if(err) throw err;
      else if(result[0]) res.render('team',{msg : 'Number is already registered...'})
      else{
        pool.query(`insert into team1 set ?`, body, (err, result) => {
          if(err) throw err;
          else res.redirect('/processing');
      })
      }
    })
   
}
else{
    res.redirect('/team_login');
}
  })


/*
  router.post('/insert1',upload.single('image'),(req,res)=>{
    if(req.session.teamnumber){
    let body = req.body
    body['image'] = req.file.filename
    body['number'] = req.session.teamnumber
    console.log(body)
    pool.query(`select * from team1 where number = "${req.session.teamnumber}"`,(err,result)=>{
      if(err) throw err;
      else if(result[0]) res.render('team',{msg : 'Number is already registered...'})
      else{
        pool.query(`insert into team1 set ?`, body, (err, result) => {
          if(err) throw err;
          else res.redirect('/processing');
      })
      }
    })
   
}
else{
    res.redirect('/team_login');
}
  })
*/

  //////////////////////////////////////////////////////////////////////


  router.get('/all',(req,res)=>{
    var query = `select t.* , 
    (select s.name from services s where s.id = t.servicesid) as servicesname,
    (select s.name from services s where s.id = t.servicesid1) as servicesname1,
    (select s.name from services s where s.id = t.servicesid2) as servicesname2,
    (select s.name from services s where s.id = t.servicesid3) as servicesname3,
    (select s.name from services s where s.id = t.servicesid4) as servicesname4,
    (select s.name from services s where s.id = t.servicesid5) as servicesname5 
    from team t where approval is null`
    pool.query(query,(err,result)=>{
      if(err) throw err;
      else res.json(result)
    })

  })

  router.post('/update', (req, res) => {
    console.log(req.body)
    pool.query(`update ${table} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
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



router.get('/team_signin',(req,res)=>{
  res.render(`team_signin`);
})


router.get('/help-center',(req,res)=>{
  res.render(`help_center`);
})



router.post('/response',(req,res)=>{
  let body = req.body
  console.log(body)
  pool.query(`update team1 set ? where id = ?`, [req.body, req.body.id], (err, result) => {
    if(err) throw err;
    else res.json(result);
})
})
module.exports = router