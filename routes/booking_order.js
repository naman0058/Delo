var express = require('express')
var pool = require('./pool')
var router = express.Router()
var table = 'booking';
var upload = require('./multer');


router.get('/', (req, res) => {
  if(req.session.adminid){  
    pool.query(`select b.*,
    (select s.name from services s where s.id = b.booking_id) as service_name
    from booking b where b.usernumber = "${req.session.usernumber}"`,(err,result)=>{
        if(err) throw err;
       // else res.json(result)
        else  res.render(`booking`, { msg  : '', result:result });
    })  
   
  }
  else{
    res.redirect('login')
  }
  
})


router.get('/delete', (req, res) => {
  const { booking_id } = req.query
  pool.query(`delete from ${table} where booking_id = ${booking_id}`, (err, result) => {
      if(err) throw err;
      else res.json(result);
  })
})

module.exports = router;