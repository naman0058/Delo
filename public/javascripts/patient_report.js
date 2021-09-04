let patient_report = []

$('#back').hide()
$('#updateimgdiv').hide()
$('#show').click(function(){
    $.getJSON('/patient_report/all',function(data){

        patient_report = data
        
        makeTable(data)
    })

})


function makeTable(data) {

    let table = `
 
    <section class="panel">
							<header class="panel-heading">
								<div class="panel-actions">
                                <input type="text"  class="form-control" id="myInput" onkeyup="myFunction()" placeholder="Search By Mobile Number.." title="Type in a name">
                
								</div>
						
                                <h2 class="panel-title">Patient Details</h2>
                               
							</header>
							<div class="panel-body">
								<table class="table table-bordered table-striped mb-none" id="myTable" class="table ">
									<thead>
										<tr>
											<th>Patient Mobile Number</th>
											<th data-field="name" data-sortable="true">Diagnosis</th>
											<th>Report</th>
											<th class="hidden-phone">Update Report</th>
                        <th class="hidden-phone">Update</th>
                                          
										</tr>
									</thead>
                      <tbody>
                        <tr>
   `   
    $.each(data, function (i, item) {
        table += `
        <td>${item.number}</td>
        <td>${item.diagnosis}</td>
        <td> <img src='/images/${item.report}' style="width:50px"; height: 100px" /></td>
        <td><button class="btn btn-sm btn-dark update_report" id="${item.id}"><span class="glyphicon glyphicon-edit"></span>Update Report</button></td>
     
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





$('#result').on('click', '.update_report', function () {
    const id = $(this).attr('id')
    const result = patient_report.find(item => item.id == id);
  update_report()
  $('#peid').val(result.id)
    
})



$('#result').on('click', '.edit', function () {
    const id = $(this).attr('id')

    const result = patient_report.find(item => item.id == id);
  
    edit()
    $('#pid').val(result.id)
 $('#pnumber').val(result.number)
    $('#pdiagnosis').val(result.diagnosis)
   
  
})

$('#update').click(function () {
    let updateobj = {
        id : $('#pid').val(),
        number : $('#pnumber').val(),
        diagnosis : $('#pdiagnosis').val(),
        

    }
    $.post('/patient_report/update', updateobj, function data() {
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
    $.getJSON(`patient_report/all`, data => {
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



function update_report() {
    $('#editdiv').hide()
    $('#insertdiv').hide()
    $('#back').hide()
    $('#refresh').hide()
    $('#result').hide()
    $('#updateimgdiv').show()
    
}

$('#back1').click(function(){
    $('#editdiv').hide()
    $('#insertdiv').hide()
    $('#back').show()
  
    $('#result').show()
})


$('#back2').click(function(){
    $('#editdiv').hide()
    $('#updateimgdiv').hide()
    $('#insertdiv').hide()
    $('#back').show()
  
    $('#result').show()
})

$('#helpcontent').hide()

  $('.help').click(function(){
      $('#helpcontent').show()
      setTimeout(function() {
        
        $("#helpcontent").hide();
      }, 4000);  
  })