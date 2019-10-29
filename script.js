"use strict"

let displayResultCount = 2;
let pageNumber = 0;
let moviesCount;
let data;

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

// function to send request and get movies details from response
function getMoviesDetails(displayResultCount, data, pageNumber, moviesCount){
    let counter;
    if (displayResultCount + pageNumber * displayResultCount < moviesCount){
        counter = displayResultCount + pageNumber * displayResultCount;
    }else{
        counter = moviesCount;
    }

    for(let i = 0 + pageNumber * displayResultCount; i < counter; i++){

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
                else{
                    // let movieData = {'error': 'brak danych'};
                    console.log('aaa');
                    document.getElementById("request").innerHTML = 'brak danych';
                }
            }
        }
        subXhttp.send();
        console.log(i);
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
                    data = JSON.parse(this.response);
                    moviesCount = Object.keys(data.Search).length;
                    
                    let searchResult = document.getElementById('searchResult');

                    // display first results
                    getMoviesDetails(displayResultCount, data, pageNumber, moviesCount);

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

// display next result when scroll
var didScroll = false;
window.onscroll = function() {
        didScroll = true;       
};

setInterval(function() {
    if ( didScroll ) {
        didScroll = false;
        let scrollPosition = window.pageYOffset;
        let documentHeight = document.documentElement.scrollHeight;
        let windowHeight = window.innerHeight;

        if(scrollPosition > documentHeight - windowHeight - 1){
            if(displayResultCount * pageNumber < moviesCount){
                pageNumber += 1;
                getMoviesDetails(displayResultCount, data, pageNumber, moviesCount);
            }
        };
    }
}, 1000);