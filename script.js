"use strict"
function submitRequest(){
    let movieTitle = document.getElementById('movieTitle').value;
    if(movieTitle !== ''){
        // prepare data to url request
        let movieTitleUrl = movieTitle.split(' ').join('+');
        
        // create request
        let xhttp = new XMLHttpRequest();
        let url = "http://www.omdbapi.com/?apikey=6a2ecd76&t="+movieTitleUrl+"&plot=full";
        xhttp.open("GET", url, true);
        // xhttp.open("GET", "response.json", true);
        
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {            
                var data = JSON.parse(this.response)
                document.getElementById("request").innerHTML = data;
                document.getElementById("request2").innerHTML = this.response;
                
            }
        };
        
        xhttp.send();
    }else{
        document.getElementById('formMessage').innerHTML = "Podaj tytuł filmu";
    }
}
