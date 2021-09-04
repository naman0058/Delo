let country = []
let state = []
let city = []

$('#signupdiv').hide()

$('#signup1').click(function(){
    $('#signupdiv').show()
    $('#logindiv').hide()
   
})

$('#signin1').click(function(){
    $('#signupdiv').hide()
    $('#logindiv').show()
   
});


$.getJSON(`/country/allcountry`, data => {
    country = data
    fillDropDown('countryid', data, 'Choose Country', 0)
})



$.getJSON(`/state/bycountry`, data => {
    state = data
    fillDropDown('stateid', [], 'Choose State', 0)
})

$('#countryid').change(() => {
    const filteredData = state.filter(item => item.countryid == $('#countryid').val())
    fillDropDown('stateid', filteredData, 'Choose State', 0)
})



$.getJSON(`/city/bystate`, data => {
    city = data
    fillDropDown('cityid', [], 'Choose City', 0)
})

$('#stateid').change(() => {
    const filteredData = city.filter(item => item.countryid == $('#countryid').val() && item.stateid == $('#stateid').val())
    fillDropDown('cityid', filteredData, 'Choose City', 0)
})



$('#signup').click(function(){


    if( $('#name').val()== "" || $('#name').val()== []  )
    {
        alert("Name is mandatory");
    }
    else if( $('#email').val()== "" || $('#email').val()== [] ) 
    {
        alert("Email is mandatory");
    }
    else if( $('#password').val()== "" || $('#password').val()== []  )
    {
        alert("Password is mandatory");
    }
   else if( $('#number').val()== "" || $('#number').val()== []  )
    {
        alert("Number is mandatory");
    }
    else if( $('#countryid').val()== "" || $('#countryid').val()== []  )
    {
        alert("Country is mandatory");
    }
    else if( $('#stateid').val()== "" || $('#stateid').val()== [] ) 
    {
        alert("State is mandatory");
    }
    else if( $('#cityid').val()== "" || $('#cityid').val()== [] ) 
    {
        alert("City is mandatory");
    }
   else{



    let insertobj = {
        name : $('#name').val(),
        email : $('#email').val(),
        password : $('#password').val(),
        number : $('#number').val(),
        countryid : $('#countryid').val(),
        stateid : $('#stateid').val(),
        cityid : $('#cityid').val(),
    }

    $.post('/lab_login/insert',insertobj,function(data){
        alert('Successfully');
    })
   }   
   
})

/*fill dropdown*/


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
  