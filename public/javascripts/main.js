$(document).ready(function(){
   
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

      window.location = '/resource/report/';
    });

    $.ajax({
        url: '/general/events',
        type: 'GET',
        success:function(data){
            data.events.results.forEach(event => {
               let eventDate =  new Date(event.date).getTime();

         
                // Update the count down every 1 second
                var x = setInterval(function() {

                    // Get today's date and time
                    var now = new Date().getTime();
    
                    // Find the distance between now and the count down date
                    var distance = eventDate - now;

                    // If the count down is finished, write some text
                    if (distance < 0) {
                        clearInterval(x);
                      
                        if(event._id){
                            $.ajax({
                                url: '/general/events/'+event._id,
                                type: 'put',
                                success:function(){
                                }
                            });
                        }
                    }
                    }, 1000);


                })    

       

            //wrapper.insertAdjacentElement("beforeend", template)
              
          },
        error:function(error) {
            console.log(error);
        }
        
        });

       


 if($("form")){    

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

  $("form").find('input[type=checkbox], input[type=radio]').each(function() {
    let checkRadioValue = $(this).val();
    if(checkRadioValue.length !== 0 &&   checkRadioValue !== "undefined"){
     $(this).prop('checked', true)
    }else{
     $(this).prop('checked', false) 
    }
 })


   
} 
  


