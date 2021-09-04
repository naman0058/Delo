var express = require('express');
var router = express.Router();
var upload = require('./multer');
var pool = require('./pool')
var table = 'category';
const fs = require("fs");


var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;

router.get('/index-category',(req,res)=>{
	pool.query(`select * from category limit 7`,(err,result)=>{
		if(err) throw err;
        else res.json(result)
	})
})



router.get('/allcategory',(req,res)=>{
	pool.query(`select * from category `,(err,result)=>{
		if(err) throw err;
        else res.json(result)
	})
})



router.post('/subcategory',(req,res)=>{
    pool.query(`select s.* , (select c.name from category c where c.id = s.categoryid) as categoryname from subcategory s where s.categoryid = '${req.body.categoryid}'`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})

router.post('/services',(req,res)=>{
    pool.query(`select s.* , (select su.name from subcategory su where su.id = s.subcategoryid) as subcategoryname from product s where s.subcategoryid = '${req.body.subcategoryid}'`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
})















// Cart Api



router.post("/cart", (req, res) => {
  let body = req.body;
  console.log(req.body);
        pool.query(
          `select * from product where id = "${req.body.booking_id}" `,
          (err, result) => {
            if (err) throw err;
            else {
              body["categoryid"] = result[0].categoryid;
              body["subcategoryid"] = result[0].subcategoryid;
              body["price"] = result[0].price;
              body["oneprice"] = result[0].price;
              body["quantity"] = "1";
              body["price"] = req.body.price;
              var qua = "1";
              pool.query(
                `select * from cart where usernumber = '${req.body.usernumber}'`,
                (err, result) => {
                  if (err) throw err;
                  else if (result[0]) {
                    if (req.body.categoryid == result[0].categoryid) {
                      if (req.body.booking_id == result[0].booking_id) {
                        pool.query(
                          `update cart set quantity = quantity+${qua} , price = price+${req.body.price} where booking_id = '${req.body.booking_id}' and usernumber = '${req.body.usernumber}'`,
                          (err, result) => {
                            if (err) throw err;
                            else {
                              res.json({
                                msg: "updated sucessfully",
                              });
                            }
                          }
                        );
                      } else {
                        pool.query(
                          `insert into cart set ?`,
                          body,
                          (err, result) => {
                            if (err) throw err;
                            else {
                              res.json({
                                msg: "updated sucessfully",
                              });
                            }
                          }
                        );
                      }
                    } else {
                      res.json({
                        msg:
                          "Can not book two different categories product simultaneously. Replace cart ?",
                      });
                    }
                  } else {
                    pool.query(
                      `insert into cart set ?`,
                      body,
                      (err, result) => {
                        if (err) throw err;
                        else {
                          res.json({
                            msg: "updated sucessfully",
                          });
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      });

router.post("/cart/replace", (req, res) => {
  let body = req.body;
  console.log(req.body);
  pool.query(
    `select * from product where id = "${req.body.booking_id}" `,
    (err, result) => {
      if (err) throw err;
      else {
        body["categoryid"] = result[0].categoryid;
        body["subcategoryid"] = result[0].subcategoryid;
        body["price"] = result[0].price;
        body["oneprice"] = result[0].price;
        body["quantity"] = "1";
        body["price"] = req.body.price;

        pool.query(
          `delete from cart where usernumber = '${req.body.usernumber}'`,
          (err, result) => {
            if (err) throw err;
            else {
              pool.query(`insert into cart set ?`, body, (err, result) => {
                if (err) throw err;
                else {
                  res.json({
                    msg: "updated sucessfully",
                  });
                }
              });
            }
          }
        );
      }
    }
  );
});


router.post("/cart/all", (req, res) => {
    pool.query(
      `select usernumber from cart where usernumber = '${req.body.usernumber}'`,
      (err, result) => {
        if (err) throw err;
        else res.json(result);
      }
    );
 
});

router.post("/mycart", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    var query = `select c.*,(select s.name from product s where s.id = c.booking_id) as servicename
    ,(select s.logo from product s where s.id = c.booking_id) as productlogo
    from cart c where c.usernumber = '${req.body.usernumber}';`;
    var query1 = `select count(id) as counter from cart where usernumber = '${req.body.usernumber}';`;
    var query2 = `select sum(price) as total_ammount from cart  where usernumber = '${req.body.usernumber}'; `;
    pool.query(query + query1 + query2, (err, result) => {
      if (err) throw err;
      else if (result[0][0]) {
        req.body.mobilecounter = result[1][0].counter;
        console.log("MobileCounter", req.body.mobilecounter);
        res.json(result);
      } else
        res.json({
          msg: "empty cart",
        });
    });
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/cartupdate", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    pool.query(
      `select id,price,oneprice,quantity from cart where id = "${req.body.id}"`,
      (err, result) => {
        if (err) throw err;
        else {
          console.log(result[0]);
          pool.query(
            `update cart set price = price + oneprice , quantity = quantity+1  where id = "${req.body.id}"`,
            (err, result) => {
              err
                ? console.log(err)
                : res.json({
                    msg: "updated successfully",
                  });
            }
          );
        }
      }
    );
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/cartdelete", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    pool.query(
      `select id,price,quantity from cart where id = "${req.body.id}"`,
      (err, result) => {
        if (err) throw err;
        else if (result[0].quantity > 1) {
          console.log(result[0]);
          pool.query(
            `update cart set price = price - (price/quantity) , quantity = quantity-1  where id = "${req.body.id}"`,
            (err, result) => {
              err
                ? console.log(err)
                : res.json({
                    msg: "deleted successfully",
                  });
            }
          );
        } else {
          pool.query(
            `delete from cart where id = "${req.body.id}"`,
            (err, result) => {
              err
                ? console.log(err)
                : res.json({
                    msg: "deleted successfully",
                  });
            }
          );
        }
      }
    );
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

module.exports = router;