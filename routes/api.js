var express = require("express");
var pool = require("./pool");
var router = express.Router();
var upload = require("./multer");
const SendOtp = require("sendotp");
const sendOtp = new SendOtp("300563AFuzfOZn9ESb5db12f8f");
var msg91 = require("msg91-sms");
var authkey = "300563AFuzfOZn9ESb5db12f8f";
var senderid = "DELOTM";
var route = "4";
//promotional=1, transactional=4
var dialcode = "91";
var payumoney = require("payumoney-node");
payumoney.setKeys(
  `${process.env.PAYUMONEYKEY1}`,
  `${process.env.PAYUMONEYKEY2}`,
  `${process.env.PAYUMONEYKEY3}`
);
payumoney.isProdMode(true);
var request = require("request");
const fetch = require("node-fetch");
const { Expo } = require("expo-server-sdk");

const Razorpay = require("razorpay");
var instance = new Razorpay({
  key_id: "rzp_live_2KlcXieUGyQ8k6",
  key_secret: "9CukFlVqEBgQ1l7LB03DXBPk",
});

var dt = new Date();
var todaytime = (dt.getHours() + ":" + dt.getMinutes()).toString();

console.log("present time", todaytime);
console.log("aa gya", process.env.encryptedkey);

/////////////////////////Team API Starts/////////////////////////////
var today = new Date();
var newdate = new Date();
newdate.setDate(today.getDate() + 30);

var dt = new Date();
var todaytime = dt.getHours() + ":" + dt.getMinutes();

var dd = today.getDate();

var futuretime = today.getHours() + 2 + ":" + today.getMinutes();

var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();
var a = newdate.getDate();
var b = newdate.getMonth() + 1;
if (dd < 10) {
  dd = "0" + dd;
}

if (a < 10) {
  a = "0" + a;
}

if (mm < 10) {
  mm = "0" + mm;
}

if (b < 10) {
  b = "0" + b;
}
today = yyyy + "-" + mm + "-" + dd;

var my = newdate.toLocaleDateString();
var my1 = newdate.getFullYear() + "-" + b + "-" + a;
//console.log(today)
//console.log(newdate)
//console.log(my1)

