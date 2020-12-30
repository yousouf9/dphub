$(document).ready(function(){
   
    const socket = io();

    $('.download').click( function(e){
        e.preventDefault();
      $(this).html("downloading...")
      $(this).prop("disabled", true)

      let $this = this;

      let dataId = $(this).data('id');
      $.ajax({
          url: '/resource/report/download/'+dataId,
          type: 'POST',
          success:function(data){
            $('.alrt').css('display', 'block')
                      .addClass('alrt-success') 
                      .append('<span> Download completed!</span>')
                      .focus();       
            $($this).html("download")  
          }
      });

     // window.location = '/resource/report/';
    });

    $.ajax({
        url: '/general/events',
        type: 'GET',
        success:function(data){
        let template = ''
            data.events.forEach(event => {

               let eventDate =  new Date(event.date).getTime();

         
                // Update the count down every 1 second
                var x = setInterval(function() {

                    // Get today's date and time
                    var now = new Date().getTime();
    
                    // Find the distance between now and the count down date
                    var distance = eventDate - now;
    
                    // Time calculations for days, hours, minutes and seconds
                    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
                    // Display the result in the element with id="demo"
                            template = `
                            <div class="font-weight-light"> ${event.title} </div>
                            <div class="d-flex justify-content-start text-center">
                                <div class="px-2">
                                    <h2 class="p-0 m-0 text-danger">${days}</h2>
                                    <p class="p-0 m-0">Days</p>
                                </div>
                                <div class="px-2">
                                    <h2 class="p-0 m-0 text-danger">${hours}</h2>
                                    <p class="p-0 m-0">Hours</p>
                                </div>
                                <div class="px-2">
                                    <h2 class="p-0 m-0 text-danger">${minutes}</h2>
                                    <p class="p-0 m-0">Minutes</p>
                                </div>
                                <div class="px-2">
                                    <h2 class="p-0 m-0 text-danger">${seconds}</h2>
                                    <p class="p-0 m-0">Seconds</p>
                                </div>
                            </div>
                            ` 
                            $('#date-countdown').html(template)
                    // If the count down is finished, write some text
                    if (distance < 0) {
                        clearInterval(x);
                      
                        $.ajax({
                            url: '/general/event/'+event._id,
                            type: 'DELETE',
                            success:function(){
                              console.log("Event removed");
                            }
                        });
                    }
                    }, 1000);


                })    

       

            //wrapper.insertAdjacentElement("beforeend", template)
              
          }
   
        });

   $( 'form' ).find( 'select, textarea, input' ).each(function(){ 
  
    if( ! $( this ).prop( 'required' )){
       // console.log("reeachinh here"); 
     } else {
       let $this = this
        $(this).blur(function() {

            let currentId =  $( $this ).attr( 'id' );
            if ( ! $( $this ).val() ) {
            
            

                $( `#${currentId} + .error-message`).css('display', 'block').html('This field is required')
                $($this).focus();
            }else{
                $( `#${currentId} + .error-message`).css('display', 'none')

            }


        })

    }


    $('#confirm_password').blur(function(){
        if($('#confirm_password').val() !== $('#password').val()){
            $( `#confirm_password + .error-message`).css('display', 'block').html('Password does not match')
        
        }
    }) 
    

  });
  //Registration form 
  if("#userRegister"){
      $("#userRegister").submit(function(event){
           event.preventDefault();

    if($('#confirm_password').val() !== $('#password').val()){
            $( `#confirm_password + .error-message`).css('display', 'block').html('Password does not match')
         return false;
        }else{

            $("#userRegister").submit();
    }

      })
  }

  const formlga = document.getElementById('lga');
  //State change function
  $( "#state" ).change(function() {
    $( "#lga #lga_loading" ).html("Loading...")
    console.log("State chnage");
    let currentState = $(this).val()
        if(currentState ==="Federal"){
            currentState = "Federal Capital Territory"
            console.log(currentState);
        }
        if(currentState ==="Akwa"){
            currentState = "Akwa Ibom"
            console.log(currentState);
        }
        if(currentState ==="Cross"){
            currentState = "Cross River"
            console.log(currentState);
        }

        axios.get("https://immense-ocean-91058.herokuapp.com/api/state/"+currentState)
        .then((response)=> {
            $( "#lga #lga_loading" ).html("select lga")
           response.data.result.lgas.forEach((lga)=>{
            formlga.insertAdjacentHTML('afterbegin', `<option value="${lga}">${lga}</option>`)
            })
       

        
        } )
        .catch(err => console.log(err))
    });


  const formState = document.getElementById('state');
  const formNation = document.getElementById('nationality');
  //#loading states
    if(formState){
        axios.get("https://immense-ocean-91058.herokuapp.com/api/states")
         .then((response)=> {
          let states = response.data.result.map((state)=>{
              return state.state
          })
         
          states.forEach(state =>{
                let value =""+ state;
                formState.insertAdjacentHTML('afterbegin', `<option value=${value}>${state}</option>`)
          })
    
          
         } )
         .catch(err => console.log(err))
    }

    //Loading Nations
    if(formNation){
        axios.get("https://immense-ocean-91058.herokuapp.com/api/countries")
         .then((response)=> {
          let countries = response.data.result.map((country)=>{
              return country.name
          })
         
          countries.forEach(country =>{
        
            formNation.insertAdjacentHTML('afterbegin', `<option value="${country}">${country}</option>`)
          })
    
          
         } )
         .catch(err => console.log(err))
    }




 //submitting Intership form

if($( 'form#internship, form#organisationForm, form#individualForm')){
    $( 'form#internship, form#individualForm, form#organisationForm' ).submit( function( event ) {
        event.preventDefault();
           const formId = event.target.id;

          $(`#${formId} input[type="submit"]`).val("submitting...")
          $(`#${formId} input[type="submit"]`).prop("disabled", true)
        //validate fields
        var fail = false;
        var fail_log = '';
        var name;
        let formData = new FormData();
        $( '#'+ formId).find( 'select, textarea, input' ).each(function(){
            name = $( this ).attr( 'name' );
            value = $( this ).val();

            if( ! $( this ).prop( 'required' )){
                if(name==="cv"){
                    formData.append(name,  $('#cv').files[0]) 
                }
                formData.append(name, value)
            } else {
                if ( ! $( this ).val() ) {
                    fail = true;
                    fail_log += name + " is required \n";
                }

                if(name==="cv"){
                    formData.append(name,  $('.cv')[0].files[0]) 
                }
                formData.append(name, value)

            }
        });

        //submit if fail never got set to true
        if ( ! fail ) {
            //process form here.
            // axios({
            //     method: 'post',
            //     url: '/application/intern',
            //     data: formData,
            //     headers: {'Content-Type': 'multipart/form-data' }
            //     })
            //     .then(function (response) {
            //         $('.alrt').css('display', 'block')
            //         .addClass('alrt-success') 
            //         .append(`<span>${response.data} Application Submitted!</span>`)
            //         .focus(); 

            //     })
            //     .catch(function (response) {
            //         //handle error
            //         $("#intern_submit").html("submit")
            //         $("#intern_submit").prop("disabled", false)  
            //         console.log(response);
            //     });
          // window.location = '/getinvoled/intern';
          
         // $(`#${formId} input[type="submit"]`).val("submit")
          //$(`#${formId} input[type="submit"]`).prop("disabled", false) 

          if($('#confirm, #oconfirm').is(':checked')) this.submit();
          
          
        } else {
        
            $('.alrt').css('display', 'block')
            .addClass('alrt-error') 
            .append(`<span> ${fail_log} </span>`)
            $('.alrt').focus();
             
            $(`#${formId} input[type="submit"]`).val("submit")
            $(`#${formId} input[type="submit"]`).prop("disabled", false) 
            return false
        }

});
}

//Sponsorship Organzation for

//Promoters/Sponsors forms switch
$("#organisation").change(function (e) {
    if($("#organisation").is(':checked')){
        $("#individual").prop('checked', false)
    
        $("#individualForm").css("display", "none")
        $("#organisationForm ").addClass("d-block").css("display", "block")           
     }
  
});

$("#individual").change(function (e) {
    if($("#individual").is(':checked')){
    $("#organisation").prop('checked', false)

    $("#organisationForm").removeClass("d-block").css("display", "none")
    
    $("#individualForm").removeClass("d-none").css("display", "block")
}

});
//Handling input file change.
$('input[type=file]').change(function(e){
    let filename = e.target.files[0].name;
    let currentId =  e.target.id;
         $(`#${currentId} + label`).text(""+filename)
    console.log($(`#${currentId} + label`));
})
setTimeout(function () {
     $('#messages').fadeOut();
}, 5000)

//Deleting on registration
$('.remove').click( function(e){

    $(this).text("deleting...")
    $(this).prop("disabled", true)

    let dataId = $(this).data('id');
    let returnUrl = $(this).data('rurl');
    let submitUrl = $(this).data('submiturl');

    console.log("What is wrong here!",submitUrl, "RURL", returnUrl);



    $.ajax({
        url: `${submitUrl}${dataId}` ,
        type: 'DELETE',
        success:function(){
            $(this).text("Delete")
            $(this).prop("disabled", false)
        },
        error:function() {
            $(this).text("Delete")
            $(this).prop("disabled", false) 
        }
    });
    window.location = returnUrl;
  });


  //Map section
  var mapboxAccessToken = "pk.eyJ1IjoieW91c291ZjkiLCJhIjoiY2tqYWs5NjVwMGJxODM0bWVxZHA4OG85dyJ9.fHFQxtkS4lomQJ3TKdQ1iw";
  var map = L.map('map').setView([9.077751, 8.6774567], 6);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
    attribution: "",
    tileSize: 512,
    zoomOffset: -1
    }).addTo(map);
}); 
