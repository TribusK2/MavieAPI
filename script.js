"use strict"
function submitRequest(){
    let movieTitle = document.getElementById('movieTitle').value;
    if(movieTitle !== ''){
        // prepare data to url search request
        let movieTitleUrl = movieTitle.split(' ').join('+');
        
        // create search request
        let xhttp = new XMLHttpRequest();
        // let url = "http://www.omdbapi.com/?apikey=6a2ecd76&s="+movieTitleUrl+"&type=series";
        // xhttp.open("GET", url, true);
        xhttp.open("GET", "response.json", true);
        
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

                if(this.response){
                
                // decode response
                let data = JSON.parse(this.response);

                // create html tags and display searched data
                let searchResult = document.getElementById('searchResult');
                data.Search.forEach(movie => {
                    let result = document.createElement('div');
                    result.setAttribute('class', 'result');

                    let imgResult = document.createElement('img');
                    imgResult.setAttribute('src', 'resimg.jpg');

                    let resultTitle = document.createElement('h3');
                    resultTitle.setAttribute('class', 'resultTitle');

                    let resultYear = document.createElement('h3');
                    resultYear.setAttribute('class', 'resultYear');

                    let moreButton = document.createElement('button');
                    moreButton.setAttribute('class', 'moreButton');

                    searchResult.appendChild(result);
                    result.appendChild(imgResult);
                    result.appendChild(resultTitle);
                    resultTitle.appendChild(document.createTextNode(movie.Title));
                    result.appendChild(resultYear);
                    resultYear.appendChild(document.createTextNode(movie.Year));
                    result.appendChild(moreButton);
                    moreButton.appendChild(document.createTextNode('Więcej'));
                });

                // document.getElementById("request").innerHTML = data.Search[0].Title;
                // document.getElementById("request2").innerHTML = this.response;
                }else{
                    let data = {'error': 'brak danych'};
                    document.getElementById("request").innerHTML = data.error;
                }
            }
        };
        
        
        xhttp.send();
    }else{
        document.getElementById('formMessage').innerHTML = "Podaj tytuł filmu";
    }
}
