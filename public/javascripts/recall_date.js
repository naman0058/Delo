let patient = []





$('#submit').click(function(){
   
    if( $('#id').val()== "" || $('#id').val()== []  )
    {
        alert("ID is mandatory");
    }
  
   else{



    let insertobj = {
        id : $('#id').val()
       
       
    }

  $.get('/recall_date/all',insertobj,function(data){
     patient = data
        makeTable(data);
        $('#result').show()
    })


   }   
   
})


let a = 'normal_case'
$.getJSON(`${a}/all`, data => {
    patient = data
    makeTable(data)

})



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
                  <h4 class="card-title ">Patient Status
                 &nbsp;&nbsp;&nbsp; 
               </h4>
                  <input type="text" class="form-control" id="myInput" onkeyup="myFunction()" placeholder="Search for names.." title="Type in a name">

                </div>
                <div class="card-body">
                  <div class="table-responsive">
                    <table id="myTable" class="table">
                      <thead class=" text-primary">
                        <th data-field="id">ID</th>
                        <th data-field="name" data-sortable="true">Name</th>
                        <th>Mobile Number </th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Diagnosis</th>
                        <th>Other Diagnosis</th>
                        <th>Total Amount </th>
                        <th>Paid Amount </th>
                        <th>Due Amount</th>
                        <th> Status </th>
                        <th>Edit</th>
                    
                      </thead>
                      <tbody>
                        <tr>
   `   
    $.each(data, function (i, item) {
        table += `
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.number}</td>
        <td>${item.age}</td>
        <td>${item.gender}</td>
        <td>${item.diagnosisid}</td>   
        <td>${item.other_diagnosis}</td>
        <td>${item.total_ammount}</td>
        <td>${item.paid_ammount}</td>
        <td>${item.due_ammount}</td>
        <td>${item.status}</td>
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
    $.getJSON(`normal_case/all`, data => {
        makeTable(data)
    })
}





$('#result').on('click', '.edit', function () {
    const id = $(this).attr('id')

    const result = patient.find(item => item.id == id);
    fillDropDown('pdiagnosisid', diagnosis, 'Choose diagnosis', result.diagnosisid)
    edit()
    $('#pid').val(result.id)
    $('#pname').val(result.name)
    $('#pnumber').val(result.number)
    $('#page').val(result.age)
    $('#pgender').val(result.gender)
    $('#pdiagnosisid').val(result.diagnosisid)
    $('#pother_diagnosis').val(result.other_diagnosis)
    $('#ptotal_ammount').val(result.total_ammount)
    $('#ppaid_ammount').val(result.paid_ammount)
    $('#pstatus').val(result.status)
})

$('#update').click(function () {
    let updateobj = {
        id: $('#pid').val(),
        name : $('#pname').val(),
        age : $('#page').val(),
        gender : $('#pgender').val(),
        number : $('#pnumber').val(),
        diagnosisid : $('#pdiagnosisid').val(),
        other_diagnosis : $('#pother_diagnosis').val(),
        total_ammount : $('#ptotal_ammount').val(),
        paid_ammount : $('#ppaid_ammount').val(),
        due_ammount :  $('#ptotal_ammount').val() - $('#ppaid_ammount').val(),
        status : $('#pstatus').val(),
    

    }
    $.post('/normal_case/update', updateobj, function data() {
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

