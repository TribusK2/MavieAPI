"use strict"
function submitRequest(){
    let movieTitle = document.getElementById('movieTitle').value;
    if(movieTitle !== ''){
        const xhttp = new XMLHttpRequest();
        // xhttp.open("GET", "http://www.omdbapi.com/?apikey=6a2ecd76&t=Requiem+for+a+Dream&plot=full", true);
        xhttp.open("GET", "response.json", true);
        
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // document.getElementById("request").innerHTML = xhttp.responseText;
                var data = JSON.parse(this.response)
                document.getElementById("request").innerHTML = data.Title;
            
            }
        };
        
        xhttp.send();
    }else{
        document.getElementById('formMessage').innerHTML = "Podaj tytuł filmu";
    }
}
