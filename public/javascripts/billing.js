let result = []
$('#back').hide()
$('#back1').hide()
start()
addbutton()
removebutton()
function start(){
    var i = 2;
    for(i=2;i<=15;i++){
        $('#div'+i).hide()
        
    }
}

function addbutton(){
    var i = 2;
    for(i=2;i<=15;i++){
        $('#addbtn'+i).hide()
        
    }
}

function removebutton(){
    var i = 0;
    for(i=0;i<=15;i++){
        $('#removebtn'+i).hide()
        
    }
}

$('#addbtn1').click(function(){
    $('#div2').show()
    $('#addbtn1').hide()
    $('#addbtn2').show()
    $('#removebtn1').show()
})


$('#removebtn1').click(function(){
    $('#div2').hide()
    $('#addbtn1').show()
    $('#addbtn2').hide()
    $('#removebtn1').hide()
})

$('#addbtn2').click(function(){
    $('#div3').show()
    $('#addbtn2').hide()
   // $('#addbtn3').show()
    $('#removebtn1').hide()
    $('#removebtn2').show()
})

$('#removebtn2').click(function(){
    $('#div3').hide()
    $('#addbtn2').show()
    $('#removebtn1').show()
    $('#removebtn2').hide()
})






/*
function addbutton(id){
    
    var a = 100;
    var c = id;
    var d = (+id)+(+1);
   $('#div' +d).show()
  $('#' +c).hide()
  $('#' +d).show()
$('#' +a).show()

   }


   function removebutton(id){
       if(id == 100){
           $('#div2').hide()
           $('#100').hide()
}
else{
    $('#div3').hide()
}
   }*/



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

