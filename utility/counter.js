const countDown = (data) => {

    let eventDate =  new Date(data.date).getTime();


    var now = new Date().getTime();
    
    // Find the distance between now and the count down date
    var distance = eventDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
            template = {
                days,
                hours,
                minutes,
                seconds
            }

    return template;
  }
  
  module.exports.countDown = countDown;