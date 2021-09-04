let monthly_exepenses = []

$('#back').hide()




var today = new Date();
var dd = today.getDate();

var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();

today = mm;




$('#submit').click(function(){
    if($('#rent').val()=="" || $('#rent').val()==[]){
        $(".notify").toggleClass("active");
        $("#notifyType").toggleClass("rent");
    
        setTimeout(function() {
          $(".notify").removeClass("active");
          $("#notifyType").removeClass("rent");
        }, 2000);
    }
    else if($('#electricity_bill').val()=="" || $('#electricity_bill').val()==[]){
        $(".notify").toggleClass("active");
        $("#notifyType").toggleClass("electricity_bill");
    
        setTimeout(function() {
          $(".notify").removeClass("active");
          $("#notifyType").removeClass("electricity_bill");
        }, 2000);
    }
    else if($('#staff_cost').val()=="" || $('#staff_cost').val()==[]){
        $(".notify").toggleClass("active");
        $("#notifyType").toggleClass("staff_cost");
    
        setTimeout(function() {
          $(".notify").removeClass("active");
          $("#notifyType").removeClass("staff_cost");
        }, 2000);
    }
    else if($('#monthly_maintarnance').val()=="" || $('#monthly_maintarnance').val()==[]){
        $(".notify").toggleClass("active");
        $("#notifyType").toggleClass("monthly_maintarnance");
    
        setTimeout(function() {
          $(".notify").removeClass("active");
          $("#notifyType").removeClass("monthly_maintarnance");
        }, 2000);
    }
 
    else{
        let insertobj = {
            rent : $('#rent').val(),
            electricity_bill : $('#electricity_bill').val(),
            staff_cost : $('#staff_cost').val(),
            new_instrument : $('#new_instrument').val(),
            monthly_maintarnance : $('#monthly_maintarnance').val(),
            advertisement : $('#advertisement').val(),
            transport : $('#transport').val(),
            other : $('#other').val(),
            total : ( (+$('#rent').val()) + (+ $('#electricity_bill').val()) + (+ $('#staff_cost').val()) + (+$('#new_instrument').val()) + (+$('#monthly_maintarnance').val()) + (+$('#advertisement').val()) + (+ $('#transport').val()) + (+$('#other').val()) ),

            date : today
        
            
        }

       
 
            var r = confirm("Are you sure to submit the data!");
            if (r == true) {
                $.post('/monthly_expenses/insert',insertobj,function(data){
                    $(".notify").toggleClass("active");
    $("#notifyType").toggleClass("success");

    setTimeout(function() {
      $(".notify").removeClass("active");
      $("#notifyType").removeClass("success");
    }, 2000);
                })
            } 
           
          

    }
})



$('#show').click(function(){
    $.getJSON('/monthly_expenses/all',function(data){

        monthly_exepenses = data
        makeTable(data)
    })

})


function makeTable(data) {

    let table = `
 
    <section class="panel">
							<header class="panel-heading">
								<div class="panel-actions">
                                <input type="text"  class="form-control" id="myInput" onkeyup="myFunction()" placeholder="Search By Date.." title="Type in a name">
                
								</div>
						
                                <h2 class="panel-title">Monthly Expenses Details</h2>
                               
							</header>
							<div class="panel-body">
								<table class="table table-bordered table-striped mb-none" id="myTable" class="table ">
									<thead>
										<tr>
											<th>Date</th>
											<th data-field="name" data-sortable="true">Rent Bill</th>
											<th>Electricity Bill</th>
											<th class="hidden-phone">Staff Cost</th>
                                            <th class="hidden-phone">New Instrument</th>
                                            <th>Monthly Maintaienance</th>
											<th>Advertisement</th>
											<th>Transport</th>
											<th class="hidden-phone">Other</th>
                                            <th class="hidden-phone">Total Amount</th>
                                           
											<th class="hidden-phone">Edit</th>
										</tr>
									</thead>
 
                      <tbody>
                        <tr>
   `   
    $.each(data, function (i, item) {
        table += `
        <td>${item.date}</td>
        <td>${item.rent}</td>
        <td>${item.electricity_bill}</td>
        <td>${item.staff_cost}</td>
        <td>${item.new_instrument}</td>
        <td>${item.monthly_maintarnance}</td>   
        <td>${item.advertisement}</td>
        <td>${item.transport}</td>
        <td>${item.other}</td>
       
        <td>${item.total}</td>
      
        <td><button class="btn btn-sm btn-primary edit" id="${item.id}"><span class="glyphicon glyphicon-edit"></span> Edit</button></td>
      </tr>`
    })
    table += ` </tbody>
    </table>
  </div>
</div>
</div>
</div>
`

    $('#result').html(table)
    $('#insertdiv').hide()
    $('#back').show()
    $('#result').show()
}

$('#back').click(function(){
    $('#insertdiv').show()
    $('#back').hide()
    $('#result').hide()
})


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







$('#result').on('click', '.edit', function () {
    const id = $(this).attr('id')

    const result = monthly_exepenses.find(item => item.id == id);
  
    edit()
    $('#pid').val(result.id)
    $('#prent').val(result.rent)
    $('#pelectricity_bill').val(result.electricity_bill)
    $('#pstaff_cost').val(result.staff_cost)
    $('#pnew_instrument').val(result.new_instrument)
    $('#pmonthly_maintarnance').val(result.monthly_maintarnance)
    $('#padvertisement').val(result.advertisement)
    $('#ptransport').val(result.transport)
    $('#pother').val(result.other)
  
})

$('#update').click(function () {
    let updateobj = {
        id : $('#pid').val(),
        rent : $('#prent').val(),
        electricity_bill : $('#pelectricity_bill').val(),
        staff_cost : $('#pstaff_cost').val(),
        new_instrument : $('#pnew_instrument').val(),
        monthly_maintarnance : $('#pmonthly_maintarnance').val(),
        advertisement : $('#padvertisement').val(),
        transport : $('#ptransport').val(),
        other : $('#pother').val(),
        total : ( (+$('#prent').val()) + (+ $('#pelectricity_bill').val()) + (+ $('#pstaff_cost').val()) + (+$('#pnew_instrument').val()) + (+$('#pmonthly_maintarnance').val()) + (+$('#padvertisement').val()) + (+ $('#ptransport').val()) + (+$('#pother').val()) ),

        date : today

    }
    $.post('/monthly_expenses/update', updateobj, function data() {
        $(".notify").toggleClass("active");
    $("#notifyType").toggleClass("success");

    setTimeout(function() {
      $(".notify").removeClass("active");
      $("#notifyType").removeClass("success");
    }, 2000);
        update()
    })
})


$('#editdiv').hide()

function update() {
    $('#result').show()
    $('#editdiv').hide()
    $('#insertdiv').hide()
    $('#back1').show()
    $('#back').show()
    refresh()
}

function refresh() {
    $.getJSON(`monthly_expenses/all`, data => {
        makeTable(data)
    })
}

function edit() {
    $('#editdiv').show()
    $('#insertdiv').hide()
    $('#back').hide()
    $('#refresh').hide()
    $('#result').hide()
    
}


$("#back1").click(function() {
    $("#insertdiv").hide();
    $("#editdiv").hide();
    $("#back").show();
    $("#result").show();
  });


  $('#helpcontent').hide()

  $('.help').click(function(){
      $('#helpcontent').show()
      setTimeout(function() {
        
        $("#helpcontent").hide();
      }, 4000);  
  })