if($("#userDisplacement")){ 

    $("#userDisplacement").submit(function(event) {

        let errorTexts = ""; 


        var checkNum = $('input[type=checkbox]:checked').length;
             
        if(checkNum !== 0){
            
        }else{
            errorTexts =  "Please select atleast one cause of displacement"

                $('.alrt').css('display', 'block')
                .addClass('alrt-error') 
                .append(`<span> ${errorTexts} </span>`)
                $('.alrt').focus();

           return false
     }
})

}


  //Registration form 
  if("#userRegister"){
      $("#userRegister").submit(function(event){

        $("#userRegister input[type=submit]").val("submitting...")
        $(`#userRegister input[type="submit"]`).prop("disabled", true)

          // event.preventDefault();

    if($('#confirm_password').val() !== $('#password').val()){
            $( `#confirm_password + .error-message`).css('display', 'block').html('Password does not match')
        
            return false;
        }else{

            $("#userRegister").submit();
    }

      })
  }

  const formlga = document.getElementById('lga');
  if(formlga){
  //State change function
  $( "#state" ).change(function() {
    $( "#lga #lga_loading" ).html("Loading...")
    let currentState = $(this).val()
        if(currentState ==="Federal"){
            currentState = "Federal Capital Territory"
        }
        if(currentState ==="Akwa"){
            currentState = "Akwa Ibom"
        }
        if(currentState ==="Cross"){
            currentState = "Cross River"
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
  }

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
//Start here
if($('.profile-switch')){
    $('.profile-switch').change(function(){
            if($(this).is(':checked')){
                $(this).val('on')
            }else{
                $(this).val('') 
            }
    })
}


//Handling input file change.
$('input[type=file]').change(function(e){
    let filename = e.target.files[0].name;
    let currentId =  e.target.id;
         $(`#${currentId} + label`).text(""+filename)
})
setTimeout(function () {
     $('#messages').fadeOut();
}, 5000)

//Deleting on registration
$('.remove').click( function(e){

   // $('.loader-container').css("display", 'block')
   // $('.loader').css("display", 'block')

    $(this).text("deleting...")
    $(this).prop("disabled", true)

    let dataId = $(this).data('id');
    let returnUrl = $(this).data('rurl');
    let submitUrl = $(this).data('submiturl');

    $.ajax({
        url: `${submitUrl}${dataId}` ,
        type: 'DELETE',
        success:function(response){
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

  //pagination
$('.paginate').click( function(e){

   $('.loader-container').css("display", 'block')
    $('.loader').css("display", 'block')
    e.preventDefault()

    let returnUrl = $(this).data('rurl');
    let submitUrl = $(this).data('submiturl');
   // let pageNum = parseInt($(this).data('page')) ;

     

    $.ajax({
        url: `${submitUrl}` ,
        type: 'get',
  
        success:function(response){
        },
    });
    window.location = returnUrl;
  });


  //Map section stats for displacement
  const mapId = document.getElementById("map");
  if(mapId){

    let mapData  = "";
    const mapboxAccessToken = "pk.eyJ1IjoieW91c291ZjkiLCJhIjoiY2tqYWs5NjVwMGJxODM0bWVxZHA4OG85dyJ9.fHFQxtkS4lomQJ3TKdQ1iw";
    const map = L.map('map').setView([9.0765, 7.3986], 6);
    let  mapBound =  null;
    let info = L.control()
    const attribution =
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const titleUrl ="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=" + mapboxAccessToken  //'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(titleUrl,{
        id: 'mapbox/light-v9',
        attribution,
        tileSize: 512,
        zoomOffset: -1
       
    });

       
  //map color for stats
  function getColor(d) {
    return d > 1000 ? '#588BAE' :
           d > 500  ? '#95C8D8' :
           d > 200  ? '#4682B4' :
           d > 100  ? '#57A0D3' :
           d > 50   ? '#0E4D92' :
           d > 20   ? '#111E6C' :
           d > 10   ? '#00539CFF' :
                      '#0063B2FF';
  }
  //Styling the map
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
 }

 //Adding hover event for layer
 function highlightFeature(e) {
    let layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        info.update(layer.feature.properties)
    }

    //Resetting map styling

    function resetHighlight(e) {
        mapBound.resetStyle(e.target);
        info.update();
    }

    //Click event that zoom to state
    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }


    //add the listeners on our state layers
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }

    tiles.addTo(map);

    //Don't forget to change data from mongodb ID
    axios.get("/displacement/")
    .then((response)=> {
      mapData = response.data.data
       mapBound = L.geoJson(mapData, {style: style, onEachFeature: onEachFeature}).addTo(map)
          map.fitBounds(mapBound.getBounds());

     })


     info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'stat-info'); // create a div with a class "stat-info"
        this.update();
        return this._div;
    };
       
    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>Nigeria Displacement Stats</h4>' +  (props ?
            '<b>' + props.admin1Name + '</b><br />' + props.totalDis + ' displaced '
            : 'Hover over a state');
    };

    info.addTo(map);

  }

 //Map report sections
 const mapIDReport = document.getElementById("mapReport");
 if(mapIDReport){

   let mapData  = "";
   const mapboxAccessToken = "pk.eyJ1IjoieW91c291ZjkiLCJhIjoiY2tqYWs5NjVwMGJxODM0bWVxZHA4OG85dyJ9.fHFQxtkS4lomQJ3TKdQ1iw";
   const map = L.map('mapReport').setView([9.0765, 7.3986], 6);
   let  mapBound =  null;
   let info = L.control()
   const attribution =
       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
   const titleUrl ="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=" + mapboxAccessToken  //'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
   const tiles = L.tileLayer(titleUrl,{
       id: 'mapbox/light-v9',
       attribution,
       tileSize: 512,
       zoomOffset: -1
      
   });

      
 //map color for stats
 function getColor(d) {
   return d > 10   ? '#00539CFF' :
                     '#0063B2FF';
 }
 //Styling the map
 function style(feature) {
   return {
       fillColor: getColor(feature.properties.density),
       weight: 2,
       opacity: 1,
       color: 'white',
       dashArray: '3',
       fillOpacity: 0.7
   };
}

//Adding hover event for layer
function highlightFeature(e) {
   let layer = e.target;

       layer.setStyle({
           weight: 5,
           color: '#666',
           dashArray: '',
           fillOpacity: 0.7,
           fillColor: 'white'
       });

       if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
           layer.bringToFront();
       }

       info.update(layer.feature.properties)
   }

   //Resetting map styling

   function resetHighlight(e) {
       mapBound.resetStyle(e.target);
       info.update();
   }

   //Click event that zoom to state
   function zoomToFeature(e) {
       map.fitBounds(e.target.getBounds());
   }


   //add the listeners on our state layers
   function onEachFeature(feature, layer) {
       layer.on({
           mouseover: highlightFeature,
           mouseout: resetHighlight,
           click: zoomToFeature
       });
   }

   tiles.addTo(map);

   //Don't forget to change data from mongodb ID
   axios.get("/displacement/")
   .then((response)=> {
     mapData = response.data.data
      mapBound = L.geoJson(mapData, {style: style, onEachFeature: onEachFeature}).addTo(map)
         map.fitBounds(mapBound.getBounds());

    })


    info.onAdd = function (map) {
       this._div = L.DomUtil.create('div', 'stat-info'); // create a div with a class "stat-info"
       this.update();
       return this._div;
   };
      
   // method that we will use to update the control based on feature properties passed
   info.update = function (props) {
       this._div.innerHTML = '<h4>Nigeria Displacement Stats</h4>' +  (props ?
           '<b>' + props.admin1Name + '</b><br />' + props.reports + ' displaced '
           : 'Hover over a state');
   };

   info.addTo(map);

 }


//Monitor section
$(".monitor-detail").mouseenter(function(e) {
    let currentId =  $(this).attr( 'id' );
    $(`#${currentId} > .monitor-detail-show`).css("display", "block")
    $(".monitor-detail-show").mouseleave(function() {
        $(this).css("display", "none")
    })
  })



if($("#counterDiv")){
    setInterval(()=>{
     // $("#counterDiv").load(location.href + " #counterDiv");
     }, 1000)
}
}); 
