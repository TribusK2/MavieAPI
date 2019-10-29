"use strict"

// function to create html tags to display searching results
function createResult(data, i){
    let result = document.createElement('div');
    result.setAttribute('class', 'result');

    let imgResult = document.createElement('img');
    imgResult.setAttribute('src', data.Search[i].Poster);

    let resultTitle = document.createElement('h3');
    resultTitle.setAttribute('class', 'resultTitle');

    let resultYear = document.createElement('h3');
    resultYear.setAttribute('class', 'resultYear');

    searchResult.appendChild(result);
    result.appendChild(imgResult);
    result.appendChild(resultTitle);
    resultTitle.appendChild(document.createTextNode(data.Search[i].Title));
    result.appendChild(resultYear);
    resultYear.appendChild(document.createTextNode(data.Search[i].Year));
}

// function to send request and get movies details from respond
function getMoviesDetails(displayResultCount, data, pageNumber){
    for(let i = 0 + pageNumber * displayResultCount; i < displayResultCount + pageNumber * displayResultCount; i++){

        // create request for direct movie
        let subXhttp = new XMLHttpRequest();
        // let url = 'http://www.omdbapi.com/?apikey=6a2ecd76&i='+movie.imdbID;
        // let url = 'http://www.omdbapi.com/?apikey=6a2ecd76&i='+data.Search[i].imdbID;
        // subXhttp.open("GET", url, true);
        subXhttp.open("GET", "movie.json", true);

        subXhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if(this.response){
                    // create html tags and display response data
                    createResult(data, i);                         
                }
                // else{
                //     let movieData = {'error': 'brak danych'};
                //     document.getElementById("request").innerHTML = data.error;
                // }
            }
        }
        subXhttp.send();
    };
}


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
                    let moviesCount = Object.keys(data.Search).length;
                    
                    let searchResult = document.getElementById('searchResult');

                    let displayResultCount = 2;
                    let pageNumber = 0;

                    // display first results
                    getMoviesDetails(displayResultCount, data, pageNumber);

                    // display next result when scroll
                    window.onscroll = function() {
                        let scrollPosition = window.pageYOffset;
                        let resultHeight = searchResult.offsetHeight;
                        let windowHeight = window.innerHeight;

                        if(scrollPosition > resultHeight - windowHeight){
                            if(displayResultCount * pageNumber < moviesCount){
                                pageNumber += 1;
                                getMoviesDetails(displayResultCount, data, pageNumber);
                            }
                        };

                    };
                    // document.getElementById("request").innerHTML = data.Search[0].Title;
                    // document.getElementById("request").innerHTML = movies;
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

