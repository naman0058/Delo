let dentist = []
let dentists = []


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

function createDate(date) {
    let temp = date.getFullYear() + "-";
    if (date.getMonth() < 10) temp += "0" + (date.getMonth() + 1) + "-";
    else temp += date.getMonth() + 1 + "-";
  
    if (date.getDate() < 10) temp += "0" + date.getDate();
    else temp += date.getDate();
  
    return temp;
  }



$('#submit').click(function(){
   
    if( $('#dentistid').val()== "" || $('#dentistid').val()== []  )
    {
        alert("Dentist Name is mandatory");
    }
    else if($('#date').val()== "" || $('#date').val()== []){
        alert("Date is mandatory")
    }
   
    else if($('#total_ammount').val()== "" || $('#total_ammount').val()== []){
           alert("Total Amount is mandatory");
    }
    else if($('#paid_ammount ').val()== "" || $('#paid_ammount ').val()== []){
           alert("Paid Amount is Compulsary");
    }
   
 
   else{

    const date = new Date($("#date").val());
    let dentistid = $("#dentistid").val();
    let total_ammount = $('#total_ammount').val();
    let paid_ammount = $('#paid_ammount').val();
    let due_ammount =  $('#total_ammount').val() - $('#paid_ammount').val();
    let deposit_date = today
    let date1 = createDate(
      new Date(date.getFullYear(), date.getMonth(), 1)
    );
    let date2 = createDate(
      new Date(date.getFullYear(), date.getMonth() + 1, 0)
    );

   
   $.post('/lab_ledger_book/insert', {dentistid,total_ammount,paid_ammount,due_ammount,deposit_date,date1,date2}, function data() {
     alert("Successfully")  
      refresh()
    })




   }   
   
})


$.getJSON(`login/all`, data => {
    dentist = data
    fillDropDown('dentistid', data, 'Choose Dentist Name', 0)
})



$.getJSON(`lab_ledger_book/all`, data => {
    dentists = data
   makeTable(data)
})




function refresh() {
    $.getJSON(`lab_ledger_book/all`, data => {
        makeTable(data)
    })
}

$('#result').hide()


$('#show').click(function(){
    $('#result').show()
    $('#insertdiv').hide()  
    $('#back').show()

})


$('#back').click(function(){
    $('#result').hide()
    $('#insertdiv').show()  
    $('#back').hide()
})

$('#back').hide()

function makeTable(data) {

    let table = `
 
    <div class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="card-header card-header-primary">
                  <h4 class="card-title ">Ledger Book Status
                 &nbsp;&nbsp;&nbsp; 
               </h4>
                  <input type="text" class="form-control" id="myInput" onkeyup="myFunction()" placeholder="Search By Dentist Name.." title="Type in a name">
                
                </div>
                <div class="card-body">
                  <div class="table-responsive">
                    <table id="myTable" class="table">
                      <thead class=" text-primary">
                        <th>Dentist Name </th>
                        <th data-field="name" data-sortable="true">From Date</th>
                        <th>To Date </th>
                        <th> Total Amount </th>
                        <th>Paid Amount </th>
                        <th>Due Amount</th>
                        <th>Deposit Amount Date </th>
                       <th>Edit</th>
                       <th>Delete</th>
                    
                      </thead>
                      <tbody>
                        <tr>
   `   
    $.each(data, function (i, item) {
        table += `
        <td>${item.dentistname.toUpperCase()}</td>
        <td>${item.date1}</td>
        <td>${item.date2}</td>
        <td>${item.total_ammount}</td>
       <td>${item.paid_ammount}</td>
        <td>${item.due_ammount}</td>
        <td>${item.deposit_date}</td>
       <td><button class="btn btn-sm btn-primary edit" id="${item.id}"><span class="glyphicon glyphicon-edit"></span> Edit</button></td>
       <td><button class="btn btn-sm btn-danger delete" id="${item.id}"><span class="glyphicon glyphicon-trash"></span> Delete</button></td>
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
}



function fillDropDown(id, data, label, selectedid = 0) {
    $(`#${id}`).empty()
    $(`#${id}`).append($('<option>').val("null").text(label))

    $.each(data, (i, item) => {
        if (item.id == selectedid) {
            $(`#${id}`).append($('<option selected>').val(item.id).text(item.name))
        } else {
            $(`#${id}`).append($('<option>').val(item.id).text(item.name))
        }
    })
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


function refresh() {
    $.getJSON(`lab_ledger_book/all`, data => {
        makeTable(data)
    })
}



$('#result').on('click', '.delete', function () {
    const id = $(this).attr('id')
    var a = confirm("Are you sure you want to delete this data")
    if(a==true){
    $.get('/lab_ledger_book/delete', {id}, function data() {
      
        update()
    })
    }
})


$('#result').on('click', '.edit', function () {
    const id = $(this).attr('id')

    const result = dentists.find(item => item.id == id);
    fillDropDown('pdentistid', dentist, 'Choose Dentist Name',result.dentistid)
    edit()
    $('#pid').val(result.id)
    $('#pdentistid').val(result.dentistid)
   $('#ptotal_ammount').val(result.total_ammount)
    $('#ppaid_ammount').val(result.paid_ammount)
   
})

$('#update').click(function () {
    let updateobj = {
        id: $('#pid').val(),
        dentistid : $('#pdentistid').val(),
        total_ammount : $('#ptotal_ammount').val(),
        paid_ammount : $('#ppaid_ammount').val(),
        due_ammount :  $('#ptotal_ammount').val() - $('#ppaid_ammount').val(),
        deposit_date : today

    }
    $.post('/lab_ledger_book/update', updateobj, function data() {
        alert('Updated Successfully')
        update()
    })
})


$('#editdiv').hide()


function edit() {
    $('#editdiv').show()
    $('#insertdiv').hide()
    $('#back').hide()
    $('#refresh').hide()
    $('#result').hide()
    
}

$('#back1').click(function(){
    $('#insertdiv').hide()
    $('#editdiv').hide()
    $('#back').show() 
    $('#result').show()
})

function update() {
    $('#result').show()
    $('#editdiv').hide()
    $('#insertdiv').hide()
    $('#back1').show()
    $('#back').show()
    refresh()
}

