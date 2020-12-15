
window.onload = init;

function init(){

    let isvalidForm={
        valid: false,
        error: ''
    }

    let internshipForm = ""
    if(document.internship){
        internshipForm =   document.internship.elements;
    }


    for(let i= 0; i<internshipForm.length; i++){
        if(internshipForm[i].classList.contains('required')){
            internshipForm[i].addEventListener('blur', handleBlur);
            internshipForm[i].addEventListener('focus', handleFocus);
        }
    }


    function handleBlur(e) {
        if(e.target.value === ''){
        
            e.target.parentElement.setAttribute("id", 'elementBody')
            let errorElement = document.createElement("label");
                errorElement.setAttribute("id","currentError");
                errorElement.classList.add('label-error')
                errorElement.style.display="block"
            let errorText = document.createTextNode("This field is required");
            errorElement.appendChild(errorText);
            
            let element = document.getElementById("elementBody");
            element.appendChild(errorElement)
    
            isvalidForm.valid=false
            isvalidForm.error="Please fill in all required fields"
        }
        e.target.parentElement.setAttribute("id", '')
        if(document.getElementsByClassName('label-error')){
            let removeError = document.getElementsByClassName('label-error')[0]
             console.log(removeError);
        }

         isvalidForm[e.target.name]=e.target.value    
    
    }
    
    function handleFocus(e) {
        
        
    }

  console.log(isvalidForm);
}

