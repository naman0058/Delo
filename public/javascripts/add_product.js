$(document).ready(function() {
  let products = [];

  $("#back").hide();
  $("#updateimgdiv").hide();
  $("#show").click(function() {
    $.getJSON("/add_product/all", function(data) {
      products = data;

      makeTable(data);
    });
  });

  function makeTable(data) {
    let table = `
 
    <section class="panel">
							<header class="panel-heading">
								<div class="panel-actions">
                                <input type="text"  class="form-control" id="myInput" onkeyup="myFunction()" placeholder="Search By Product Name.." title="Type in a name">
                
								</div>
						
                                <h2 class="panel-title">Product Details</h2>
                               
							</header>
							<div class="panel-body">
								<table class="table table-bordered table-striped mb-none" id="myTable" class="table ">
									<thead>
										<tr>
											<th>Product Name</th>
											<th data-field="name" data-sortable="true">Quantity</th>
											<th>Price</th>
											<th class="hidden-phone">Image</th>
                                            <th class="hidden-phone">Update Image</th>
                                            <th>Update</th>
										
										</tr>
									</thead>
                      <tbody>
                        <tr>
   `;
    $.each(data, function(i, item) {
      table += `
        <td>${item.name}</td>
       <td>${item.quantity}</td>
        <td>${item.price}</td>
        <td> <img src='/images/${
          item.image
        }' style="width:50px"; height: 100px" /></td>
        <td><button class="btn btn-sm btn-dark update_image" id="${
          item.id
        }"><span class="glyphicon glyphicon-edit"></span>Update Image</button></td>
     
        <td><button class="btn btn-sm btn-primary edit" id="${
          item.id
        }"><span class="glyphicon glyphicon-edit"></span> Edit</button></td>
      </tr>`;
    });
    table += ` </tbody>
    </table>
  </div>
</div>
</div>
</div>
`;

    $("#result").html(table);
    $("#insertdiv").hide();
    $("#back").show();
    $("#result").show();
  }

  $("#back").click(function() {
    $("#insertdiv").show();
    $("#back").hide();
    $("#result").hide();
  });

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

  $("#result").on("click", ".update_image", function() {
    const id = $(this).attr("id");
    const result = products.find(item => item.id == id);
    update_report();
    $("#peid").val(result.id);
  });

  $("#result").on("click", ".edit", function() {
    const id = $(this).attr("id");

    const result = products.find(item => item.id == id);

    edit();
    $("#pid").val(result.id);
    $("#pname").val(result.name);
    $("#pprice").val(result.price);
    $("#pquantity").val(result.quantity);
  });

  $("#update").click(function() {
    let updateobj = {
      id: $("#pid").val(),
      name: $("#pname").val(),
      price: $("#pprice").val(),
      quantity: $("#pquantity").val()
    };
    $.post("/add_product/update", updateobj, function data() {
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

  function update() {
    $("#result").show();
    $("#editdiv").hide();
    $("#insertdiv").hide();
    $("#back1").show();
    $("#back").show();
    refresh();
  }

  function refresh() {
    $.getJSON(`add_product/all`, data => {
      makeTable(data);
    });
  }

  function edit() {
    $("#editdiv").show();
    $("#insertdiv").hide();
    $("#back").hide();
    $("#refresh").hide();
    $("#result").hide();
  }

  function update_report() {
    $("#editdiv").hide();
    $("#insertdiv").hide();
    $("#back").hide();
    $("#refresh").hide();
    $("#result").hide();
    $("#updateimgdiv").show();
  }

  $("#back1").click(function() {
    $("#editdiv").hide();
    $("#insertdiv").hide();
    $("#back").show();

    $("#result").show();
  });

  $("#back2").click(function() {
    $("#editdiv").hide();
    $("#updateimgdiv").hide();
    $("#insertdiv").hide();
    $("#back").show();

    $("#result").show();
  });
});
