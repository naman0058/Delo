let daily_exepenses = []

$('#back').hide()




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


$('#submit').click(function(){
    if($('#lab_cost').val()=="" || $('#lab_cost').val()==[]){
        $(".notify").toggleClass("active");
        $("#notifyType").toggleClass("lab_cost");
    
        setTimeout(function() {
          $(".notify").removeClass("active");
          $("#notifyType").removeClass("lab_cost");
        }, 2000);
    }
    else if($('#material_cost').val()=="" || $('#material_cost').val()==[]){
        $(".notify").toggleClass("active");
        $("#notifyType").toggleClass("material_cost");
    
        setTimeout(function() {
          $(".notify").removeClass("active");
          $("#notifyType").removeClass("material_cost");
        }, 2000);
    }
    else if($('#medicine_cost').val()=="" || $('#medicine_cost').val()==[]){
        $(".notify").toggleClass("active");
        $("#notifyType").toggleClass("medicine_cost");
    
        setTimeout(function() {
          $(".notify").removeClass("active");
          $("#notifyType").removeClass("medicine_cost");
        }, 2000);
    }
    else if($('#fees').val()=="" || $('#fees').val()==[]){
        $(".notify").toggleClass("active");
        $("#notifyType").toggleClass("fees");
    
        setTimeout(function() {
          $(".notify").removeClass("active");
          $("#notifyType").removeClass("fees");
        }, 2000);
    }
    else if($('#opd').val()=="" || $('#opd').val()==[]){
        $(".notify").toggleClass("active");
        $("#notifyType").toggleClass("opd");
    
        setTimeout(function() {
          $(".notify").removeClass("active");
          $("#notifyType").removeClass("opd");
        }, 2000);
    }
    else{
        let insertobj = {
            lab_cost : $('#lab_cost').val(),
            material_cost : $('#material_cost').val(),
            medicine_cost : $('#medicine_cost').val(),
            extra_expenses : $('#extra_expenses').val(),
            fees : $('#fees').val(),
            opd : $('#opd').val(),
            other : $('#other').val(),
            total : ( (+$('#fees').val()) + (+ $('#opd').val()) + (+ $('#other').val()) ) -  ( (+$('#lab_cost').val()) + (+$('#material_cost').val()) + (+$('#medicine_cost').val()) + (+ $('#extra_expenses').val()) ),

            date : today
        
            
        }

       
 
            var r = confirm("Are you sure to submit the data!");
            if (r == true) {
                $.post('/daily_expenses/insert',insertobj,function data(){
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
    $.getJSON('/daily_expenses/all',function(data){

        daily_exepenses = data
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
						
                                <h2 class="panel-title">Daily Expenses Details</h2>
                               
							</header>
							<div class="panel-body">
								<table class="table table-bordered table-striped mb-none" id="myTable" class="table ">
									<thead>
										<tr>
											<th>Date</th>
											<th data-field="name" data-sortable="true">Lab Cost</th>
											<th>Material Cost</th>
											<th class="hidden-phone">Medicine Cost</th>
                                            <th class="hidden-phone">Extra Expenses</th>
                                            <th>Fees</th>
											<th>OPD</th>
											<th>Other</th>
											<th class="hidden-phone">Total Profit / Loss</th>
                                           <th class="hidden-phone">Edit</th>
										</tr>
									</thead>
                      <tbody>
                        <tr>
   `   
    $.each(data, function (i, item) {
        table += `
        <td>${item.date}</td>
        <td>${item.lab_cost}</td>
        <td>${item.material_cost}</td>
        <td>${item.medicine_cost}</td>
        <td>${item.extra_expenses}</td>
        <td>${item.fees}</td>   
        <td>${item.opd}</td>
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

    const result = daily_exepenses.find(item => item.id == id);
  
    edit()
    $('#pid').val(result.id)
 $('#plab_cost').val(result.lab_cost)
    $('#pmaterial_cost').val(result.material_cost)
    $('#pmedicine_cost').val(result.medicine_cost)
    $('#pextra_expenses').val(result.extra_expenses)
    $('#pfees').val(result.fees)
    $('#popd').val(result.opd)
    $('#pother').val(result.other)
  
})

$('#update').click(function () {
    let updateobj = {
        id : $('#pid').val(),
        lab_cost : $('#plab_cost').val(),
            material_cost : $('#pmaterial_cost').val(),
            medicine_cost : $('#pmedicine_cost').val(),
            extra_expenses : $('#pextra_expenses').val(),
            fees : $('#pfees').val(),
            opd : $('#popd').val(),
            other : $('#pother').val(),
            total : ( (+$('#pfees').val()) + (+ $('#popd').val()) + (+ $('#pother').val()) ) -  ( (+$('#plab_cost').val()) + (+$('#pmaterial_cost').val()) + (+$('#pmedicine_cost').val()) + (+ $('#pextra_expenses').val()) ),

            date : today

    }
    $.post('/daily_expenses/update', updateobj, function data() {
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
    $.getJSON(`daily_expenses/all`, data => {
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