router.post("/userlogin", (req, res) => {
  let r = Math.random().toString(36).substring(7);

  console.log("random", r);

  console.log("aa gya", process.env.encryptedkey);
  if (process.env.encryptedkey == req.body.key) {
    var otp = Math.floor(100000 + Math.random() * 9000);
    sendOtp.send(req.body.number, "DELOTM", otp, (err, result) => {
      if (err) res.json({ error: "error" });
      else {
        pool.query(
          `insert into otp_msg (number,date,time) values('${req.body.number}','${today}','${todaytime}')`,
          (err, result) => {
            if (err) throw err;
            else {
              res.json({ success: "successfully send otp" });
            }
          }
        );
      }
    });
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/getotp", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    console.log("Sending Number", req.body.number);
    var otp = Math.floor(100000 + Math.random() * 9000);
    pool.query(
      `select * from team1 where number = ${req.body.number}`,
      (err, result) => {
        if (err) throw err;
        else if (result[0]) {
          res.send({
            type: "success",
            msg: "number already registered",
          });
          console.log("response send");
        } else {
          sendOtp.send(req.body.number, "DELOTM", otp, (err, result) => {
            console.log("error", err);
            if (err) res.json({ error: "error" });
            else {
              pool.query(
                `insert into otp_msg (number,date,time) values('${req.body.number}','${today}','${todaytime}')`,
                (err, result) => {
                  if (err) throw err;
                  else {
                    res.json({ success: "successfully send otp" });
                  }
                }
              );
            }
          });
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

router.post("/teamlogin", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    var otp = Math.floor(100000 + Math.random() * 9000);
    pool.query(
      `select * from team where number = "${req.body.number}"`,
      (err, result) => {
        if (err) throw err;
        else if (result[0]) {
          console.log('otp',otp)
          sendOtp.send(req.body.number, "DELOTM", otp, (err, result) => {
            if (err) res.json({ error: "error" });
            else {
              pool.query(
                `insert into otp_msg (number,date,time) values('${req.body.number}','${today}','${todaytime}')`,
                (err, result) => {
                  if (err) throw err;
                  else {
                    res.json({
                      type: "success",
                    });
                  }
                }
              );
            }
          });
        } else {
          pool.query(
            `select * from team1 where number = "${req.body.number}"`,
            (err, result) => {
              if (err) throw err;
              else if (result[0]) {
                sendOtp.send(req.body.number, "DELOTM", otp, (err, result) => {
                  if (err) res.json({ error: "error" });
                  else {
                    pool.query(
                      `insert into otp_msg (number,date,time) values('${req.body.number}','${today}','${todaytime}')`,
                      (err, result) => {
                        if (err) throw err;
                        else {
                          res.json({
                            type: "success",
                          });
                        }
                      }
                    );
                  }
                });
              } else {
                res.json({ msg: "number not exist" });
              }
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

// router.post('/otpverification',(req,res)=>sendOtp.verify(req.body.number, req.body.otp, (err,result)=> err ? console.log(err) : res.json(result)));
router.post("/otpverification", (req, res) =>
  sendOtp.verify(req.body.number, req.body.otp, (err, result) =>
    err ? console.log(err) : res.json(result)
  )
);

router.post("/verificationcomplete", (req, res) => {
  console.log("body", req.body);
  let r = Math.random().toString(36).substring(7);

  if (process.env.encryptedkey == req.body.key) {
    pool.query(
      `select * from users where number = "${req.body.number}"`,
      (err, result) => {
        if (err) throw err;
        else if (result[0]) {
          res.json({
            msg: "exists user",
          });
        } else {
          pool.query(
            `insert into users(number,offer,date,valid_date,promocode,latitude,longitude,time,unique_code,refferal_code) values(${req.body.number},'1800','${req.body.date}','${req.body.valid_date}','DELO100','${req.body.latitude}','${req.body.longitude}','${todaytime}','${r}','${req.body.refferal_code}') `,
            (err, result) => {
              if (err) throw err;
              else {
                msg91.sendOne(
                  authkey,
                  req.body.number,
                  `Rs. 1800 Free Cash has been added in your Delo Credits wallet as per offer and it will expire on ${req.body.valid_date}`,
                  senderid,
                  route,
                  dialcode,
                  function (response) {
                    if (err) throw err;
                    else {
                      pool.query(
                        `insert into normal_message (number,date,time,message) values('${req.body.number}','${today}','${todaytime}','Rs. 1800 Free Cash has been added in your Delo Credits wallet as per offer and it will expire on ${req.body.valid_date}') `,
                        (err, result) => {
                          if (err) throw err;
                          else {
                            msg91.sendOne(
                              authkey,
                              req.body.number,
                              `Dear Customer, Thank you for showing interest in Delo Services.`,
                              senderid,
                              route,
                              dialcode,
                              function (response) {
                                if (err) console.log(err);
                                else {
                                  pool.query(
                                    `insert into normal_message (number,date,time,message) values('${req.body.number}','${today}','${todaytime}','Rs. 1800 Free Cash has been added in your Delo Credits wallet as per offer and it will expire on ${req.body.valid_date}') `,
                                    (err, result) => {
                                      if (err) throw err;
                                      else {
                                        res.send("success");
                                      }
                                    }
                                  );
                                }
                              }
                            );
                          }
                        }
                      );

                      res.json({
                        msg: "new user",
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
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/resendotp", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    var otp = Math.floor(100000 + Math.random() * 9000);
    sendOtp.send(req.body.loginverify, "DELOTM", otp, (err, result) => {
      if (err) res.json({ error: "error" });
      else {
        pool.query(
          `insert into otp_msg (number,date,time) values('${req.body.number}','${today}','${todaytime}')`,
          (err, result) => {
            if (err) throw err;
            else {
              res.json(result);
            }
          }
        );
      }
    });
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/teamlogin", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    var otp = Math.floor(100000 + Math.random() * 9000);
    pool.query(
      `select * from team where number = "${req.body.number}"`,
      (err, result) => {
        if (err) throw err;
        else if (result[0]) {
          sendOtp.send(req.body.number, "DELOTM", otp, (err, result) => {
            if (err) res.json({ error: "error" });
            else {
              pool.query(
                `insert into otp_msg (number,date,time) values('${req.body.number}','${today}','${todaytime}')`,
                (err, result) => {
                  if (err) throw err;
                  else {
                    res.json(result);
                  }
                }
              );
            }
          });
        } else res.json({ msg: "number not exist", result });
      }
    );
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/loginverification", (req, res) =>
  sendOtp.verify(req.body.number, req.body.otp, (err, result) =>
    err ? console.log(err) : res.json(result)
  )
);

router.post("/teaminsertdemo", upload.single("image"), (req, res) => {
  let body = req.body;

  body["image"] = req.file.filename;
  body["number"] = req.body.number;
  console.log(body);

  res.json({ msg: "d" });
});

// router.post('/teaminsert',upload.single('image'),(req,res)=>{
//   let body = req.body

//     body['image'] = req.file.filename
//     body['number'] = req.body.number
//     console.log(body)
//     pool.query(`select * from team1 where number = "${req.body.number}"`,(err,result)=>{
//       if(err) throw err;
//       else if(result[0]) res.send({msg : 'already number registered '})
//       else{
//       pool.query(`insert into team1 set ?`, body, (err, result) => {
//           if(err) console.log(err);
//           else {
//             res.json(result)
//           }
//       })
//       }
//     })

//   })

router.post("/teaminsert", upload.single("image"), (req, res) => {
  let body = req.body;

  let r = Math.random().toString(36).substring(7);

  console.log("random", r);

  body["image"] = req.file.filename;

  body["number"] = req.body.number;

  body["unique_code"] = r;

  body["refferalStatus"] = "pending";

  console.log(body);

  pool.query(
    `select * from team1 where number = "${req.body.number}"`,
    (err, result) => {
      if (err) throw err;
      else if (result[0]) res.json({ msg: "already number registered " });
      else {
        if (
          req.body.referral_code == "null" ||
          req.body.referral_code == null ||
          req.body.referral_code == "" ||
          req.body.referral_code == []
        ) {
          pool.query(`insert into team1 set ?`, body, (err, result) => {
            if (err) console.log(err);
            else {
              res.json(result);
            }
          });
        } else {
          pool.query(
            `select name from team where unique_code = '${req.body.referral_code}'`,
            (err, result) => {
              if (err) throw err;
              else if (result[0]) {
                pool.query(`insert into team1 set ?`, body, (err, result) => {
                  if (err) console.log(err);
                  else {
                    res.json(result);
                  }
                });
              } else {
                res.json({
                  msg: "invalid promocode",
                });
              }
            }
          );
        }
      }
    }
  );
});

router.post("/teaminsert1", (req, res) => {
  let body = req.body;
  body["number"] = req.body.number;
  console.log(body);
  pool.query(
    `select * from team1 where number = "${req.body.number}"`,
    (err, result) => {
      if (err) throw err;
      else if (result[0]) res.send({ msg: "already number registered " });
      else {
        pool.query(`insert into team1 set ?`, body, (err, result) => {
          if (err) console.log(err);
          else {
            console.log("result");
            res.json(result);
          }
        });
      }
    }
  );
});

router.post("/processing", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    var query = `select t.* ,(select c.name from category c where c.id = t.categoryid) as categoryname from team t where t.number = ${req.body.number} and approval is not null`;
    pool.query(query, (err, result) => {
      if (err) throw err;
      else if (result[0]) res.json({ msg: "account verified", result });
      else {
        pool.query(
          `select t.* ,(select c.name from category c where c.id = t.categoryid) as categoryname from team1 t where t.number = ${req.body.number}`,
          (err, result) => {
            if (err) throw err;
            else {
              res.json({ msg: "request is under process", result });
            }
          }
        );
      }
    });
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

/////////////////////////Team API Ends/////////////////////
////////////////////////For Users Starts///////////////////

router.post("/allleads", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    console.log("data come", req.body);
    var query1 = `select b.*,(select c.name from category c where c.id = b.categoryid) as categoryname from booking b where
    b.service_agent is null and b.categoryid = "${req.body.categoryid}" || b.service_agent = "" and b.categoryid = "${req.body.categoryid}"
   order by id desc`;
    pool.query(query1, (err, result) => {
      if (err) throw err;
      else res.json(result);
    });
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/myRefferal", (req, res) => {
  var query = `select * from team where referral_code = "${req.body.unique_code}" and refferalStatus = 'pending';`;
  var query1 = `select * from team where referral_code = "${req.body.unique_code}" and refferalStatus = 'completed';`;
  var query2 = `select count(id) from team where referral_code="${req.body.unique_code}" ;`;
  pool.query(query + query1 + query2, (err, result) => {
    if (err) throw err;
    else res.json(result);
  });
});

// Credit History //
router.post("/credit_history", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    pool.query(
      `select * from booking where service_agent = ${req.body.number}`,
      (err, result) => {
        if (err) throw err;
        else res.json(result);
      }
    );
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/check_activation", (req, res) => {
  pool.query(
    `select * from booking where id = ${req.body.id} and addon_activate is not null`,
    (err, result) => {
      if (err) throw err;
      else if (result[0])
        res.json({
          msg: "active",
        });
      else {
        res.json({
          msg: "pending",
        });
      }
    }
  );
});

// BANKING DETAIL //

router.post("/bankdetail", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    pool.query(
      `select * from team where number = ${req.body.number}`,
      (err, result) => {
        if (err) throw err;
        else res.json(result);
      }
    );
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/rate_card_subcategory", (req, res) => {
  pool.query(
    `select *  from subcategory where categoryid = ${req.body.categoryid}`,
    (err, result) => {
      err ? console.log(err) : res.json(result);
    }
  );
});

router.post("/rate_card_service", (req, res) => {
  pool.query(
    `select * from rate_card where subcategoryid = ${req.body.subcategoryid} and type = '${req.body.type}' `,
    (err, result) => {
      err ? console.log(err) : res.json(result);
    }
  );
});

router.post("/activate_addon", (req, res) => {
  console.log(req.body);
  pool.query(
    `update booking set ? where id = ?`,
    [req.body, req.body.id],
    (err, result) => {
      if (err) throw err;
      else
        res.json({
          msg: "success",
        });
    }
  );
});

router.post("/addon_cart/show", (req, res) => {
  var query = `select a.*,(select r.name from rate_card r where r.id = a.serviceid) as servicename from addon_cart a where a.booking_id = ${req.body.bookingid};`;
  var query1 = `select count(id) as counter from addon_cart where booking_id = '${req.body.bookingid}';`;
  var query2 = `select sum(price) as total_ammount from addon_cart  where booking_id = '${req.body.bookingid}'; `;
  var query3 = `select service_charge from addon_cart where booking_id = '${req.body.bookingid}' order by service_charge desc limit 1;`;
  var query4 = `select payment_mode,price,service_agent from booking where id = '${req.body.bookingid}';`;
  pool.query(query + query1 + query2 + query3 + query4, (err, result) => {
    if (err) throw err;
    else if (result[0]) {
      res.json(result);
    } else {
      res.json({
        msg: "no data",
      });
    }
  });
});

router.post("/addon_cart/withour_service/show", (req, res) => {
  var query = `select a.*,(select r.name from rate_card r where r.id = a.serviceid) as servicename from addon_cart a where a.booking_id = ${req.body.bookingid};`;
  var query1 = `select count(id) as counter from addon_cart where booking_id = '${req.body.bookingid}';`;
  var query2 = `select sum(price) as total_ammount from addon_cart  where booking_id = '${req.body.bookingid}'; `;
  var query3 = `select service_charge from addon_cart where booking_id = '${req.body.bookingid}' order by service_charge desc limit 1;`;
  pool.query(query + query1 + query2 + query3, (err, result) => {
    if (err) throw err;
    else if (result[0]) {
      res.json(result);
    } else {
      res.json({
        msg: "no data",
      });
    }
  });
});

router.post("/addon_cart_update", (req, res) => {
  pool.query(
    `update addon_cart set price = price + ${req.body.price} , quantity = quantity+1  where id = ${req.body.id}`,
    (err, result) => {
      if (err) throw err;
      else
        res.json({
          msg: "success",
        });
    }
  );
});
//      var query1 = `select count(id) as counter from addon_cart where booking_id = ${req.body.bookingid};`

router.post("/user_refferal", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    pool.query(
      ` select count(id) * from users where refferal_code = '${req.body.unique_code}' `,
      (err, result) => {
        if (err) throw err;
        else res.json(result);
      }
    );
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/addon_cart_update", (req, res) => {
  pool.query(
    `update addon_cart set price = price + ${req.body.price} , quantity = quantity+1  where id = ${req.body.id}`,
    (err, result) => {
      if (err) throw err;
      else
        res.json({
          msg: "success",
        });
    }
  );
});

router.post("/addon_cart_delete", (req, res) => {
  pool.query(
    `select id,price,quantity from addon_cart where id = ${req.body.id}`,
    (err, result) => {
      if (err) throw err;
      else if (result[0].quantity > 1) {
        console.log(result[0]);

        pool.query(
          `update addon_cart set price = price - (price/quantity) , quantity = quantity-1  where id = ${req.body.id}`,
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
          `delete from addon_cart where id = ${req.body.id}`,
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
});

router.post("/add_on_cart", (req, res) => {
  let body = req.body;
  console.log("body", req.body);
  pool.query(
    `select * from addon_cart  where serviceid = ${req.body.serviceid} and booking_id = ${req.body.booking_id}`,
    (err, result) => {
      if (err) throw err;
      else if (result[0]) {
        pool.query(
          `update addon_cart set quantity = quantity+1 , price = price+${req.body.price} where serviceid = ${req.body.serviceid}`,
          (err, result) => {
            if (err) throw err;
            else {
              res.json({
                msg: "success",
              });
            }
          }
        );
      } else {
        pool.query(`insert into addon_cart set ?`, body, (err, result) => {
          if (err) throw err;
          else {
            res.json({
              msg: "success",
            });
          }
        });
      }
    }
  );
});

router.post("/ongoing", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    pool.query(
      `select b.* ,(select c.name from category c where c.id = b.categoryid) as categoryname  from booking b where b.date = CURDATE() and b.service_agent = "${req.body.number}"  and b.status is null order by time desc`,
      (err, result) => {
        if (err) throw err;
        else res.json(result);
      }
    );
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/single_ongoing", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    pool.query(
      `select b.* ,(select c.name from category c where c.id = b.categoryid) as categoryname  from booking b where id = '${req.body.id}'`,
      (err, result) => {
        if (err) throw err;
        else res.json(result);
      }
    );
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/upcoming", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    pool.query(
      `select b.* ,(select c.name from category c where c.id = b.categoryid) as categoryname ,(select s.name from services s where s.id = b.booking_id) as servicesname from booking b where b.date = CURDATE() + INTERVAL 1 DAY and b.service_agent = "${req.body.number}"   order by time desc`,
      (err, result) => {
        if (err) throw err;
        else res.json(result);
      }
    );
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/single_upcoming", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    pool.query(
      `select b.* ,(select c.name from category c where c.id = b.categoryid) as categoryname ,(select s.name from services s where s.id = b.booking_id) as servicesname from booking b where id = "${req.body.id}"`,
      (err, result) => {
        if (err) throw err;
        else res.json(result);
      }
    );
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/wallets", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    var query = `select name,emailid,number,recharge_value from team where number = "${req.body.number}" `;
    pool.query(query, (err, result) => {
      if (err) throw err;
      else res.json(result);
    });
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

// router.post('/user_history',(req,res)=>{
//   if(process.env.encryptedkey == req.body.key){
//     var query = `select * from booking where number = '${req.body.number}' `
//     pool.query(query,(err,result)=>{
//       if(err) throw err;
//       else  res.json(result)
//     })
//   }
//   else{
//     res.json({
//       type : 'error',
//       description : '404 Not Found'
//     })
//   }
// })

router.post("/leads_history", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    pool.query(
      `select b.* ,(select c.name from category c where c.id = b.categoryid) as categoryname  from booking b where  b.service_agent = '${req.body.number}'  and status = 'completed'`,
      (err, result) => {
        if (err) throw err;
        else res.json(result);
      }
    );
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/single_history", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    pool.query(
      `select b.* ,(select c.name from category c where c.id = b.categoryid) as categoryname  from booking b where id="${req.body.id}"`,
      (err, result) => {
        if (err) throw err;
        else res.json(result);
      }
    );
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/wallet_history", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    pool.query(
      `select mode,createdOn,productinfo,amount,payment_source from recharge where phone = "${req.body.number}" `,
      (err, result) => {
        if (err) throw err;
        else res.json(result);
      }
    );
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/rating", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    pool.query(
      `select name,rating,review from booking where service_agent = "${req.body.number}" and rating is not null and review is not null and rating != 'get_rating' and review!= 'get_rating' and rating!='get_review' and review != 'get_review'`,
      (err, result) => {
        if (err) throw err;
        else res.json(result);
      }
    );
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.get("/get-all-category", (req, res) => {
  pool.query(
    `select *  from category where status = 'approved'`,
    (err, result) => {
      if (err) throw err;
      else if (result[0]) res.json(result);
      else 
        res.json({
          msg: "500",
          description: "not found",
        });
    }
  );
});
router.post("/promonumber", (req, res) => {
  pool.query(
    `select *  from promotional_number where teamnumber = '919999787820'`,
    (err, result) => {
      if (err) throw err;
      else if (result[0]) res.json(result);
      else
        res.json({
          msg: "500",
          description: "not found",
        });
    }
  );
});

/*

router.get('/index',(req,res)=>pool.query(`select * from category`,(err,result)=> err ? console.log(err) :
var a = result
res.send(a)));*/

router.get("/blog2", (req, res) => {
  pool.query(`select * from promotional_number`, (err, result) => {
    err ? console.log(err) : res.json(result);
  });
});

// router.get('/delhi-ncr/all-category',(req,res)=>{
//   pool.query(`select * from category where status!='pending' `,(err,result)=>{
//     err ? console.log(err) : res.render('allcategory',{result:result})
//   })
// })

router.post("/subcategory", (req, res) =>
  pool.query(
    `select s.*,(select c.name from category c where c.id = '${req.body.categoryid}' ) as categoryname from subcategory s where s.categoryid = '${req.body.categoryid}'`,
    (err, result) => (err ? console.log(err) : res.json(result))
  )
);

router.post("/services", (req, res) =>
  pool.query(
    `select s.*,(select sub.name from subcategory sub where sub.id =  "${req.body.subcategoryid}" ) as subcategoryname from services s where  s.subcategoryid = "${req.body.subcategoryid}"`,
    (err, result) => (err ? console.log(err) : res.json(result))
  )
);

router.post("/total_income", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    pool.query(
      `select sum(price) as total_income from booking where service_agent = '${req.body.number}' `,
      (err, result) => {
        if (err) throw err;
        else res.json(result);
      }
    );
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});




router.post("/cart", (req, res) => {
  let body = req.body;
  console.log(req.body);
  pool.query(
    `select categoryid from team where number = '${req.body.usernumber}' and categoryid = "${req.body.categoryid}"`,
    (err, result) => {
      if (err) throw err;
      else if (result[0]) {
        res.json({
          msg:
            "Beacuse you are a team member of this services, you can not book this service",
        });
      } else {
        pool.query(
          `select * from services where id = "${req.body.booking_id}" `,
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
                          "Can not book two different categories services simultaneously. Replace cart ?",
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
      }
    }
  );
});

router.post("/cart/replace", (req, res) => {
  let body = req.body;
  console.log(req.body);
  pool.query(
    `select * from services where id = "${req.body.booking_id}" `,
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
  if (process.env.encryptedkey == req.body.key) {
    pool.query(
      `select usernumber from cart where usernumber = '${req.body.usernumber}'`,
      (err, result) => {
        if (err) throw err;
        else res.json(result);
      }
    );
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/mycart", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    var query = `select c.*,(select s.name from services s where s.id = c.booking_id) as servicename
    ,(select s.logo from services s where s.id = c.booking_id) as serviceslogo
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

router.post("/payment", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    if (req.body.total_price != 1 || req.body.total_price != "1") {
      var random = Math.floor(1000 + Math.random() * 9000);
      var servicesdata = {
        productinfo: req.body.productinfo,
        txnid: req.body.txnid,
        amount: req.body.total_price,
        email: req.body.email,
        phone: req.body.usernumber,
        lastname: "",
        firstname: req.body.name,
        surl: "http://deloservices.com/api/successfull_payement", //\"http://localhost:3000/payu/success"
        furl: "http://deloservices.com/api/failed_payment", //"http://localhost:3000/payu/fail"
      };

      console.log(servicesdata);

      payumoney.makePayment(servicesdata, function (error, response) {
        if (error) {
          throw error;
        } else {
          res.json({
            msg: response,
          });
        }
      });
    } else {
      res.json({
        type: "error",
        description: "404 Not Found",
      });
    }
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/successfull_payement", (req, res) => {
  res.json({
    msg: "successfull",
  });
});

router.post("/failed_payment", (req, res) => {
  res.json({
    msg: "failed",
  });
});

router.get("/success_razorpay", (req, res) => {
  res.json({
    msg: "success",
  });
});

router.post("/success_razorpay", (req, res) => {
  console.log("reaponse from razorpay", req.body);
  if (
    req.body.razorpay_order_id &&
    req.body.razorpay_signature &&
    req.body.razorpay_payment_id
  ) {
    console.log("abc");
    res.json(req.body);
  } else {
    console.log("jhgf");
    res.redirect("https://www.deloservices.com/failed_payment");
  }
});

router.post("/check_booking_staus", (req, res) => {
  let body = req.body;
  console.log(req.body);

  pool.query(
    `select * from booking where id = '${req.body.bookingid}'`,
    (err, result) => {
      if (err) throw err;
      else if (result[0].promocode) {
        res.json({
          msg: "promocode applied",
        });
      } else {
        res.json({
          msg: "no promocode",
        });
      }
    }
  );
});

router.post("/check_addon_staus", (req, res) => {
  let body = req.body;

  pool.query(
    `select * from booking where id = '${req.body.bookingid}'`,
    (err, result) => {
      if (err) throw err;
      else if (result[0].addon_activate) {
        var query = `select * from booking where id = '${req.body.bookingid}';`;

        pool.query(query, (err, result) => {
          if (err) throw err;
          else {
            res.json({
              msg: "addon",

              result: result,
            });
          }
        });
      } else {
        res.json({
          msg: "no addon",
        });
      }
    }
  );
});

router.post("/booking_successfull", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    if (req.body.price != "1" || req.body.price != 1) {
      let somePushTokens = [];

      var bookmsg = req.body.booking_id;
      var ournumber = "919873159745";
      let body = req.body;
      body["service_agent"] = "";
      console.log("booking data recieve", body);

      pool.query(
        `select * from booking where name = "${req.body.name}" and usernumber = '${req.body.usernumber}' and date = "${req.body.date}" and time = "${req.body.time}" and booking_date = "${req.body.booking_date}" and categoryid = "${req.body.categoryid}" and subcategoryid = "${req.body.subcategoryid}"`,
        (err, result) => {
          if (err) throw err;
          else if (result[0]) {
            res.json({
              msg: "perfect",
            });
          } else {
            pool.query(
              `insert into booking (name,email,usernumber,address,locality,area,date,time,booking_date,booking_id,price,payment_mode,pincode,working_otp,quantity,categoryid,subcategoryid,teamprice,membershipprice,promocode,booking_time,orderid,color,actual_price,discount_price,hygiene_charge,visiting_charge)
     values('${req.body.name}','${req.body.email}','${req.body.usernumber}','${req.body.address}','${req.body.locality}','${req.body.area}'
     ,'${req.body.date}','${req.body.time}','${req.body.booking_date}','${req.body.booking_id}','${req.body.price}','${req.body.payment_mode}','${req.body.pincode}','${req.body.working_otp}','${req.body.quantity}','${req.body.categoryid}','${req.body.subcategoryid}','${req.body.teamprice}','','${req.body.promocode}','${req.body.booking_time}','${req.body.orderid}','#507ec0','${req.body.actual_price}','${req.body.discount_price}', '${req.body.hygiene_charge}' , '${req.body.visiting_charge}')`,
              (err, result) => {
                if (err) throw err;
                else {
                  pool.query(
                    `update users set offer = offer-100  where number = '${req.body.usernumber}' and promocode = "${req.body.promocode}"`,
                    (err, result) => {
                      if (err) throw err;
                      else {
                        pool.query(
                          `delete from cart where usernumber = '${req.body.usernumber}'`,
                          (err, result) => {
                            if (err) throw err;
                            else {
                              pool.query(
                                `delete from checkout_details where usernumber = "${req.session.usernumber}"`,
                                (err, result) => {
                                  if (err) throw err;
                                  else {
                                    msg91.sendOne(
                                      authkey,
                                      req.body.usernumber,
                                      `Hello ${body.name}, Thanks for your request. We have recieved your booking for ${body.date},${body.time}. Your working otp ${req.body.working_otp} Share this OTP with our Partner, For any help, click on ${body.helpurl}`,
                                      senderid,
                                      route,
                                      dialcode,
                                      function (response) {
                                        if (err) throw err;
                                        else {
                                          pool.query(
                                            `insert into normal_message (number,date,time,message) values('${req.body.usernumber}','${today}','${todaytime}','Hello ${body.name}, Thanks for your request. We have recieved your booking for ${body.date},${body.time}.Your working otp ${req.body.working_otp} Share this OTP with our Partner, For any help, click on ${body.helpurl}') `,
                                            (err, result) => {
                                              if (err) throw err;
                                              else {
                                                msg91.sendOne(
                                                  authkey,
                                                  ournumber,
                                                  `A new services is booked by ${body.name} on ${body.date} at ${body.time}.`,
                                                  senderid,
                                                  route,
                                                  dialcode,
                                                  function (response) {
                                                    if (err) throw err;
                                                    else {
                                                      pool.query(
                                                        `insert into normal_message (number,date,time,message) values('${ournumber}','${today}','${todaytime}','A new services is booked by ${body.name} on ${body.date} at ${body.time}.') `,
                                                        (err, result) => {
                                                          if (err) throw err;
                                                          else {
                                                            //console.log("Response",response)
                                                            if (
                                                              req.body
                                                                .categoryid ==
                                                              "9"
                                                            ) {
                                                              pool.query(
                                                                `select name,number from team where
     categoryid = '${req.body.categoryid}' and subcategoryid = "${req.body.subcategoryid}"`,
                                                                (
                                                                  err,
                                                                  result
                                                                ) => {
                                                                  if (err)
                                                                    throw err;
                                                                  else if (
                                                                    result[0]
                                                                  ) {
                                                                    console.log(
                                                                      "team member",
                                                                      result
                                                                    );
                                                                    //console.log('req.body.reqbokkingid[0]',bookmsg)
                                                                    for (
                                                                      i = 0;
                                                                      i <
                                                                      result.length;
                                                                      i++
                                                                    ) {
                                                                      msg91.sendOne(
                                                                        authkey,
                                                                        result[
                                                                          i
                                                                        ]
                                                                          .number,
                                                                        ` Hello ${result[i].name}, New Lead is booked  for ${bookmsg},   at ${req.body.date} , ${req.body.time}, To pick this lead, visit Delo Team App Or Download App From https://tinyurl.com/r3hepww`,
                                                                        senderid,
                                                                        route,
                                                                        dialcode,
                                                                        function (
                                                                          response
                                                                        ) {}
                                                                      );

                                                                      pool.query(
                                                                        `insert into normal_message (number,date,time,message) values('${result[i].number}','${today}','${todaytime}','Hello ${result[i].name}, New Lead is booked  for ${bookmsg}  at ${req.body.date} , ${req.body.time}, To pick this lead, visit Delo Team App Or Download App From  https://tinyurl.com/r3hepww') `,
                                                                        (
                                                                          err,
                                                                          result
                                                                        ) => {}
                                                                      );
                                                                    }

                                                                    pool.query(
                                                                      `select * from token where categoryid = '${req.body.categoryid}' and subcategoryid = "${req.body.subcategoryid}"
   
    `,
                                                                      (
                                                                        err,
                                                                        result
                                                                      ) => {
                                                                        if (err)
                                                                          throw err;
                                                                        else if (
                                                                          result[0]
                                                                        ) {
                                                                          for (
                                                                            i = 0;
                                                                            i <
                                                                            result.length;
                                                                            i++
                                                                          ) {
                                                                            //  console.log("Token",result[i].token)
                                                                            somePushTokens.push(
                                                                              result[
                                                                                i
                                                                              ]
                                                                                .token
                                                                            );
                                                                          }

                                                                          // Create a new Expo SDK client
                                                                          //  console.log("Push Data",req.body)
                                                                          let expo = new Expo();

                                                                          // Create the messages that you want to send to clents
                                                                          let messages = [];

                                                                          // console.log("Kuch to adbad hai",somePushTokens)
                                                                          for (let pushToken of somePushTokens) {
                                                                            // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

                                                                            // Check that all your push tokens appear to be valid Expo push tokens
                                                                            if (
                                                                              !Expo.isExpoPushToken(
                                                                                pushToken
                                                                              )
                                                                            ) {
                                                                              console.error(
                                                                                `Push token ${pushToken} is not a valid Expo push token`
                                                                              );
                                                                              continue;
                                                                            }

                                                                            // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
                                                                            messages.push(
                                                                              {
                                                                                to: pushToken,
                                                                                sound:
                                                                                  "default",
                                                                                body:
                                                                                  "Hello, there is one new booking",

                                                                                data: {
                                                                                  withSome:
                                                                                    "data",
                                                                                },
                                                                              }
                                                                            );
                                                                          }

                                                                          // The Expo push notification service accepts batches of notifications so
                                                                          // that you don't need to send 1000 requests to send 1000 notifications. We
                                                                          // recommend you batch your notifications to reduce the number of requests
                                                                          // and to compress them (notifications with similar content will get
                                                                          // compressed).
                                                                          let chunks = expo.chunkPushNotifications(
                                                                            messages
                                                                          );
                                                                          let tickets = [];
                                                                          (async () => {
                                                                            // Send the chunks to the Expo push notification service. There are
                                                                            // different strategies you could use. A simple one is to send one chunk at a
                                                                            // time, which nicely spreads the load out over time:
                                                                            for (let chunk of chunks) {
                                                                              try {
                                                                                let ticketChunk = await expo.sendPushNotificationsAsync(
                                                                                  chunk
                                                                                );
                                                                                console.log(
                                                                                  ticketChunk
                                                                                );
                                                                                tickets.push(
                                                                                  ...ticketChunk
                                                                                );
                                                                                // NOTE: If a ticket contains an error code in ticket.details.error, you
                                                                                // must handle it appropriately. The error codes are listed in the Expo
                                                                                // documentation:
                                                                                // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
                                                                              } catch (error) {
                                                                                console.error(
                                                                                  error
                                                                                );
                                                                              }
                                                                            }
                                                                          })();

                                                                          // Later, after the Expo push notification service has delivered the
                                                                          // notifications to Apple or Google (usually quickly, but allow the the service
                                                                          // up to 30 minutes when under load), a "receipt" for each notification is
                                                                          // created. The receipts will be available for at least a day; stale receipts
                                                                          // are deleted.
                                                                          //
                                                                          // The ID of each receipt is sent back in the response "ticket" for each
                                                                          // notification. In summary, sending a notification produces a ticket, which
                                                                          // contains a receipt ID you later use to get the receipt.
                                                                          //
                                                                          // The receipts may contain error codes to which you must respond. In
                                                                          // particular, Apple or Google may block apps that continue to send
                                                                          // notifications to devices that have blocked notifications or have uninstalled
                                                                          // your app. Expo does not control this policy and sends back the feedback from
                                                                          // Apple and Google so you can handle it appropriately.
                                                                          let receiptIds = [];
                                                                          for (let ticket of tickets) {
                                                                            // NOTE: Not all tickets have IDs; for example, tickets for notifications
                                                                            // that could not be enqueued will have error information and no receipt ID.
                                                                            if (
                                                                              ticket.id
                                                                            ) {
                                                                              receiptIds.push(
                                                                                ticket.id
                                                                              );
                                                                            }
                                                                          }

                                                                          let receiptIdChunks = expo.chunkPushNotificationReceiptIds(
                                                                            receiptIds
                                                                          );
                                                                          (async () => {
                                                                            // Like sending notifications, there are different strategies you could use
                                                                            // to retrieve batches of receipts from the Expo service.
                                                                            for (let chunk of receiptIdChunks) {
                                                                              try {
                                                                                let receipts = await expo.getPushNotificationReceiptsAsync(
                                                                                  chunk
                                                                                );
                                                                                // console.log(receipts);

                                                                                // The receipts specify whether Apple or Google successfully received the
                                                                                // notification and information about an error, if one occurred.
                                                                                for (let receipt of receipts) {
                                                                                  if (
                                                                                    receipt.status ===
                                                                                    "ok"
                                                                                  ) {
                                                                                    continue;
                                                                                  } else if (
                                                                                    receipt.status ===
                                                                                    "error"
                                                                                  ) {
                                                                                    console.error(
                                                                                      `There was an error sending a notification: ${receipt.message}`
                                                                                    );
                                                                                    if (
                                                                                      receipt.details &&
                                                                                      receipt
                                                                                        .details
                                                                                        .error
                                                                                    ) {
                                                                                      // The error codes are listed in the Expo documentation:
                                                                                      // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
                                                                                      // You must handle the errors appropriately.
                                                                                      console.error(
                                                                                        `The error code is ${receipt.details.error}`
                                                                                      );
                                                                                    }
                                                                                  }
                                                                                }
                                                                              } catch (error) {
                                                                                console.error(
                                                                                  error
                                                                                );
                                                                              }
                                                                            }
                                                                          })();
                                                                        }
                                                                      }
                                                                    );

                                                                    res.json({
                                                                      msg:
                                                                        "perfect",
                                                                    });
                                                                  } else {
                                                                    msg91.sendOne(
                                                                      authkey,
                                                                      req.body
                                                                        .usernumber,
                                                                      ` Hello ${body.name}, We are unavailable on this location right now. Our team will contact you as soon as possible. `,
                                                                      senderid,
                                                                      route,
                                                                      dialcode,
                                                                      function (
                                                                        response
                                                                      ) {
                                                                        pool.query(
                                                                          `insert into normal_message (number,date,time,message) values('${req.body.usernumber}','${today}','${todaytime}','Hello ${body.name}, We are unavailable on this location right now. Our team will contact you as soon as possible. ') `,
                                                                          (
                                                                            err,
                                                                            result
                                                                          ) => {}
                                                                        );
                                                                        // console.log(response)
                                                                      }
                                                                    );

                                                                    res.json({
                                                                      msg:
                                                                        "perfect",
                                                                    });
                                                                  }
                                                                }
                                                              );
                                                            } else {
                                                              pool.query(
                                                                `select name,number from team where categoryid = '${req.body.categoryid}'
   
   
   
   
    `,
                                                                (
                                                                  err,
                                                                  result
                                                                ) => {
                                                                  if (err)
                                                                    throw err;
                                                                  else if (
                                                                    result[0]
                                                                  ) {
                                                                    console.log(
                                                                      "team member",
                                                                      result
                                                                    );
                                                                    //  console.log('req.body.reqbokkingid[0]',bookmsg)
                                                                    for (
                                                                      i = 0;
                                                                      i <
                                                                      result.length;
                                                                      i++
                                                                    ) {
                                                                      msg91.sendOne(
                                                                        authkey,
                                                                        result[
                                                                          i
                                                                        ]
                                                                          .number,
                                                                        ` Hello ${result[i].name}, New Lead is booked  for ${bookmsg}  at ${req.body.date} , ${req.body.time}, To pick this lead, visit on https://tinyurl.com/r3hepww`,
                                                                        senderid,
                                                                        route,
                                                                        dialcode,
                                                                        function (
                                                                          response
                                                                        ) {}
                                                                      );
                                                                      pool.query(
                                                                        `insert into normal_message (number,date,time,message) values('${result[i].number}','${today}','${todaytime}','Hello ${result[i].name}, New Lead is booked  for ${bookmsg}  at ${req.body.date} , ${req.body.time}, To pick this lead, visit on https://tinyurl.com/r3hepww ') `,
                                                                        (
                                                                          err,
                                                                          result
                                                                        ) => {}
                                                                      );
                                                                    }
                                                                    pool.query(
                                                                      `select * from token where categoryid = '${req.body.categoryid}'
           
            `,
                                                                      (
                                                                        err,
                                                                        result
                                                                      ) => {
                                                                        if (err)
                                                                          throw err;
                                                                        else if (
                                                                          result[0]
                                                                        ) {
                                                                          for (
                                                                            i = 0;
                                                                            i <
                                                                            result.length;
                                                                            i++
                                                                          ) {
                                                                            //   console.log("Token",result[i].token)
                                                                            somePushTokens.push(
                                                                              result[
                                                                                i
                                                                              ]
                                                                                .token
                                                                            );
                                                                          }

                                                                          // Create a new Expo SDK client
                                                                          console.log(
                                                                            "Push Data",
                                                                            req.body
                                                                          );
                                                                          let expo = new Expo();

                                                                          // Create the messages that you want to send to clents
                                                                          let messages = [];

                                                                          // console.log("Kuch to adbad hai",somePushTokens)
                                                                          for (let pushToken of somePushTokens) {
                                                                            // console.log("Sometokens",somePushTokens)

                                                                            // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

                                                                            // Check that all your push tokens appear to be valid Expo push tokens
                                                                            if (
                                                                              !Expo.isExpoPushToken(
                                                                                pushToken
                                                                              )
                                                                            ) {
                                                                              console.error(
                                                                                `Push token ${pushToken} is not a valid Expo push token`
                                                                              );
                                                                              continue;
                                                                            }

                                                                            // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
                                                                            messages.push(
                                                                              {
                                                                                to: pushToken,
                                                                                sound:
                                                                                  "default",
                                                                                body:
                                                                                  "Hello, there is one new booking",

                                                                                data: {
                                                                                  withSome:
                                                                                    "data",
                                                                                },
                                                                              }
                                                                            );
                                                                          }

                                                                          // The Expo push notification service accepts batches of notifications so
                                                                          // that you don't need to send 1000 requests to send 1000 notifications. We
                                                                          // recommend you batch your notifications to reduce the number of requests
                                                                          // and to compress them (notifications with similar content will get
                                                                          // compressed).
                                                                          let chunks = expo.chunkPushNotifications(
                                                                            messages
                                                                          );
                                                                          let tickets = [];
                                                                          (async () => {
                                                                            // Send the chunks to the Expo push notification service. There are
                                                                            // different strategies you could use. A simple one is to send one chunk at a
                                                                            // time, which nicely spreads the load out over time:
                                                                            for (let chunk of chunks) {
                                                                              try {
                                                                                let ticketChunk = await expo.sendPushNotificationsAsync(
                                                                                  chunk
                                                                                );
                                                                                console.log(
                                                                                  ticketChunk
                                                                                );
                                                                                tickets.push(
                                                                                  ...ticketChunk
                                                                                );
                                                                                // NOTE: If a ticket contains an error code in ticket.details.error, you
                                                                                // must handle it appropriately. The error codes are listed in the Expo
                                                                                // documentation:
                                                                                // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
                                                                              } catch (error) {
                                                                                console.error(
                                                                                  error
                                                                                );
                                                                              }
                                                                            }
                                                                          })();

                                                                          // Later, after the Expo push notification service has delivered the
                                                                          // notifications to Apple or Google (usually quickly, but allow the the service
                                                                          // up to 30 minutes when under load), a "receipt" for each notification is
                                                                          // created. The receipts will be available for at least a day; stale receipts
                                                                          // are deleted.
                                                                          //
                                                                          // The ID of each receipt is sent back in the response "ticket" for each
                                                                          // notification. In summary, sending a notification produces a ticket, which
                                                                          // contains a receipt ID you later use to get the receipt.
                                                                          //
                                                                          // The receipts may contain error codes to which you must respond. In
                                                                          // particular, Apple or Google may block apps that continue to send
                                                                          // notifications to devices that have blocked notifications or have uninstalled
                                                                          // your app. Expo does not control this policy and sends back the feedback from
                                                                          // Apple and Google so you can handle it appropriately.
                                                                          let receiptIds = [];
                                                                          for (let ticket of tickets) {
                                                                            // NOTE: Not all tickets have IDs; for example, tickets for notifications
                                                                            // that could not be enqueued will have error information and no receipt ID.
                                                                            if (
                                                                              ticket.id
                                                                            ) {
                                                                              receiptIds.push(
                                                                                ticket.id
                                                                              );
                                                                            }
                                                                          }

                                                                          let receiptIdChunks = expo.chunkPushNotificationReceiptIds(
                                                                            receiptIds
                                                                          );
                                                                          (async () => {
                                                                            // Like sending notifications, there are different strategies you could use
                                                                            // to retrieve batches of receipts from the Expo service.
                                                                            for (let chunk of receiptIdChunks) {
                                                                              try {
                                                                                let receipts = await expo.getPushNotificationReceiptsAsync(
                                                                                  chunk
                                                                                );
                                                                                console.log(
                                                                                  receipts
                                                                                );

                                                                                // The receipts specify whether Apple or Google successfully received the
                                                                                // notification and information about an error, if one occurred.
                                                                                for (let receipt of receipts) {
                                                                                  if (
                                                                                    receipt.status ===
                                                                                    "ok"
                                                                                  ) {
                                                                                    continue;
                                                                                  } else if (
                                                                                    receipt.status ===
                                                                                    "error"
                                                                                  ) {
                                                                                    console.error(
                                                                                      `There was an error sending a notification: ${receipt.message}`
                                                                                    );
                                                                                    if (
                                                                                      receipt.details &&
                                                                                      receipt
                                                                                        .details
                                                                                        .error
                                                                                    ) {
                                                                                      // The error codes are listed in the Expo documentation:
                                                                                      // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
                                                                                      // You must handle the errors appropriately.
                                                                                      console.error(
                                                                                        `The error code is ${receipt.details.error}`
                                                                                      );
                                                                                    }
                                                                                  }
                                                                                }
                                                                              } catch (error) {
                                                                                console.error(
                                                                                  error
                                                                                );
                                                                              }
                                                                            }
                                                                          })();
                                                                        }
                                                                      }
                                                                    );

                                                                    res.json({
                                                                      msg:
                                                                        "perfect",
                                                                    });
                                                                  } else {
                                                                    console.log(
                                                                      "Koi available nahi hai"
                                                                    );
                                                                    msg91.sendOne(
                                                                      authkey,
                                                                      req.body
                                                                        .usernumber,
                                                                      ` Hello ${body.name}, We are unavailable on this location right now. Our team will contact you as soon as possible. `,
                                                                      senderid,
                                                                      route,
                                                                      dialcode,
                                                                      function (
                                                                        response
                                                                      ) {}
                                                                    );

                                                                    pool.query(
                                                                      `insert into normal_message (number,date,time,message) values('${req.body.usernumber}','${today}','${todaytime}',' Hello ${body.name}, We are unavailable on this location right now. Our team will contact you as soon as possible. ') `,
                                                                      (
                                                                        err,
                                                                        result
                                                                      ) => {}
                                                                    );

                                                                    res.json({
                                                                      msg:
                                                                        "perfect",
                                                                    });
                                                                  }
                                                                }
                                                              );
                                                            }
                                                          }
                                                        }
                                                      );
                                                    }
                                                  }
                                                );
                                              }
                                            }
                                          );
                                        }
                                      }
                                    );
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                }
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
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});




router.post("/checkout_details", (req, res) => {
  let body = req.body;
  // console.log(body)
  pool.query(`insert into checkout_details set ? `, body, (err, result) => {
    err ? console.log(err) : res.json({ msg: "success" });
  });
});

router.post("/booking", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    console.log(req.body);
    var query1 = `select * from booking where usernumber ='${req.body.usernumber}' and status is null order by id desc;`;

    pool.query(query1, (err, result) => {
      if (err) throw err;
      else res.json(result);
    });
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/history", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    pool.query(
      `select b.booking_id , b.id , b.date , b.time from booking b where b.usernumber = '${req.body.usernumber}'  and b.status ='completed' order by id desc `,
      (err, result) => {
        if (err) throw err;
        else res.json(result);
      }
    );
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/singlebooking", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    var query1 = `select b.*,t.name as service_agent_details , t.image as service_agent_image from booking b left join team t on b.service_agent = t.number
    where b.id="${req.body.id}"`;

    pool.query(query1, (err, result) => {
      if (err) throw err;
      else res.json(result);
    });
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/call", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    let body = req.body;
    console.log(body);

    var dataString = `From=${body.from}&To=${body.to}&CallerId=01141183789`;
    console.log("dattastring", dataString);
    var options = {
      url: `https://30cf99154278c0295a01ffa04e00c36548998f82e27b9faa:c930c60b44c91ea22c25f5ee24cc943738ed22eb62e14831@api.exotel.com/v1/Accounts/deloservices1/Calls/connect?From=${body.from}&To=${body.to}`,
      method: "POST",
    };

    var options1 = {
      url: `https://30cf99154278c0295a01ffa04e00c36548998f82e27b9faa:c930c60b44c91ea22c25f5ee24cc943738ed22eb62e14831@api.exotel.com/v1/Accounts/deloservices1/CustomerWhitelist?VirtualNumber=01141183789&Number=${body.to}`,
      method: "POST",
    };

    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        res.json({
          msg: "perfect",
        });
      }
      if (error) console.log("error");
      else if (response.statusCode == 200) console.log("perfect");
      else {
        request(options1, (error, response) => {
          if (!error && response.statusCode == 200) {
            res.json({
              msg: "perfect",
            });
          }
          if (error) console.log("error1");
          else if (response.statusCode == 200) {
            request(options, (error, response) => {
              if (!error && response.statusCode == 200) {
                console.log(body);
              } else {
                res.json({
                  msg: "perfect",
                });
              }
            });
          }
        });
      }
    }

    request(options, callback);
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/pick", (req, res) => {
  let body = req.body;
  let charges1 = (body.price * 12) / 100; // customer gst == team price
  let teamprice = body.price - charges1;
  let gst = (teamprice * 30) / 1000; // our margin
  // let tds = (teamprice-gst)*5/1000; // team member tds
  let tds = 0;
  let charges = 0;
  if (req.body.payment_mode == "cash") {
    let charges = charges1 / 10;
  } else {
    let charges = 0;
  }

  let credit_deduct = gst + tds + charges;

  console.log("Actual Price", body.price);
  console.log("TeamPrice", teamprice);
  console.log("Our margin", gst);
  console.log("TDS", tds);
  console.log("Charges", charges);

  //let tds = 0;
  let a = req.body.price / 50;
  console.log("web", req.body);

  pool.query(
    `select name from team where number = ${req.body.number} `,
    (err, result) => {
      if (err) throw err;
      else {
        console.log("web1");
        pool.query(
          `select recharge_value from team where number = ${req.body.number}`,
          (err, result) => {
            console.log("recharge", result[0].recharge_value);
            if (err) throw err;
            else if (result[0].recharge_value < a) {
              console.log("web3");
              res.json({
                msg: `You Don't Accept this lead beacuse of low balance`,
              });
            } else {
              pool.query(
                `select * from booking where  id = ${body.id} and service_agent != ''`,
                (err, result) => {
                  if (err) throw err;
                  else if (result[0]) {
                    console.log("web4");
                    res.json({ msg: "Picked Already" });
                  } else {
                    console.log("Charges tak phch gya...");
                    if (body.price > req.body.price) {
                      console.log("dnd", req.body.number);
                      var query = `select * from booking where date = CURDATE() and service_agent = ${req.body.number}   `;
                      pool.query(query, (err, result) => {
                        if (err) throw err;
                        else if (result[0]) {
                          var query1 = `update booking set service_agent  = ${req.body.number}, credit_deduct = ${credit_deduct} , color = "#E74C3C" where id=${body.id}`;
                          pool.query(query1, (err, result) => {
                            if (err) throw err;
                            else {
                              pool.query(
                                `update team set recharge_value = recharge_value-${gst}-${tds}-${charges} where number="${req.body.number}"`,
                                (err, result) => {
                                  if (err) throw err;
                                  else {
                                    console.log("Msg sent");

                                    msg91.sendOne(
                                      authkey,
                                      req.body.usernumber,
                                      `${req.body.teamname} (+911141193613) is assigned to your ${body.bookingid}. We have recieved your booking for ${body.date},${body.time}. For any help, click on ${body.helpurl}`,
                                      senderid,
                                      route,
                                      dialcode,
                                      function (response) {
                                        if (err) console.log(err);
                                        else {
                                          pool.query(
                                            `insert into normal_message (number,date,time,message) values('${req.body.usernumber}','${today}','${todaytime}','${req.body.teamname} (+911141193613) is assigned to your ${body.bookingid}. We have recieved your booking for ${body.date},${body.time}. For any help, click on ${body.helpurl} ') `,
                                            (err, result) => {
                                              if (err) throw err;
                                              else {
                                                pool.query(
                                                  `update team set recharge_value = recharge_value-${gst}-${tds}-${charges} where number="${req.body.number}"`,
                                                  (err, result) => {
                                                    if (err) throw err;
                                                    else {
                                                      res.json({
                                                        msg:
                                                          "Picked Successfully",
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
                                  }
                                }
                              );
                            }
                          });
                        } else {
                          var query3 = `update booking set service_agent  = ${req.body.number}, credit_deduct = ${credit_deduct} , color = "#E74C3C" where id=${body.id}`;
                          pool.query(query3, (err, result) => {
                            if (err) throw err;
                            else {
                              pool.query(
                                `update team set recharge_value = recharge_value-${gst}-${tds}-${charges} where number="${req.body.number}"`,
                                (err, result) => {
                                  if (err) throw err;
                                  else {
                                    msg91.sendOne(
                                      authkey,
                                      req.body.usernumber,
                                      `${req.body.teamname} (+911141193613) is assigned to your ${body.bookingid}. We have recieved your booking for ${body.date},${body.time}. For any help, click on ${body.helpurl}`,
                                      senderid,
                                      route,
                                      dialcode,
                                      function (response) {
                                        if (err) console.log(err);
                                        else {
                                          pool.query(
                                            `insert into normal_message (number,date,time,message) values('${req.body.usernumber}','${today}','${todaytime}','${req.body.teamname} (+911141193613) is assigned to your ${body.bookingid}. We have recieved your booking for ${body.date},${body.time}. For any help, click on ${body.helpurl} ') `,
                                            (err, result) => {
                                              if (err) throw err;
                                              else {
                                                res.json({
                                                  msg: "Picked Successfully",
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
                            }
                          });
                        }
                      });
                    } else {
                      console.log("dnd", req.body.number);

                      var query5 = `update booking set service_agent = ${req.body.number} , credit_deduct = ${credit_deduct} , color = "#E74C3C" where id="${body.id}"`;
                      pool.query(query5, (err, result) => {
                        if (err) throw err;
                        else {
                          pool.query(
                            `update team set recharge_value = recharge_value-${gst}-${tds}-${charges} where number="${req.body.number}"`,
                            (err, result) => {
                              if (err) throw err;
                              else {
                                msg91.sendOne(
                                  authkey,
                                  req.body.usernumber,
                                  `${req.body.teamname} (+911141193613) is assigned to your ${body.bookingid}. We have recieved your booking for ${body.date},${body.time}. For any help, click on ${body.helpurl}`,
                                  senderid,
                                  route,
                                  dialcode,
                                  function (response) {
                                    if (err) console.log(err);
                                    else {
                                      pool.query(
                                        `insert into normal_message (number,date,time,message) values('${req.body.usernumber}','${today}','${todaytime}','${req.body.teamname} (+911141193613) is assigned to your ${body.bookingid}. We have recieved your booking for ${body.date},${body.time}. For any help, click on ${body.helpurl} ') `,
                                        (err, result) => {
                                          if (err) throw err;
                                          else
                                            res.json({
                                              msg: "Picked Successfully",
                                            });
                                        }
                                      );
                                    }
                                  }
                                );
                              }
                            }
                          );
                        }
                      });
                    }
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

router.post("/delete", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    let body = req.body;
    console.log(req.body);
    let charges1 = (body.price * 12) / 100; // customer gst == team price
    let teamprice = body.price - charges1;
    let gst = (teamprice * 30) / 1000; // our margin
    let tds = ((teamprice - gst) * 5) / 1000; // team member tds
    let charges = charges1 / 10;

    console.log("Actual Price", body.price);
    console.log("TeamPrice", teamprice);
    console.log("Our margin", gst);
    console.log("TDS", tds);
    console.log("Charges", charges);

    if (
      req.body.service_agent == null ||
      req.body.service_agent == "" ||
      req.body.service_agent == [] ||
      req.body.service_agent == "null"
    ) {
      pool.query(
        `insert into cancel_booking(name,email,usernumber,address,locality,area,booking_id,payment_mode,date,time,booking_date,price,reason,cancel_time,cancel_date,booking_time,credit_recieved) values ('${body.name}','${body.email}','${body.usernumber}','${body.address}','${body.locality}','${body.area}','${body.booking_id}','${body.payment_mode}','${body.date}','${body.time}','${body.booking_date}','${body.price}','${body.reason}','${todaytime}', '${today}' , '${body.booking_time}' ,  '${body.deduct_credit}')`,
        (err, result) => {
          if (err) throw err;
          else {
            pool.query(
              `delete from booking where id = ${body.id}`,
              (err, result) => {
                if (err) throw err;
                else res.json({ msg: "successfully" });
              }
            );
          }
        }
      );
    } else {
      pool.query(
        `insert into cancel_booking(name,email,usernumber,address,booking_id,payment_mode,date,time,booking_date,price,reason,cancel_time,cancel_date,booking_time,credit_recieved) values ('${body.name}','${body.email}','${body.usernumber}','${body.address}','${body.booking_id}','${body.payment_mode}','${body.date}','${body.time}','${body.booking_date}','${body.price}','${body.reason}','${todaytime}', '${today}' , '${body.booking_time}' ,  '${body.deduct_credit}')`,
        (err, result) => {
          if (err) throw err;
          else {
            pool.query(
              `update team set recharge_value = recharge_value+${req.body.deduct_credit} where number="${req.body.service_agent}"`,
              (err, result) => {
                if (err) throw err;
                else {
                  pool.query(
                    `delete from booking where id = ${body.id}`,
                    (err, result) => {
                      if (err) throw err;
                      else res.json({ msg: "successfully" });
                    }
                  );
                }
              }
            );
          }
        }
      );
    }
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/reschedule", (req, res) => {
  console.log(req.body);
  pool.query(
    `update booking set ? where id = ?`,
    [req.body, req.body.id],
    (err, result) => {
      if (err) throw err;
      else {
        pool.query(
          `select categoryid , booking_id from booking where id = '${req.body.id}'`,
          (err, result) => {
            if (err) throw err;
            else {
              let categoryid = result[0].categoryid;
              let bookingid = result[0].booking_id;
              pool.query(
                `select name , number from team where categoryid = '${categoryid}'`,
                (err, result) => {
                  if (err) throw err;
                  else if (result[0]) {
                    // msg91.sendOne(authkey,req.body.usernumber,`Your booking reschedule successfully.`,senderid,route,dialcode,function(response){

                    //   })

                    for (i = 0; i < result.length; i++) {
                      msg91.sendOne(
                        authkey,
                        result[i].number,
                        ` Hello ${result[i].name}, New Lead is booked  for ${bookingid},   at ${req.body.date} , ${req.body.time}, To pick this lead, visit Delo Team App Or Download App From https://tinyurl.com/r3hepww`,
                        senderid,
                        route,
                        dialcode,
                        function (response) {}
                      );
                    }

                    res.json({ msg: "updated" });
                  } else {
                    res.json({ msg: "updated" });
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

router.post("/agent_details", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    var query = `select name ,image from team where number = "${req.body.number}";`;
    var query1 = `select name,rating , review from booking where service_agent = "${req.body.number}" and rating is not null;`;
    var query2 = `select avg(rating) as rating from booking where service_agent = "${req.body.number}";`;
    pool.query(query + query1 + query2, (err, result) => {
      if (err) throw err;
      else res.json(result);
    });
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/matchotp", (req, res) => {
  console.log(req.body);
  pool.query(
    `update booking set ? where id = ?`,
    [req.body, req.body.id],
    (err, result) => {
      if (err) throw err;
      else
        res.json({
          msg: "otp match",
        });
    }
  );
});

router.post("/completed", (req, res) => {
  let body = req.body;
  body["color"] = "#009688";
  console.log(req.body);
  pool.query(
    `update booking set  ? where id = ?`,
    [body, body.id],
    (err, result) => {
      if (err) throw err;
      else {
        pool.query(
          `update booking set cancellation_charge = '0' where usernumber = '${req.body.usernumber}'`,
          (err, result) => {
            if (err) throw err;
            else {
              msg91.sendOne(
                authkey,
                req.body.usernumber,
                `Thank you for using Delo Services.Services we value you as a customer and hope you will consider us as a preferred way of getting around again in future.`,
                senderid,
                route,
                dialcode,
                function (response) {
                  if (err) console.log(err);
                  else {
                    pool.query(
                      `insert into normal_message (number,date,time,message) values('${req.body.usernumber}','${today}','${todaytime}','Thank you for using Delo Services.Services we value you as a customer and hope you will consider us as a preferred way of getting around again in future.') `,
                      (err, result) => {
                        if (err) console.log(err);
                        else res.json({ msg: "completed" });
                      }
                    );
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

router.post("/offers", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    pool.query(
      `select * from users where number = "${req.body.number}"`,
      (err, result) => {
        err ? console.log(err) : res.json(result);
      }
    );
  } else {
    res.json({
      type: "error",
      description: "404 Not Found",
    });
  }
});

router.post("/prmocode_validate", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    console.log(req.body);
    // pool.query(`select id from users where number="${req.body.number}" and promocode = "${req.body.promocode}" and valid_date>= "${req.body.date}"`,(err,result)=>{
    pool.query(
      `select id from users where number="${req.body.number}" and promocode = "${req.body.promocode}"`,
      (err, result) => {
        if (err) throw err;
        else if (result[0]) {
          res.json({ msg: "valid" });
        } else {
          res.json({ msg: "invalid" });
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

router.post("/check_promocode", (req, res) => {
  if (process.env.encryptedkey == req.body.key) {
    console.log(req.body);
    pool.query(
      `select id from booking where usernumber = "${req.body.number}" and categoryid="${req.body.categoryid}" and promocode="${req.body.promocode}" and month(curdate()) = month(date)`,
      (err, result) => {
        if (err) throw err;
        else if (result[0]) {
          res.json({ msg: "already applied" });
        } else {
          res.json({ msg: "applied" });
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

router.post("/subcategory/react", (req, res) => {
  console.log(req.body);
  if (req.body.storagenumber) {
    pool.query(
      `select * from category where seo_name = "${req.body.seo_name}"`,
      (err, result) => {
        if (err) throw err;
        else {
          req.session.getcategoryid = result[0].id;

          var query = `select s.*,(select c.image from category c where c.id = "${req.session.getcategoryid}" ) as categoryimage,
         (select c.name from category c where c.id = "${req.session.getcategoryid}") as categoryname
         from subcategory s where s.categoryid = "${req.session.getcategoryid}";`;
          pool.query(query, (err, result) => {
            if (err) throw err;
            else {
              res.json(result);
            }
          });
        }
      }
    );
  } else {
    pool.query(
      `select * from category where seo_name = "${req.body.seo_name}"`,
      (err, result) => {
        if (err) throw err;
        else {
          req.session.getcategoryid = result[0].id;

          var query = `select s.*,(select c.image from category c where c.id = "${req.session.getcategoryid}" ) as categoryimage,
         (select c.name from category c where c.id = "${req.session.getcategoryid}") as categoryname
         from subcategory s where s.categoryid = "${req.session.getcategoryid}";`;
          pool.query(query, (err, result) => {
            if (err) throw err;
            else {
              res.json(result);
            }
          });
        }
      }
    );
  }
});

router.post("/services/react", (req, res) => {
  console.log(req.body);
  if (req.body.storagenumber) {
    pool.query(
      `select * from subcategory where seo_name = "${req.body.seo_name}"`,
      (err, result) => {
        if (err) throw err;
        else {
          req.session.getsubcategoryid = result[0].id;

          var query = `select s.*,(select sub.name from subcategory sub where sub.id =  "${req.session.getsubcategoryid}" )
         as subcategoryname from services s where  s.subcategoryid = "${req.session.getsubcategoryid}"`;
          pool.query(query, (err, result) => {
            if (err) throw err;
            else {
              res.json(result);
            }
          });
        }
      }
    );
  } else {
    pool.query(
      `select * from subcategory where seo_name = "${req.body.seo_name}"`,
      (err, result) => {
        if (err) throw err;
        else {
          req.session.getsubcategoryid = result[0].id;

          var query = `select s.*,(select sub.name from subcategory sub where sub.id =  "${req.session.getsubcategoryid}" )
              as subcategoryname from services s where  s.subcategoryid = "${req.session.getsubcategoryid}"`;
          pool.query(query, (err, result) => {
            if (err) throw err;
            else {
              res.json(result);
            }
          });
        }
      }
    );
  }
});

////////////////////////////////For Users Ends////////////////////////
/*
export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppNavigator,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);*/

router.post("/recharge_successfull", (req, res) => {
  let body = req.body;

  req.body.orderid;

  let msg = `your Rs. ${req.body.amount} recharge is successfull. Benifits Revieved ${req.body.productinfo} credits and your orderid is ${req.body.txnid}`;

  pool.query(
    `select * from recharge where firstname = "${req.body.firstname}" and amount = "${req.body.amount}" and productinfo = "${req.body.productinfo}" and phone = "${req.body.phone}"  and date = "${req.body.date}"`,
    (err, result) => {
      if (err) throw err;
      else if (result[0]) {
        res.json({
          msg: "update successfully",
        });
      } else {
        pool.query(
          `update team set recharge_value = recharge_value+${req.body.productinfo} where number=${req.body.phone}`,
          (err, result) => {
            if (err) throw err;
            else {
              console.log("Updated");

              console.log("Body", body);

              pool.query(`insert into recharge set ?`, body, (err, result) => {
                if (err) throw err;
                else {
                  console.log("send");

                  msg91.sendOne(
                    authkey,
                    req.body.phone,
                    `your Rs. ${req.body.amount} recharge is successfull. Benifits Revieved ${req.body.productinfo} and your orderid is ${req.body.txnid}`,
                    senderid,
                    route,
                    dialcode,
                    function (response) {
                      if (err) throw err;
                      else {
                        pool.query(
                          `insert into normal_message (number,date,time,message) values('${req.body.phone}','${today}','${todaytime}','your Rs. ${req.body.ammount} recharge is successfull. Benifits Revieved ${req.body.productinfo}') `,
                          (err, result) => {
                            if (err) console.log(err);
                            else {
                              pool.query(
                                `select refferal_code from team where number = ${req.body.phone} and  referral_code is not null`,
                                (err, result) => {
                                  if (err) throw err;
                                  else if (result[0]) {
                                    let unique_code = result[0].refferal_code;

                                    pool.query(
                                      `select * from team where number = '${req.body.phone}' and refferalStatus = 'completed'`,
                                      (err, result) => {
                                        if (err) throw err;
                                        else if (result[0]) {
                                          res.json({
                                            msg: "update successfully",
                                          });
                                        } else {
                                          pool.query(
                                            `update team set refferalStatus = 'completed' where number = ${req.body.phone}`,
                                            (err, result) => {
                                              if (err) throw err;
                                              else {
                                                pool.query(
                                                  `update team set recharge_value = recharge_value+100 where unique_code="${unique_code}"`,
                                                  (err, result) => {
                                                    if (err) throw err;
                                                    else {
                                                      res.json({
                                                        msg:
                                                          "update successfully",
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
                                  } else {
                                    res.json({
                                      msg: "update successfully",
                                    });
                                  }
                                }
                              );
                            }

                            // else res.json(

                            //   {

                            //    msg:'update successfully'

                            //   }

                            //   )
                          }
                        );
                      }
                    }
                  );
                }
              });
            }
          }
        );
      }
    }
  );
});

// router.post('/recharge_successfull',(req,res)=>{
//   let body = req.body;
//  req.body.orderid
//   let msg = `your Rs. ${req.body.amount} recharge is successfull. Benifits Revieved ${req.body.productinfo} credits and your orderid is ${req.body.txnid}`

//   pool.query(`select * from recharge where firstname = "${req.body.firstname}" and amount = "${req.body.amount}" and productinfo = "${req.body.productinfo}" and phone = "${req.body.phone}"  and date = "${req.body.date}"`,(err,result)=>{
//     if(err) throw err;
//     else if(result[0]){
//       res.json({
//         msg:'update successfully'
//       })
//     }
//     else{

//   pool.query(`update team set recharge_value = recharge_value+${req.body.productinfo} where number="${req.body.phone}"`,(err,result)=>{
//     if(err) throw err;
//     else{
//       console.log('Updated')
//       console.log('Body',body)

//       pool.query(`insert into recharge set ?`,body,(err,result)=>{
//         if(err) throw err;
//         else{
//           console.log('send')

//           msg91.sendOne(authkey,req.body.phone,`your Rs. ${req.body.amount} recharge is successfull. Benifits Revieved ${req.body.productinfo} and your orderid is ${req.body.txnid}`,senderid,route,dialcode,function(response){

//             if(err) throw err;

// else{
//   pool.query(`insert into normal_message (number,date,time,message) values('${req.body.phone}','${today}','${todaytime}','your Rs. ${req.body.ammount} recharge is successfull. Benifits Revieved ${req.body.productinfo}') ` , (err,result)=>{
//     if(err) console.log(err)
//     else res.json(
//       {
//         msg:'update successfully'
//       }
//       )
//   })
// }

//           })
//         }
//       })
//     }
//   })
// }
//   })
//   })

router.post("/laundryAppointment", (req, res) => {
  console.log(req.body);
  let body = req.body;
  var working_otp = Math.floor(1000 + Math.random() * 9000);
  body["working_otp"] = working_otp;
  body["color"] = "#507ec0";

  pool.query(`insert into laundry_appointment set ? `, body, (err, result) => {
    if (err) console.log(err);
    else {
      pool.query(`insert into booking set ? `, body, (err, result) => {
        if (err) console.log(err);
        else {
          msg91.sendOne(
            authkey,
            req.body.usernumber,
            ` Hello ${req.body.name}, your appointment for Delo Laundry is sucessfully booked`,
            senderid,
            route,
            dialcode,
            function (response) {}
          );

          pool.query(
            `insert into normal_message (number,date,time,message) values('${req.body.usernumber}','${today}','${todaytime}','Hello ${req.body.name}, your appointment for Delo Laundry is sucessfully booked') `,
            (err, result) => {
              if (err) console.log(err);
              else {
                res.json({
                  msg: "success",
                });
              }
            }
          );
        }
      });
    }
  });
});

router.get("/laundry_pick_today", (req, res) => {
  pool.query(
    `select * from booking where categoryid = "14" and date = CURDATE() and status !='picked successfully'   order by id desc`,
    (err, result) => {
      err ? console.log(err) : res.json(result);
    }
  );
});

router.get("/laundry_pick_tommrow", (req, res) => {
  pool.query(
    `select * from booking where categoryid = "14" and date = CURDATE() + INTERVAL 1 DAY and status !='picked successfully'  order by id desc`,
    (err, result) => {
      err ? console.log(err) : res.json(result);
    }
  );
});

router.get("/laundry_count_today", (req, res) => {
  pool.query(
    `select count(id) as counter from booking where categoryid = "14" and date = CURDATE() and status !='picked successfully' order by id desc `,
    (err, result) => {
      err ? console.log(err) : res.json(result);
    }
  );
});

router.get("/laundry_count_tommorow", (req, res) => {
  pool.query(
    `select count(id) as counter from booking where categoryid = "14" and date =  CURDATE() + INTERVAL 1 DAY and status !='picked successfully' order by id desc `,
    (err, result) => {
      err ? console.log(err) : res.json(result);
    }
  );
});

router.post("/single_laundry_pick_details", (req, res) => {
  pool.query(
    `select * from booking where id = "${req.body.id}"`,
    (err, result) => {
      if (err) throw err;
      else res.json(result);
    }
  );
});



router.post("/laundry_cart", (req, res) => {
  let body = req.body;
  console.log(req.body);
  if (req.body.quantity == "0" || req.body.quantity == 0) {
    pool.query(
      `delete from laundry_cart where booking_id = '${req.body.booking_id}' and  laundryid = "${req.body.laundryid}"`,
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
      `select * from laundry_cart where  booking_id = '${req.body.booking_id}' and  laundryid = "${req.body.laundryid}"`,
      (err, result) => {
        if (err) throw err;
        else if (result[0]) {
          pool.query(
            `update laundry_cart set quantity = ${req.body.quantity}  where booking_id = '${req.body.booking_id}' and laundryid = "${req.body.laundryid}"`,
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
          pool.query(`insert into laundry_cart set ?`, body, (err, result) => {
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
});








// router.post("/cart-handler", (req, res) => {
//   let body = req.body;
//   console.log(req.body);

//   if (req.body.quantity == "0" || req.body.quantity == 0) {
//     pool.query(
//       `delete from cart where booking_id = '${req.body.booking_id}' and  categoryid = "${req.body.categoryid}"`,
//       (err, result) => {
//         if (err) throw err;
//         else {
//           res.json({
//             msg: "updated sucessfully",
//           });
//         }
//       }
//     );
//   } else {
//     pool.query(
//       `select * from cart where  booking_id = '${req.body.booking_id}' and  categoryid = "${req.body.categoryid}"`,
//       (err, result) => {
//         if (err) throw err;
//         else if (result[0]) {


// if(req.body.categoryid == result[0].categoryid){
   
//   pool.query(
//     `update cart set quantity = ${req.body.quantity}  where booking_id = '${req.body.booking_id}' and categoryid = "${req.body.categoryid}"`,
//     (err, result) => {
//       if (err) throw err;
//       else {
//         res.json({
//           msg: "updated sucessfully",
//         });
//       }
//     }
//   )
// } else {


//   pool.query(
//     `select * from product where id = "${req.body.booking_id}" `,
//     (err, result) => {
//       if (err) throw err;
//       else {
//         body["categoryid"] = result[0].categoryid;
//         body["subcategoryid"] = result[0].subcategoryid;
//         body["price"] = result[0].price;
//         body["oneprice"] = result[0].price;
//         body["price"] = req.body.price;
//         pool.query(`insert into cart set ?`, body, (err, result) => {
//           if (err) throw err;
//           else {
//             res.json({
//               msg: "updated sucessfully",
//             });
//           }
//         });
//       }

//     })



// }
//         }
// else {
//   res.json({
//     msg:
//       "Can not book two different categories product simultaneously. Replace cart ?",
//   });
// }

        
//       }
//     );
//   }
// });














router.post("/cart-handler", (req, res) => {
  let body = req.body;
  console.log(req.body);
  if (req.body.quantity == "0" || req.body.quantity == 0) {
    pool.query(
      `delete from cart where booking_id = '${req.body.booking_id}' and  number = '${req.body.number}' `,
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
      `select * from cart where  booking_id = '${req.body.booking_id}' and  categoryid = '${req.body.categoryid}' and number = '${req.body.number}'`,
      (err, result) => {
        if (err) throw err;
        else if (result[0]) {
          pool.query(
            `update cart set quantity = ${req.body.quantity}  where booking_id = '${req.body.booking_id}' and categoryid = '${req.body.categoryid}' and number = '${req.body.number}'`,
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

          pool.query(`select * from cart where number = '${req.body.number}'`,(err,result)=>{
            if(err) throw err;
            else if(result[0]){
    res.json({
    msg:
      "Can not book two different categories product simultaneously. Replace cart ?",
  });
            }
            else {

  pool.query(
    `select * from product where id = '${req.body.booking_id}' `,
    (err, result) => {
      if (err) throw err;
      else {
        body["categoryid"] = result[0].categoryid;
        body["subcategoryid"] = result[0].subcategoryid;
        body["price"] = result[0].price;
        body["oneprice"] = result[0].price;
        body["price"] = req.body.price;
        pool.query(`insert into cart set ?`, body, (err, result) => {
          if (err) throw err;
          else {
            res.json({
              msg: "updated sucessfully",
            });
          }
        });
      }

    })

            }
          })
  
        }
      }
    );
  }
});











// usernumber , booking_id , categoryid

router.get("/get_laundry_items", (req, res) =>
  pool.query(`select * from LaundryItems`, (err, result) =>
    err ? console.log(err) : res.json(result)
  )
);

router.post("/get_laundry_cart", (req, res) => {
  pool.query(
    `select l.*,(select i.name from LaundryItems i where i.id = l.laundryid)as itemname from laundry_cart l where l.booking_id = '${req.body.booking_id}' `,
    (err, result) => {
      if (err) throw err;
      else {
        res.json(result);
      }
    }
  );
});

router.post("/laundry_picked_successfully", (req, res) => {
  let body = req.body;
  pool.query(
    `update booking set ? where id = ?`,
    [req.body, req.body.booking_id],
    (err, result) => {
      if (err) throw err;
      else {
        pool.query(
          `delete from laundry_cart where booking_id = ${req.body.booking_id}`,
          (err, result) => {
            if (err) throw err;

            msg91.sendOne(
              authkey,
              req.body.usernumber,
              `Our Delivery Boy is Successfully Pick your items. Your items such as ${req.body.inserteditem} and quantity ${req.body.insertedquantity} respectevely.`,
              senderid,
              route,
              dialcode,
              function (response) {}
            );
            pool.query(
              `insert into normal_message (number,date,time,message) values('${req.body.usernumber}','${today}','${todaytime}','Hello ${req.body.name}, your appointment for Delo Laundry is sucessfully booked') `,
              (err, result) => {
                if (err) console.log(err);
                else {
                  res.json({
                    msg: "success",
                  });
                }
              }
            );
          }
        );
      }
    }
  );
});

router.post("/Delo_Laundry_Pick_Login", (req, res) => {
  pool.query(
    `select * from Delo_Laundry_Pick where unique_id = "${req.body.uniqueid}"`,
    (err, result) => {
      if (err) throw err;
      else if (result[0]) {
        res.json(result);
      } else {
        res.json({ msg: "invalid" });
      }
    }
  );
});

router.post("/Delo_Laundry_Drop_Login", (req, res) => {
  pool.query(
    `select * from Delo_Laundry_Drop where uniqueid = "${req.body.uniqueid}"`,
    (err, result) => {
      if (err) throw err;
      else if (result[0]) {
        res.json(result);
      } else {
        res.json({ msg: "invalid" });
      }
    }
  );
});

router.get("/Laundry_Drop_Data", (req, res) => {
  pool.query(
    `select * from booking  where dropdate = CURDATE() and categoryid = "14" and status = "picked successfully" `,
    (err, result) => {
      if (err) throw err;
      else res.json(result);
    }
  );
});

router.post("/find_rating", (req, res) => {
  pool.query(
    `select b.*,(select t.name from team t where t.number = b.service_agent) as teamname , (select t.image from team t where t.number = b.service_agent) as teamimage from booking b where b.usernumber = '${req.body.usernumber}' and b.rating ='get_rating' and b.review = 'get_review' order by id desc limit 1`,
    (err, result) => {
      if (err) throw err;
      else res.json(result);
    }
  );
});

router.post("/update_customer_rating", (req, res) => {
  let body = req.body;
  pool.query(
    `update booking set ? where id = ?`,
    [req.body, req.body.id],
    (err, result) => {
      if (err) throw err;
      else res.json(result);
    }
  );
});

router.post("/team_leave", (req, res) => {
  let body = req.body;
  pool.query(
    `update team set ? where number = ?`,
    [req.body, req.body.number],
    (err, result) => {
      if (err) throw err;
      else res.json(result);
    }
  );
});

router.post("/user_invoice", (req, res) => {
  pool.query(
    `select * from booking where id = '${req.body.id}'`,
    (err, result) => {
      if (err) throw err;
      else res.json(result);
    }
  );
});

//Show Cancel Job API
router.post("/cancel_job", (req, res) =>
  pool.query(
    `select * from cancel_booking where service_agent = "${req.body.number}" order by id desc`,
    (err, result) => (err ? console.log(err) : res.json(result))
  )
);

router.post("/razorpay", (req, res) => {
  const url = `https://rzp_live_2KlcXieUGyQ8k6:9CukFlVqEBgQ1l7LB03DXBPk@api.razorpay.com/v1/orders/`;
  const data = {
    amount: req.body.price * 100, // amount in the smallest currency unit
    //amount:100,
    currency: "INR",
    payment_capture: true,
  };
  const options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(url, options)
    .then((res) => res.json())
    .then((resu) => res.json(resu));
});

router.post("/processing-information", (req, res) => {
  console.log(req.body.number);
  pool.query(
    `select t.*,(select c.name from category c where c.id = t.categoryid) as categoryname from team1 t where t.number = "${req.body.number}"`,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("jhgjh", result);
        res.json(result);
      }
    }
  );
});

router.post("/rechagre_history", (req, res) => {
  pool.query(
    `select * from recharge where phone = '${req.body.number}'`,
    (err, result) => {
      err ? console.log(err) : res.json(result);
    }
  );
});

router.post("/search", (req, res) => {
  let body = req.body;
  console.log("data search krna h", body);

  pool.query(
    `select * from dial_category where name = "${req.body.search}"`,
    (err, result) => {
      if (err) throw err;
      else if (result[0]) {
        let categoryid = result[0].id;

        pool.query(
          `select * from listing where categoryid = "${categoryid}"`,
          (err, result) => {
            if (err) throw err;
            else if (result[0]) {
              res.json({ msg: "listing", result: result });
            }

            // Data Not Available in Delo Listing
            else {
              res.json({ msg: "data not found" });
            }
          }
        );
      }
      // Data Available in Delo Mart
      else {
        pool.query(
          `select * from delomart_subservices where name = "${req.body.search}"`,
          (err, result) => {
            if (err) throw err;
            else if (result[0]) {
              let subservicesid = result[0].id;
              pool.query(
                `select * from delomart_product where subservicesid = "${subservicesid}" `,
                (err, result) => {
                  if (err) throw err;
                  else if (result[0]) {
                    res.json({ msg: "mart", result: result });
                  }

                  //Data Not Available in Delo Mart
                  else {
                    res.json({ msg: "data not found" });
                  }
                }
              );
            }
            // Data Avaialble In Delo Services
            else {
              pool.query(
                `select id from subcategory where name = "${req.body.search}"`,
                (err, result) => {
                  if (err) throw err;
                  else if (result[0]) {
                    let subcategoryid = result[0].id;
                    res.json({ msg: "search", result: result });
                  }
                  // Data Available Only in Lsiting
                  else {
                    var query = `select * from listing where name like "${req.body.search}%";`;
                    //  var query1 = `select * from delomart_product where name like "${req.body.search}%"`
                    pool.query(query, (err, result) => {
                      if (err) throw err;
                      else if (result[0]) {
                        res.json({ msg: "listing", result: result });
                      }
                      // Finally Data Not Found
                      else {
                        var query1 = `select * from delomart_product where name like "${req.body.search}%";`;
                        pool.query(query1, (err, result) => {
                          if (err) throw err;
                          else if (result[0]) {
                            res.json({ msg: "mart", result: result });
                          } else {
                            res.json({ msg: "data not found" });
                          }
                        });
                      }
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

router.post("/updateimage", upload.single("image"), (req, res) => {
  let body = req.body;
  body["image"] = req.file.filename;
  body["number"] = req.body.number;
  console.log(body);

  pool.query(
    `update team set ? where number = ?`,
    [req.body, req.body.number],
    (err, result) => {
      if (err) throw err;
      else res.json(result);
    }
  );
});

router.post("/promotionnumber", (req, res) => {
  let body = req.body;
  // console.log("SEnding Data Name",req.body.name)
  // console.log("SEnding Data Number",req.body.teamnumber)

  for (i = 0; i < req.body.number.length; i++) {
    console.log("inserted name", req.body.number[i]);
    pool.query(
      `insert into promotional_number(name,number,teamnumber) values('${req.body.name[i]}','${req.body.number[i]}','${req.body.teamnumber}')`,
      (err, result) => {}
    );
  }

  res.send("success");
});

router.get("/file_rtr", (req, res) => {
  res.render(`file_rtr_document`);
});

router.post("/file_rtr_details", (req, res) => {
  pool.query(
    `select * from file_rtr where number = "${req.body.number}" and status is null `,
    (err, result) => {
      if (err) throw err;
      else res.json(result);
      //  else res.render(`file-rtr-details`,{result:result})
    }
  );
});

router.get("/forios", (req, res) => {
  res.json({
    msg: "b",
  });
  //  res.json({
  //   msg : 'a'
  // })
});

router.get("/shoes_category", (req, res) => {
  pool.query(`select * from shoes_category`, (err, result) => {
    err ? console.log(err) : res.json(result);
  });
});

router.get("/shoes_brand", (req, res) => {
  pool.query(`select * from shoes_brand`, (err, result) => {
    err ? console.log(err) : res.json(result);
  });
});

router.get("/shoes_product", (req, res) => {
  pool.query(
    `select * from shoes_product where categoryid = "${req.query.id}"`,
    (err, result) => {
      err ? console.log(err) : res.json(result);
    }
  );
});

router.get("/shoes_product_by_brand", (req, res) => {
  pool.query(
    `select * from shoes_product where brandid = "${req.query.id}"`,
    (err, result) => {
      err ? console.log(err) : res.json(result);
    }
  );
});

router.get("/single_shoes", (req, res) => {
  pool.query(
    `select * from shoes_product where id = "${req.query.id}"`,
    (err, result) => {
      err ? console.log(err) : res.json(result);
    }
  );
});

router.get("/promotional_number", (req, res) => {
  pool.query(
    `SELECT distinct number , name from promotional_number`,
    (err, result) => {
      err ? console.log(err) : res.json(result);
    }
  );
});

router.get("/formula", (req, res) => {
  res.render("formula");
  // let per = (100-40)/10
  // let ans = 4500/per
  // console.log("ans",ans)
  // res.send(ans)
});

router.post("/userdetails/update", (req, res) => {
  let body = req.body;
  pool.query(
    `update users set ? where number = ?`,
    [req.body, req.body.number],
    (err, result) => {
      if (err) throw err;
      else res.json(result);
    }
  );
});

router.get("/work_history", (req, res) => {
  pool.query(
    `select b.*,c.name as categoryname from booking b left join category c on b.categoryid = c.id where b.service_agent = "${req.query.number}" `,
    (err, result) => {
      console.log("result", result);
      if (err) throw err;
      else if (result[0]) {
        res.json(result);
      } else res.json({ msg: "data not found" });
    }
  );
});

router.post("/dial-leads", (req, res) => {
  pool.query(
    `select * from dial_user where categoryid = "${req.body.categoryid}" and counter < 20`,
    (err, result) => {
      err ? console.log(err) : res.json(result);
    }
  );
});

router.post("/picking-leads", (req, res) => {
  pool.query(
    `select recharge_value from listing where number = "${req.body.partner_number}" and recharge_value > 20`,
    (err, result) => {
      if (err) throw err;
      else if (result[0]) {
        pool.query(
          `update listing set recharge_value = recharge_value-20 where number = "${req.body.partner_number}"`,
          (err, result) => {
            if (err) throw err;
            else {
              pool.query(
                `insert into pick_leads set ?`,
                req.body,
                (err, result) => {
                  if (err) throw err;
                  else {
                    pool.query(
                      `update dial_user set counter = counter+1 where id = "${req.body.leadid}"`,
                      (err, result) => {
                        if (err) throw err;
                        else res.json({ status: "picked success" });
                      }
                    );
                  }
                }
              );
            }
          }
        );
      } else res.json({ status: "balance low" });
    }
  );
});

router.post("/history-picking-leads", (req, res) => {
  pool.query(
    `select * from pick_leads where partner_number = "${req.body.partner_number}"`,
    (err, result) => {
      if (err) throw err;
      else res.json(result);
    }
  );
});

router.post("/recharge_successfull_listing", (req, res) => {
  let body = req.body;
  let msg = `your Rs. ${req.body.amount} recharge is successfull. Benifits Revieved ${req.body.productinfo} credits and your orderid is ${req.body.txnid}`;

  pool.query(
    `select * from listing_recharge where firstname = "${req.body.firstname}" and amount = "${req.body.amount}" and productinfo = "${req.body.productinfo}" and phone = "${req.body.phone}"  and date = "${req.body.date}"`,
    (err, result) => {
      if (err) throw err;
      else if (result[0]) {
        res.json({
          msg: "update successfully",
        });
      } else {
        pool.query(
          `update listing set recharge_value = recharge_value+${req.body.productinfo} where number="${req.body.phone}"`,
          (err, result) => {
            if (err) throw err;
            else {
              console.log("Updated");
              console.log("Body", body);

              pool.query(
                `insert into listing_recharge set ?`,
                body,
                (err, result) => {
                  if (err) throw err;
                  else {
                    console.log("send");

                    msg91.sendOne(
                      authkey,
                      req.body.phone,
                      `your Rs. ${req.body.amount} recharge is successfull. Benifits Revieved ${req.body.productinfo} and your orderid is ${req.body.txnid}`,
                      senderid,
                      route,
                      dialcode,
                      function (response) {
                        if (err) throw err;
                        else {
                          pool.query(
                            `insert into normal_message (number,date,time,message) values('${req.body.phone}','${today}','${todaytime}','your Rs. ${req.body.ammount} recharge is successfull. Benifits Revieved ${req.body.productinfo}') `,
                            (err, result) => {
                              if (err) console.log(err);
                              else
                                res.json({
                                  msg: "update successfully",
                                });
                            }
                          );
                        }
                      }
                    );
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

router.post("/listing_rechagre_history", (req, res) => {
  pool.query(
    `select * from listing_recharge where phone = '${req.body.partner_number}'`,
    (err, result) => {
      err ? console.log(err) : res.json(result);
    }
  );
});

// add on payment starts

router.post("/add-on-payment", (req, res) => {
  const url = `https://rzp_live_2KlcXieUGyQ8k6:9CukFlVqEBgQ1l7LB03DXBPk@api.razorpay.com/v1/orders/`;
  const data = {
    amount: req.body.price * 100, // amount in the smallest currency unit
    //amount:100,
    currency: "INR",
    payment_capture: true,
  };
  const options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(url, options)
    .then((res) => res.json())
    .then((resu) => res.json(resu));
});

router.post("/add-on-success", (req, res) => {
  console.log(req.body);
  pool.query(
    `update booking set ? where id = ?`,
    [req.body, req.body.id],
    (err, result) => {
      if (err) throw err;
      else
        res.json({
          msg: "success",
        });
    }
  );
});

// add on payment ends

router.post("/addon_pay_with_cash", (req, res) => {
  let body = req.body;
  pool.query(
    `update addon_cart set status = '${req.body.status}' where booking_id =  '${req.body.bookingid}'`,
    (err, result) => {
      if (err) throw err;
      else {
        pool.query(
          `update team set recharge_value = recharge_value-${req.body.addon_credit_deduct} where number = '${req.body.number}'`,
          (err, result) => {
            if (err) throw err;
            else {
              pool.query(
                `update booking set addon_payment_mode  = '${req.body.status}' , addon_credit_deduct ='${req.body.addon_credit_deduct}' , addon_orderid = '${req.body.addon_orderid}' where id = '${req.body.bookingid}'`,
                (err, result) => {
                  if (err) throw err;
                  else
                    res.json({
                      msg: "success",
                    });
                }
              );
            }
          }
        );
      }
    }
  );
});

router.post("/addon_check_payment_status", (req, res) => {
  let body = req.body;
  pool.query(
    `select status from addon_cart where booking_id = '${req.body.booking_id}' and status is not null order by id desc limit 1`,
    (err, result) => {
      if (err) throw err;
      else if (result[0]) {
        res.json({
          msg: "done",
        });
      } else {
        res.json({
          msg: "not_done",
        });
      }
    }
  );
});

router.get("/work", (req, res) => {
  pool.query(`select phone , amount from recharge `, (err, result) => {
    if (err) throw err;
    else {
      console.log("ru");
      for (i = 0; i < 12; i++) {
        pool.query(
          `update team set recharge_value = '${result[i].amount}' where number = '${result[i].phone}'`,
          (err, result) => {
            if (err) throw err;
          }
        );
      }
      console.log("done");
    }
  });
});

router.post("/check_offer", (req, res) => {
  pool.query(
    `select * from offer where offer_code = '${req.body.offer_code}'`,
    (err, result) => {
      if (err) throw err;
      else if (result[0]) {
        if (result[0].validity < today) {
          pool.query(
            `select id from booking where usernumber = '${req.body.number}' and promocode='${req.body.offer_code}' and month(curdate()) = month(date)`,
            (err, result) => {
              if (err) throw err;
              else if (result[0]) {
                res.json({
                  msg: "already applied",
                });
              } else {
                pool.query(
                  `select * from offer where offer_code = '${req.body.offer_code}'`,
                  (err, result) => {
                    if (err) throw err;
                    else {
                      res.json({
                        msg: "applied",
                        result: result,
                      });
                    }
                  }
                );
              }
            }
          );
        } else {
          res.json({
            msg: "offer expired",
          });
        }
      } else {
        res.json({
          msg: "invalid code",
        });
      }
    }
  );
});

router.post("/addon_cart/show/invoice", (req, res) => {
  var query = `select a.*,(select r.name from rate_card r where r.id = a.serviceid) as servicename from addon_cart a where a.booking_id = ${req.body.bookingid};`;
  var query1 = `select count(id) as counter from addon_cart where booking_id = '${req.body.bookingid}';`;
  var query2 = `select sum(price) as total_ammount from addon_cart  where booking_id = '${req.body.bookingid}'; `;
  var query3 = `select service_charge from addon_cart where booking_id = '${req.body.bookingid}' order by service_charge desc limit 1;`;
  var query4 = `select payment_mode,price,service_agent from booking where id = '${req.body.bookingid}';`;
  var query5 = `select * from booking where id = '${req.body.bookingid}';`;
  pool.query(
    query + query1 + query2 + query3 + query4 + query5,
    (err, result) => {
      if (err) throw err;
      else if (result[0]) {
        res.json(result);
      } else {
        res.json({
          msg: "no data",
        });
      }
    }
  );
});

router.post("/delete1", (req, res) => {
  let body = req.body;
  console.log("body ka data", req.body);
  let charges1 = (body.price * 12) / 100; // customer gst == team price
  let teamprice = body.price - charges1;
  let gst = (teamprice * 30) / 1000; // our margin
  let tds = ((teamprice - gst) * 5) / 1000; // team member tds
  let charges = charges1 / 10;

  console.log("Actual Price", body.price);
  console.log("TeamPrice", teamprice);
  console.log("Our margin", gst);
  console.log("TDS", tds);
  console.log("Charges", charges);

  if (
    req.body.service_agent == null ||
    req.body.service_agent == "" ||
    req.body.service_agent == [] ||
    req.body.service_agent == "null"
  ) {
    pool.query(
      `insert into cancel_booking(name,email,usernumber,address,locality,area,booking_id,payment_mode,date,time,booking_date,price,reason,cancel_time,cancel_date,booking_time,credit_recieved) values ('${body.name}','${body.email}','${body.usernumber}','${body.address}','${body.locality}','${body.area}','${body.booking_id}','${body.payment_mode}','${body.date}','${body.time}','${body.booking_date}','${body.price}','${body.reason}','${todaytime}', '${today}' , '${body.booking_time}' ,  '${body.deduct_credit}')`,
      (err, result) => {
        if (err) throw err;
        else {
          pool.query(
            `delete from booking where id = ${body.id}`,
            (err, result) => {
              if (err) throw err;
              else res.send("success");
            }
          );
        }
      }
    );
  } else {
    pool.query(
      `insert into cancel_booking(name,email,usernumber,address,booking_id,payment_mode,date,time,booking_date,price,reason,cancel_time,cancel_date,booking_time,credit_recieved) values ('${body.name}','${body.email}','${body.usernumber}','${body.address}','${body.booking_id}','${body.payment_mode}','${body.date}','${body.time}','${body.booking_date}','${body.price}','${body.reason}','${todaytime}', '${today}' , '${body.booking_time}' ,  '${body.deduct_credit}')`,
      (err, result) => {
        if (err) throw err;
        else {
          pool.query(
            `update team set recharge_value = recharge_value+${req.body.deduct_credit} where number="${req.body.service_agent}"`,
            (err, result) => {
              if (err) throw err;
              else {
                pool.query(
                  `delete from booking where id = ${body.id}`,
                  (err, result) => {
                    if (err) throw err;
                    else res.send("success");
                  }
                );
              }
            }
          );
        }
      }
    );
  }
});

router.post("/get-booking-specification", (req, res) => {
  pool.query(
    `select booking_id from booking where id = '${req.body.id}'`,
    (err, result) => {
      if (err) throw err;
      else {
        let count = result[0].booking_id.split(",").length;
        var array = result[0].booking_id.split(",");
        res.json({
          count: count,
          result: array,
        });
        // console.log(result[0].booking_id)
        //  console.log("Count : ",result[0].booking_id.split(",").length);
        // var array = result[0].booking_id.split(',');
        // console.log('array',array[0])
      }
    }
  );
});

router.post("/get-booking-specification-now", (req, res) => {
  pool.query(
    `select * from services where name = '${req.body.name}'`,
    (err, result) => {
      if (err) throw err;
      else res.json(result);
    }
  );
});

router.post("/reschedule_our_end", (req, res) => {
  console.log(req.body);
  pool.query(
    `update booking set ? where id = ?`,
    [req.body, req.body.id],
    (err, result) => {
      if (err) throw err;
      else {
        pool.query(
          `select categoryid , booking_id from booking where id = '${req.body.id}'`,
          (err, result) => {
            if (err) throw err;
            else {
              let categoryid = result[0].categoryid;
              let bookingid = result[0].booking_id;
              pool.query(
                `select name , number from team where categoryid = '${categoryid}'`,
                (err, result) => {
                  if (err) throw err;
                  else if (result[0]) {
                    for (i = 0; i < result.length; i++) {
                      msg91.sendOne(
                        authkey,
                        result[i].number,
                        ` Hello ${result[i].name}, New Lead is booked  for ${bookingid},   at ${req.body.date} , ${req.body.time}, To pick this lead, visit Delo Team App Or Download App From https://tinyurl.com/r3hepww`,
                        senderid,
                        route,
                        dialcode,
                        function (response) {}
                      );
                    }

                    res.json({ msg: "updated" });
                  } else {
                    res.json({ msg: "updated" });
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

router.post("/win", (req, res) => {
  let body = req.body;
  body["name"] = req.session.contestname;
  body["email"] = req.session.contestemail;
  body["number"] = req.session.contestnumber;
  if (req.body.promoCode == "DELO100") {
    var msg =
      "WoW.. You Won 100 Rs. Off On Delo Services Install App and Select Service And Use code DELO100";
  } else if (req.body.promoCode == "DELO50") {
    var msg =
      "WoW.. You Won 50% Off On Delo Services Install App and Select Service And Use code DELO50";
  } else {
    var msg =
      "Congratulations!!! You have Successfully Registered for Luckey Draw. The Result will be Announced on Dec,25 2021 on 12pm ";
  }
  pool.query(`insert into user_win set ?`, body, (err, result) => {
    if (err) throw err;
    else
      res.json({
        msg: msg,
      });
  });
});

// New concept API



router.post("/insert-portfolio", upload.single("image"), (req, res) => {
  let body = req.body;
  console.log('data recieve ', req.body)
  body["image"] = req.file.filename;
  console.log('data recieve after image ', req.body)
  pool.query(`insert into portfolio set ?`, body, (err, result) => {
    if (err) throw err;
    else
      res.json({
        msg: "success",
      });
  });
});

router.post("/subscription_successfull", (req, res) => {
  let body = req.body;

  if (req.body.amount == "199") {
    body["PlanType"] = "2 Seater";
  } else if (req.body.amount == "299") {
    body["PlanType"] = "3 Seater";
  } else {
    body["PlanType"] = "5 Seater";
  }
  console.log('req.body after plan',req.body)
  pool.query(
    `insert into appointment_subscription set ?`,
    body,
    (err, result) => {
      if (err) throw err;
      else {
        res.json({
          msg: "success",
        });
      }
    }
  );
});

router.post("/listing-login", (req, res) => {
  pool.query(
    `select number from listing where number = "${req.body.number}"`,
    (err, result) => {
      if (err) throw err;
      else if (result[0]) {
        var otp = Math.floor(1000 + Math.random() * 9000);

        sendOtp.send(req.body.number, "DELOTM", otp, (err, result) => {
          if (err) res.json(error);
          else res.json({ status: "success", otp: otp });
        });
      } else res.json({ status: "not_registered" });
    }
  );
});

router.post("/listing-check", (req, res) => {
  pool.query(
    `select * from listing where number = "${req.body.number}" and status = 'completed'`,
    (err, result) => {
      if (err) throw err;
      else if (result[0]) {
        res.json(result);
      } else res.json({ status: "processing" });
    }
  );
});

router.post("/contest-store", (req, res) => {
  let body = req.body;
  req.session.contestname = req.body.name;
  req.session.contestemail = req.body.email;
  req.session.contestnumber = req.body.number;
  res.json({
    msg: "done",
  });
});

router.get("/appointment_business_details", (req, res) => {
  pool.query(
    `select * from listing where number = ${req.query.number}`,
    (err, result) => {
      if (err) throw err;
      else res.render("appointment_dashboard", { result: result });
    }
  );
});

router.post("/update_appointment_business_details", (req, res) => {
  console.log(req.body);
  pool.query(
    `update listing set ? where id = ?`,
    [req.body, req.body.id],
    (err, result) => {
      if (err) throw err;
      else
        res.json({
          msg: "success",
        });
    }
  );
});

router.get("/show-all-listing", (req, res) => {
  pool.query(`select * from listing where categoryid ='61'`, (err, result) => {
    if (err) throw err;
    else {
      res.json({
        result: result,
      });
    }
  });
});



router.post("/book-appointment", (req, res) => {
  let body = req.body
  pool.query(`insert into appointment set ?`, body, (err, result) => {
    if (err) throw err;
    else {
      msg91.sendOne(authkey,req.body.number,`Hello ${body.name} , your appointment are booked successfuly on ${body.date} at ${body.time}.`,senderid,route,dialcode,function(err,response){
        res.json({
          msg : 'success'
        })
      })
    }
  });
});

router.get("/filter-by-locality", (req, res) => {
  pool.query(`select * from locality where cityid = '1'`, (err, result) => {
    if (err) throw err;
    else {
      res.json({
        result: result,
      });
    }
  });
});

//partner API

router.post("/appointment-request", (req, res) => {
  pool.query(
    `select a.* , (select s.name from appointment_service s where s.id = a.booking_id) as bookingname from appointment a where a.partner_number = '${req.body.number}' and a.status = 'pending'`,
    (err, result) => {
      if (err) throw err;
      else {
        res.json({
           result
        });
      }
    }
  );
});

router.post("/accept-appointment", (req, res) => {
  pool.query(
    `update appointment set status = 'accepted' where id = '${req.body.id}'`,
    (err, result) => {
      if (err) throw err;
      else {
        res.json({
          status: 'success'
        });
      }
    }
  );
});

router.post("/reject-appointment", (req, res) => {
  pool.query(
    `update appointment set status = 'rejected' where id = '${req.body.id}'`,
    (err, result) => {
      if (err) throw err;
      else {
        res.json({
          status: 'success'
        });
    }
  }
  );
});

router.post("/partner-appointments", (req, res) => {
  pool.query(
    `select a.*,(select s.name from appointment_service s where s.id = a.booking_id) as bookingname from appointment a where a.partner_number = '${req.body.number}' and a.status = 'accepted' and a.date>= CURDATE()`,
    (err, result) => {
      if (err) throw err;
      else {
        res.json({
          result: result,
        });
      }
    }
  );
});


router.post("/partner-rejected-appointments", (req, res) => {
  pool.query(
    `select a.*,(select s.name from appointment_service s where s.id = a.booking_id) as bookingname from appointment a where a.partner_number = '${req.body.number}' and a.status = 'rejected'`,
    (err, result) => {
      if (err) throw err;
      else {
        res.json({
          result: result,
        });
      }
    }
  );
});

router.get("/update_banner_image", (req, res) => {
  pool.query(
    `select * from listing where number = "${req.query.number}"`,
    (err, result) => {
      if (err) throw err;
      else res.render("appointment_banner_image", { result: result });
    }
  );
});

router.post(
  "/update_banner_image",
  upload.single("banner_image"),
  (req, res) => {
    let body = req.body;

    body["banner_image"] = req.file.filename;

    pool.query(
      `update listing  set ? where id = ?`,
      [req.body, req.body.id],
      (err, result) => {
        if (err) throw err;
        else
          res.json({
            msg: "success",
          });
      }
    );
  }
);

router.get("/update_image", (req, res) => {
  pool.query(
    `select * from listing where number = "${req.query.number}"`,
    (err, result) => {
      if (err) throw err;
      else res.render("appointment_update_image", { result: result });
    }
  );
});

router.post(
  "/update_image",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  (req, res) => {
    let body = req.body;

    body["image1"] = req.files["image1"][0].filename;

    body["image2"] = req.files["image2"][0].filename;

    body["image3"] = req.files["image3"][0].filename;

    pool.query(
      `update listing  set ? where id = ?`,
      [req.body, req.body.id],
      (err, result) => {
        if (err) throw err;
        else {
          res.json({
            msg: "success",
          });
        }
      }
    );
  }
);

router.post("/myAppointmentService", (req, res) => {
  pool.query(
    `select * from appointment_service where number = '${req.body.number}'`,
    (err, result) => {
      if (err) throw err;
      else res.json(result);
    }
  );
});

router.post("/myGallery", (req, res) => {
  pool.query(
    `select * from portfolio where number = '${req.body.number}'`,
    (err, result) => {
      if (err) throw err;
      else res.json(result);
    }
  );
});

router.post("/myDetails", (req, res) => {
  pool.query(
    `select * from listing where number = '${req.body.number}'`,
    (err, result) => {
      if (err) throw err;
      else res.json(result);
    }
  );
});



router.post('/appointment-successful',(req,res)=>{
  let body = req.body
  pool.query(`select * from appointment where number = '${req.body.number}' and partner_number = '${req.body.partner_number}' and date = '${req.body.booking_date}' and timme = ''${req.body.booking_time}' and booking_id = '${req.body.booking_id}'`,(err,result)=>{
    if(err) throw err;
    else if(result[0]){
      res.json({
        msg : 'success'
      })
    }
    else {
      pool.query(`insert into appointment set ?`,body,(err,result)=>{
        if(err) throw err;
        else {
          pool.query(`delete from appointment_cart where number = '${req.body.number}' `,(err,result)=>{
            if(err) throw err;
            else {
              msg91.sendOne(authkey,req.body.number,`Hello ${body.name} , our appointment are booked successfuly on ${body.date} at ${body.time}.`,senderid,route,dialcode,function(err,response){
                  if(err) throw err;
                  else {
                    pool.query(`insert into normal_message (number,date,time,message) values('${body.number}','${today}','${todaytime}','Hello ${body.name} , our appointment are booked successfuly on ${body.date} at ${body.time}.') ` , (err,result)=>{
                        if(err) throw err;
                        else{
                          msg91.sendOne(authkey,req.body.partner_number,`A new appointment is booked by ${body.name} on ${body.date} at ${body.time}.`,senderid,route,dialcode,function(err,response){
                            if(err) throw err;
                            else{
                              pool.query(`insert into normal_message (number,date,time,message) values('${req.body.partner_number}','${today}','${todaytime}','A new appointment is booked by ${body.name} on ${body.date} at ${body.time}.') ` , (err,result)=>{
                                 if(err) throw err;
                                 else {
                                   res.json({
                                     msg : 'success'
                                   })
                                 }
                              })
                            }
                          })
                        }
                    })
                  }
              })
            }
          })
        }
      })
    }
  })
})



router.post('/appointment-history',(req,res)=>{
   let body = req.body;
   pool.query(`select a.*, (select s.name from appointment_service s where s.id = a.booking_id) as bookingname from appointment a where a.partner_number = '${req.body.number}' and a.date < CURDATE() and a.status='accepted'`,(err,result)=>{
     if(err) throw err;
     else {
       res.json(result)
     }
   })
})


router.post('my-banner-image',(req,res)=>{
  pool.query(`select banner_image from listing where number = '${req.body.banner_image}'`,(err,result)=>{
    if(err) throw err;
    else res.json(result)
  })
})


module.exports = router;
