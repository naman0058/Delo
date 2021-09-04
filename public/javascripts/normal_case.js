let diagnosis = [];
let patient = [];

var today = new Date();
var dd = today.getDate();

var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();
if (dd < 10) {
  dd = "0" + dd;
}

if (mm < 10) {
  mm = "0" + mm;
}
today = yyyy + "-" + mm + "-" + dd;

$("#submit").click(function() {
  if ($("#name").val() == "" || $("#name").val() == []) {
    $(".notify").toggleClass("active");
    $("#notifyType").toggleClass("name");

    setTimeout(function() {
      $(".notify").removeClass("active");
      $("#notifyType").removeClass("name");
    }, 2000);
  } else if ($("#number").val() == "" || $("#number").val() == []) {
    $(".notify").toggleClass("active");
    $("#notifyType").toggleClass("number");

    setTimeout(function() {
      $(".notify").removeClass("active");
      $("#notifyType").removeClass("number");
    }, 2000);
  } else if ($("#age").val() == "" || $("#age").val() == []) {
    $(".notify").toggleClass("active");
    $("#notifyType").toggleClass("age");

    setTimeout(function() {
      $(".notify").removeClass("active");
      $("#notifyType").removeClass("age");
    }, 2000);
  } else if ($("#diagnosisid").val() == "" || $("#diagnosisid").val() == []) {
    $(".notify").toggleClass("active");
    $("#notifyType").toggleClass("diagnosis");

    setTimeout(function() {
      $(".notify").removeClass("active");
      $("#notifyType").removeClass("diagnosis");
    }, 2000);
  } else if (
    $("#total_ammount").val() == "" ||
    $("#total_ammount").val() == []
  ) {
    $(".notify").toggleClass("active");
    $("#notifyType").toggleClass("total_ammount");

    setTimeout(function() {
      $(".notify").removeClass("active");
      $("#notifyType").removeClass("total_ammount");
    }, 2000);
  } else if (
    $("#paid_ammount ").val() == "" ||
    $("#paid_ammount ").val() == []
  ) {
    $(".notify").toggleClass("active");
    $("#notifyType").toggleClass("paid_ammount");

    setTimeout(function() {
      $(".notify").removeClass("active");
      $("#notifyType").removeClass("paid_ammount");
    }, 2000);
  } else {
    let insertobj = {
      name: $("#name").val(),
      age: $("#age").val(),
      gender: $("#gender").val(),
      number: $("#number").val(),
      diagnosisid: $("#diagnosisid").val(),
      other_diagnosis: $("#other_diagnosis").val(),
      recall_date: $("#recall_date").val(),
      total_ammount: $("#total_ammount").val(),
      paid_ammount: $("#paid_ammount").val(),
      due_ammount: $("#total_ammount").val() - $("#paid_ammount").val(),
      status: $("#status").val(),
      time: $("#time").val(),
      date: today
    };
    $.post("/normal_case/insert", insertobj, function data() {
      $(".notify").toggleClass("active");
      $("#notifyType").toggleClass("success");

      setTimeout(function() {
        $(".notify").removeClass("active");
        $("#notifyType").removeClass("success");
      }, 2000);
      refresh();
    });
  }
});

$.getJSON(`diagnosis/all`, data => {
  diagnosis = data;
  fillDropDown("diagnosisid", data, "Choose Diagnosis", 0);
});

$.getJSON(`normal_case/all`, data => {
  patient = data;
  makeTable(data);
});

$("#result").hide();

$("#show").click(function() {
  $("#result").show();
  $("#insertdiv").hide();
  $("#back").show();
});

$("#back").click(function() {
  $("#result").hide();
  $("#insertdiv").show();
  $("#back").hide();
});

$("#back").hide();

