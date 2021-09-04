let categories = []
let subcategories = []

$.getJSON(`category/all`, data => {
    categories = data
    fillDropDown('categoryid', data, 'Choose Category', 0)
  
})

$('#show').click(function(){
$.getJSON(`membership/all`, data => {
    subcategories = data
    makeTable(data)
  
})
})

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



$('.save').click(function(){
  if( $('#plan12').val() == [] || $('#plan12').val() == "" || $('#plan12').val() == null || $('#plan12').val() == "null" ) alert('Enter Subscription Plan for 12 months')
  else if( $('#plan6').val() == [] || $('#plan6').val() == "" || $('#plan6').val() == null || $('#plan6').val() == "null" ) alert('Enter Subscription Plan for 6 months')
  else if( $('#plan12price').val() == [] || $('#plan12price').val() == "" || $('#plan12price').val() == null || $('#plan12price').val() == "null" ) alert('Enter Final Price for 12 months')
  else if( $('#plan6price').val() == [] || $('#plan6price').val() == "" || $('#plan6price').val() == null || $('#plan6price').val() == "null" ) alert('Enter Final Price for 6 months')
  else{
      let insertobj = {
          categoryid : $('#categoryid').val(),
          plan12 : $('#plan12').val(),
          plan6 : $('#plan6').val(),
          plan12price : $('#plan12price').val(),
          plan6price : $('#plan6price').val(),
      }
      $.post('/membership/insert',insertobj,data=>{
          alert('Successfully Inserted...')
      })
  }
})


function makeTable(subcategories){
    let table = ` <div class="row">
    <div class="col-xl-12">
    <!-- Sorting -->
    <div class="form-group row d-flex align-items-center mb-5">
                                                         
    <div class="col-lg-12">
    <button type="button" id="back" class="btn btn-outline-secondary">BacK</button>
      </div>
</div>
        <div class="widget has-shadow">
       
    
       
            <div class="widget-body">
                <div class="table-responsive">
                    <table id="sorting-table" class="table mb-0">
                        <thead>
                            <tr>
                                <th>Category Name</th>
                                <th>12 Month Membership</th>
                                 <th>6 Month Membership</th>
                            
                                <th>Actions</th>
                               
                            </tr>
                        </thead>
                        <tbody>`
                        $.each(subcategories,(i,item)=>{

                      
                         table+=`<tr>
                         <td><span class="text-primary">${item.categoryname}</span></td>
                                <td><span class="text-primary">${item.plan12price} <s>${item.plan12}</s></span></td>
                                <td><span class="text-primary">${item.plan6price} <s>${item.plan6}</s></span></td>
                               <td class="td-actions">
                                    <a class="edits" id="${item.id}"><i class="la la-edit edit"></i></a>
                                    <a class="deleted" id="${item.id}"><i class="la la-close delete"></i></a>
                                </td>
                            </tr>`
                          
                        })
                          
                     table+=` </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!-- End Sorting -->
      
    </div>
</div>
<!-- End Row -->`
    $('#result').html(table)
    $('#insertdiv').hide()
    $('#result').show()
}


$('#result').on('click', '.deleted', function() {
    const id = $(this).attr('id')
    $.get(`membership/delete`,  { id }, data => {
        refresh()
    })
})



$('#result').on('click', '.edits', function() {
    const id = $(this).attr('id')
    const result = subcategories.find(item => item.id == id);
    fillDropDown('pcategoryid', categories, 'Choose Category', result.categoryid)
    $('#editdiv').show()
    $('#insertdiv').hide() 
    $('#result').hide()
    $('#pid').val(result.id)
    $('#pcategoryid').val(result.categoryid)
    $('#pplan12').val(result.plan12)
    $('#pplan12price').val(result.plan12price)
    $('#pplan6').val(result.plan6)
    $('#pplan6price').val(result.plan6price)

 })


 
$('#update').click(function(){  //data insert in database
    let updateobj = {
        id: $('#pid').val(),
        categoryid:$('#pcategoryid').val(),
        plan12 : $('#pplan12').val(),
        plan6 : $('#pplan6').val(),
        plan12price : $('#pplan12price').val(),
        plan6price : $('#pplan6price').val(),
      
    }

    $.post(`membership/update`, updateobj , function(data) {
       update()
    })
})


$('#result').on('click', '.updateimage', function() {
    const id = $(this).attr('id')
    const result = subcategories.find(item => item.id == id);
    $('#peid').val(result.id)
})


function refresh() 
{
    $.getJSON(`/membership/all`, data => makeTable(data))
}
function update()
{
    $('#result').show()
    $('#editdiv').hide()
    $('#insertdiv').show() 
    refresh()
    refresh()
}

//================================Page Functionality=============================//
$('#editdiv').hide()
$('#updateimagediv').hide()

$('#result').on('click', '#back', function() {
    $('#result').hide()
    $('#insertdiv').show()
})

$('#back1').click(function(){
    $('#result').show()
    $('#insertdiv').hide()
    $('#editdiv').hide()
    $('#updateimagediv').hide()

})

$('#back2').click(function(){
    $('#result').show()
    $('#insertdiv').hide()
    $('#editdiv').hide()
    $('#updateimagediv').hide()
})

$('#result').on('click', '.updateimage', function() {
    $('#updateimagediv').show()
    $('#result').hide()
    $('#insertdiv').hide()
    $('#editdiv').hide()
})
