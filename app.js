
var createError = require("http-errors");
var cookieSession = require("cookie-session");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var Nexmo = require("nexmo");
const helmet = require('helmet')
var subdomain = require('express-subdomain-router');
 


var indexRouter = require("./routes/index");
var index = require("./routes/index1")
var team_login = require('./routes/team_login');
var team_dashboard = require('./routes/team_dashboard');
var admin = require('./routes/admin');
var adminhome = require('./routes/adminhome');
var category = require("./routes/category");
var subcategory = require("./routes/subcategory");
var services = require("./routes/services");
var login = require("./routes/login");
var userverify = require("./routes/userverify");
var booking = require("./routes/booking");
var booking_order = require("./routes/booking_order");
var payment_mode = require("./routes/payment_mode");
var teamverify = require('./routes/teamverify');
var team = require('./routes/team');
var processing = require('./routes/processing');
var loginverify = require('./routes/loginverify');
var termsconditions = require('./routes/termsconditions');
var refundpolicy = require('./routes/refundpolicy');
var privacypolicy = require('./routes/privacypolicy');
var faq = require('./routes/faq');
var file_rtr = require('./routes/file_rtr');
var file_rtr_verification = require('./routes/file_rtr_verification');
var robots=require('./routes/robots');
var api = require('./routes/api');
var blog = require('./routes/newblog');
//var demo = require('./routes/demo');
var nearme = require('./routes/near-me');
var blogs = require('./routes/blogs');
var membership = require('./routes/membership');
var aboutus = require('./routes/aboutus');
var laundry = require('./routes/laundry');
var invoice = require('./routes/invoice');
var booking_dashboard = require('./routes/booking_dashboard');
var razorpay = require('./routes/razorpay');
var htaccess = require('./routes/htaccess');
var sitemap = require('./routes/sitemap');
var sitemapxml = require('./routes/sitemapxml');
var feed = require('./routes/feed');
var team_verification_dashboard = require('./routes/team_verification_dashboard');
var msg91 = require('./routes/msg91')
var freelisting = require('./routes/freelisting')
var delo_listing_dashboard = require('./routes/delo_listing_dashboard');
var dial_subactegory = require('./routes/dial_subactegory');
var dial_subservices = require('./routes/dial_subservices');
var manage_campign = require('./routes/manage_campign');
var dial_call_center_dashboard = require('./routes/dial_call_center_dashboard');
var mart_category = require('./routes/mart_category');
var mart_subcategory = require('./routes/mart_subcategory');
var mart_subservices = require('./routes/mart_subservices');
var list_your_product = require('./routes/list_your_product');
var mart_brand = require('./routes/mart_brand');
var send = require('./routes/send')
var advertise = require('./routes/advertise');
var marketing_executive = require('./routes/marketing_executive');
var rate_card = require('./routes/rate_card');
var appointment_service = require('./routes/appointment-service')



var cors = require('cors')
const nexmo = new Nexmo(
  {
    apiKey: "17e9a27d",
    apiSecret: "Fikjq0QTbVnEAiHP"
  },
  { debug: true }
);

//var facebooklogin = require('./routes/facebooklogin');
var app = express();
app.use(helmet())

app.use(cors())

var corsOptions = {
  origin: 'https://deloservices.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "dist")));

app.use(
  cookieSession({
    name: "session",
    keys: ["naman"],

     //Cookie Options
    maxAge: 168 * 60 * 60 * 100 // 24 hours
  })
);
 




app.use("/", indexRouter);
app.use('/team_login',team_login);
app.use('/index.html',index)
app.use('/team_dashboard',team_dashboard);
app.use('/deloservices-login',admin);
app.use('/adminhome',adminhome);
app.use('/category',category);
app.use('/subcategory',subcategory);
app.use('/services',services);
app.use('/login',login);
app.use('/userverify',userverify);
app.use('/booking',booking);
app.use('/booking_order',booking_order);
app.use('/payment_mode',payment_mode);
app.use('/teamverify',teamverify);
app.use('/team',team);
app.use('/processing',processing);
app.use('/loginverify',loginverify);
app.use('/termsconditions',termsconditions)
app.use('/privacypolicy',privacypolicy)
app.use('/refundpolicy',refundpolicy)
app.use('/faq',faq);
app.use('/file_rtr',file_rtr);
app.use('/file_rtr_verification',file_rtr_verification);
app.use('/robots.txt',robots);
app.use('/api',api);
app.use('/newblog',blog);
//app.use('/demo',demo);
app.use('/near-me',nearme);
app.use('/membership',membership);
app.use('/about-us',aboutus);
app.use('/laundry',laundry);
app.use('/invoice',invoice);
app.use('/booking_dashboard',booking_dashboard)
app.use('/razorpay',razorpay)
app.use('/.htaccess',htaccess)
app.use('/site-map',sitemap)
app.use('/sitemap.xml',sitemapxml);
app.use('/feed',feed);
app.use('/team-verification-dashboard',team_verification_dashboard)
app.use('/msg91',msg91);
app.use('/free-listing',freelisting);
app.use('/listing/dashboard',delo_listing_dashboard);
app.use('/dial_subcategory',dial_subactegory)
app.use('/dial_subservices',dial_subservices)
app.use('/promote-your-business',manage_campign);
app.use('/delo_dial/call-center-dashboard',dial_call_center_dashboard);
app.use('/mart_category',mart_category);
app.use('/mart_subcategory',mart_subcategory);
app.use('/mart_subservices',mart_subservices);
app.use('/list-your-product',list_your_product);
app.use('/mart_brand',mart_brand);
app.use('/send',send);
app.use('/advertise',advertise);
app.use('/marketing_executive',marketing_executive);
app.use('/rate_card',rate_card);
app.use(subdomain('free-listing',freelisting))
app.use('/appointment-service',appointment_service)
app.use('/blogs',blogs)


//app.use('/facebooklogin',facebooklogin);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});




module.exports = app;