function makeTable(data) {
  let table = `

    <section class="panel">
							<header class="panel-heading">
								<div class="panel-actions">
                                <input type="text"  class="form-control" id="myInput" onkeyup="myFunction()" placeholder="Search By OPD Number.." title="Type in a name">
                
								</div>
						
                                <h2 class="panel-title">Patient Details</h2>
                               
							</header>
							<div class="panel-body">
								<table class="table table-bordered table-striped mb-none" id="myTable" class="table ">
									<thead>
										<tr>
											<th>OPD No.</th>
											<th data-field="name" data-sortable="true">Patient Name</th>
											<th>Mobile No.</th>
											<th class="hidden-phone">Age</th>
                                            <th class="hidden-phone">Gender</th>
                                            <th>Diagnosis</th>
											<th>Other Diagnosis</th>
											<th>Total Amount(s)</th>
											<th class="hidden-phone">Paid Amount</th>
                                            <th class="hidden-phone">Due Amount</th>
                                            <th>Status</th>
											<th>Visit Date</th>
											<th>Recall Date(s)</th>
											<th class="hidden-phone">Time</th>
											<th class="hidden-phone">Edit</th>
										</tr>
									</thead>
 
                      <tbody>
                        <tr class="gradeX">
   `;
  $.each(data, function(i, item) {
    table += `
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.number}</td>
        <td>${item.age}</td>
        <td>${item.gender}</td>
        <td>${item.diagnosisname}</td>   
        <td>${item.other_diagnosis}</td>
        <td>${item.total_ammount}</td>
        <td>${item.paid_ammount}</td>
        <td>${item.due_ammount}</td>
        <td>${item.status}</td>
        <td>${item.date}
        <td>${item.recall_date}</td>
        <td>${item.time}</td>
        <td><button class="btn btn-sm btn-primary edit" id="${
          item.id
        }"><span class="glyphicon glyphicon-edit"></span> Edit</button></td>
      </tr>`;
  });
  table += ` </tbody>
    </table>
  </div>
</section>




`;

  $("#result").html(table);
}

function fillDropDown(id, data, label, selectedid = 0) {
  $(`#${id}`).empty();
  $(`#${id}`).append(
    $("<option>")
      .val("null")
      .text(label)
  );

  $.each(data, (i, item) => {
    if (item.id == selectedid) {
      $(`#${id}`).append(
        $("<option selected>")
          .val(item.id)
          .text(item.name)
      );
    } else {
      $(`#${id}`).append(
        $("<option>")
          .val(item.id)
          .text(item.name)
      );
    }
  });
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
    makeTable(data);
  });
}

$("#result").on("click", ".edit", function() {
  const id = $(this).attr("id");

  const result = patient.find(item => item.id == id);
  fillDropDown(
    "pdiagnosisid",
    diagnosis,
    "Choose diagnosis",
    result.diagnosisid
  );
  edit();
  $("#pid").val(result.id);
  $("#pname").val(result.name);
  $("#pnumber").val(result.number);
  $("#page").val(result.age);
  $("#pgender").val(result.gender);
  $("#pdiagnosisid").val(result.diagnosisid);
  $("#precall_date").val(result.recall_date);
  $("#ptime").val(result.time);
  $("#pother_diagnosis").val(result.other_diagnosis);
  $("#ptotal_ammount").val(result.total_ammount);
  $("#ppaid_ammount").val(result.paid_ammount);
  $("#pstatus").val(result.status);
});

$("#update").click(function() {
  let updateobj = {
    id: $("#pid").val(),
    name: $("#pname").val(),
    age: $("#page").val(),
    gender: $("#pgender").val(),
    number: $("#pnumber").val(),
    diagnosisid: $("#pdiagnosisid").val(),
    other_diagnosis: $("#pother_diagnosis").val(),
    recall_date: $("#precall_date").val(),
    total_ammount: $("#ptotal_ammount").val(),
    paid_ammount: $("#ppaid_ammount").val(),
    due_ammount: $("#ptotal_ammount").val() - $("#ppaid_ammount").val(),
    status: $("#pstatus").val(),
    time: $("#ptime").val()
  };
  $.post("/normal_case/update", updateobj, function data() {
    $(".notify").toggleClass("active");
      $("#notifyType").toggleClass("success");

      setTimeout(function() {
        $(".notify").removeClass("active");
        $("#notifyType").removeClass("success");
      }, 2000);
    update();
  });
});

$("#editdiv").hide();

function edit() {
  $("#editdiv").show();
  $("#insertdiv").hide();
  $("#back").hide();
  $("#refresh").hide();
  $("#result").hide();
}

$("#back1").click(function() {
  $("#insertdiv").hide();
  $("#editdiv").hide();
  $("#back").show();
  $("#result").show();
});

function update() {
  $("#result").show();
  $("#editdiv").hide();
  $("#insertdiv").hide();
  $("#back1").show();
  $("#back").show();
  refresh();
}