$('#getBill').click(function(){


if($('#name').val() == '' || $('#name').val()==[]){
    $(".notify").toggleClass("active");
    $("#notifyType").toggleClass("name");

    setTimeout(function() {
      $(".notify").removeClass("active");
      $("#notifyType").removeClass("name");
    }, 2000);
}
else if($('#service1').val() == '' || $('#service1').val()==[]){
    $(".notify").toggleClass("active");
    $("#notifyType").toggleClass("service");

    setTimeout(function() {
      $(".notify").removeClass("active");
      $("#notifyType").removeClass("service");
    }, 2000);
}
else if($('#quantity1').val() == '' || $('#quantity1').val()==[]){
    $(".notify").toggleClass("active");
    $("#notifyType").toggleClass("quantity");

    setTimeout(function() {
      $(".notify").removeClass("active");
      $("#notifyType").removeClass("quantity");
    }, 2000);
}
else if($('#price1').val() == '' || $('#price1').val()==[]){
    $(".notify").toggleClass("active");
    $("#notifyType").toggleClass("price");

    setTimeout(function() {
      $(".notify").removeClass("active");
      $("#notifyType").removeClass("price");
    }, 2000);
}
else{


    let insertobj ={
        name : $('#name').val(),
        service1 : $('#service1').val(),
        quantity1 : $('#quantity1').val(),
        price1 : $('#price1').val(),
        quantity2 : $('#quantity2').val(),
        service2 : $('#service2').val(),
        price2 : $('#price2').val(),
        quantity3 : $('#quantity3').val(),
        service3 : $('#service3').val(),
        price3 : $('#price3').val(),
        total_ammount :  (+ $('#quantity1').val() * $('#price1').val() ) + (+ $('#quantity2').val() * $('#price2').val()) + (+ $('#quantity3').val() * $('#price3').val()),
        date : today
    }

    $.post('/billing/insert',insertobj,function(data){
    makeinvoice()
})


var total1 = (+ $('#quantity1').val() * $('#price1').val() ) 
var total2 =  (+ $('#quantity2').val() * $('#price2').val())
var total3 =  (+ $('#quantity3').val() * $('#price3').val())
var date = new Date()
var d = new Date();
var date = d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear() ;
function makeinvoice(){
    let invoice = `


			

					<!-- start: page -->

					<section class="panel">
						<div class="panel-body">
							<div class="invoice">
								<header class="clearfix">
									<div class="row">
										<div class="col-sm-6 mt-md">
											<h2 class="h2 mt-none mb-sm text-dark text-bold">INVOICE</h2>
											
										</div>
										<div class="col-sm-6 text-right mt-md mb-md">
                                            <address class="ib mr-xlg">
                                            
												Okler Themes Ltd
												<br/>
												24 Henrietta Street, London, England
												<br/>
												Phone: +12 3 4567-8901
												<br/>
												okler@okler.net
											</address>
										
										</div>
									</div>
								</header>
								<div class="bill-info">
									<div class="row">
										<div class="col-md-6">
											<div class="bill-to">
												<p class="h5 mb-xs text-dark text-semibold">To:</p>
												<address>
													${insertobj.name}
													<br/>
													
												</address>
											</div>
										</div>
										<div class="col-md-6">
											<div class="bill-data text-right">
												<p class="mb-none">
													<span class="text-dark">Invoice Date:</span>
													<span class="value">${date}</span>
												</p>
												
											</div>
										</div>
									</div>
								</div>
							
								<div class="table-responsive">
									<table class="table invoice-items">
										<thead>
											<tr class="h4 text-dark">
												
												<th id="cell-item"   class="text-semibold">Item</th>
										        <th id="cell-price"  class="text-center text-semibold">Price</th>
												<th id="cell-qty"    class="text-center text-semibold">Quantity</th>
												<th id="cell-total"  class="text-center text-semibold">Total</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												
												<td class="text-semibold text-dark">${insertobj.service1}</td>
				                 				<td class="text-center">${insertobj.price1} Rs</td>
												<td class="text-center">${insertobj.quantity1}</td>
												<td class="text-center">${total1} Rs</td>
                                            </tr>`
                                           
												if(!insertobj.service2 == '' || !insertobj.service2==[]){
                                             invoice +=`       <tr>
												<td class="text-semibold text-dark">${insertobj.service2}</td>
				                 				<td class="text-center">${insertobj.price2} Rs</td>
												<td class="text-center">${insertobj.quantity2}</td>
												<td class="text-center">${total2} Rs</td>
                                            </tr>`
                                                }

                                                if(!insertobj.service3 == '' || !insertobj.service3 ==[]){
                                         invoice +=`   <tr>
												
												<td class="text-semibold text-dark">${insertobj.service3}</td>
				                 				<td class="text-center">${insertobj.price3} Rs</td>
												<td class="text-center">${insertobj.quantity3}</td>
												<td class="text-center">${total3} Rs</td>
                                            </tr>`
                                                }
                                                invoice +=`
											
										</tbody>
									</table>
								</div>
							
								<div class="invoice-summary">
									<div class="row">
										<div class="col-sm-4 col-sm-offset-8">
											<table class="table h5 text-dark">
												<tbody>
													<tr class="b-top-none">
														<td colspan="2">Subtotal</td>
														<td class="text-left">${insertobj.total_ammount} Rs</td>
													</tr>
													<tr>
														<td colspan="2">Shipping</td>
														<td class="text-left">0.00 Rs</td>
													</tr>
													<tr class="h4">
														<td colspan="2">Grand Total</td>
														<td class="text-left">${insertobj.total_ammount} Rs</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>

							<div class="text-right mr-lg">
								
                                <button type="button" class="print" onclick = window.print();><i class="fa fa-print"></i> Print</button>
                               
							</div>
						</div>
					</section>

					<!-- end: page -->
				</section>
			</div>

		
		</section>

    
    `
    $('#result').html(invoice)
    $('#insertdiv').hide()
    $('.sidebar').hide()
    $('#header').hide()
    $('#extra').hide()
    $('#a').hide()
    $('#back').show()
    $('#result').show()
}
}
  
$('#back').click(function(){
    $('#insertdiv').show()
    $('.sidebar').show()
    $('#header').show()
    $('#extra').show()
    $('#back').hide()
    $('#result').hide()
    $('#a').show()
})



})



$('#show').click(function(){
    $.getJSON('/billing/all',function(data){
        maketable(data)
    })
})


function maketable(data) {

    let table = `
 
    <section class="panel">
							<header class="panel-heading">
								<div class="panel-actions">
                                <input type="text"  class="form-control" id="myInput" onkeyup="myFunction()" placeholder="Search By Cusotmer Name.." title="Type in a name">
                
								</div>
						
                                <h2 class="panel-title">Bills Details</h2>
                               
							</header>
							<div class="panel-body">
								<table class="table table-bordered table-striped mb-none" id="myTable" class="table ">
									<thead>
										<tr>
											<th>Customer Name</th>
											<th data-field="name" data-sortable="true">Services</th>
											<th>Total Amount</th>
											
										</tr>
									</thead>
 
                      <tbody>
                        <tr class="gradeX">
                      
   `   
    $.each(data, function (i, item) {
        table += `
        <td>${item.name}</td>
        <td>${item.service}</td>
        <td>${item.total_ammount}</td>
       </tr>`
    })
    table += ` </tbody>
    </table>
  </div>
</div>
</div>
</div>
`

    $('#result1').html(table)
    $('#insertdiv').hide()
    $('#back1').show()
    $('#back').hide()
    $('#result1').show()
}


function back1(){

    $('#result1').hide()
    $('#insertdiv').show()
    $('#back1').hide()
    $('#insertdiv').show()
    $('.sidebar').show()
    $('#header').show()
    $('#extra').show()
    $('#back').hide()
    $('#result').hide()
    $('#a').show()
}




function myFunction() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }