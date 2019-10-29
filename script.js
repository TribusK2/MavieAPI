"use strict"

let displayResultCount = 2;
let pageNumber = 0;
let moviesCount;
let data = {'Error': 'No more data'};

function addResultElement(elementType, className, textNode, parentElement){
    let element = document.createElement(elementType);
    element.setAttribute('class', className);
    parentElement.appendChild(element);
    element.appendChild(document.createTextNode(textNode));
}

// function to create html tags to display searching results
function createResult(movieData, i){
    if(data.Search[i]){
        let result = document.createElement('div');
        result.setAttribute('class', 'result');
        searchResult.appendChild(result);

        let imgResult = document.createElement('img');
        imgResult.setAttribute('src', movieData.Poster);
        result.appendChild(imgResult);

        addResultElement('h3', 'title', 'Tytuł: '+movieData.Title, result);
        if(movieData.Awards !== 'N/A' && movieData.Awards !== ''){
            addResultElement('span', 'awards', 'Awarded', result);
        }
        addResultElement('p', 'released', 'Data produkcji: '+movieData.Released, result);
        addResultElement('p', 'runtime', 'Czas trwania: '+movieData.Runtime, result);
        addResultElement('p', 'ratings', 'Ranking: '+movieData.Ratings[0].Value, result);
        addResultElement('p', 'plot', 'Opis: '+movieData.Plot, result);
    }else{
        let result = document.createElement('div');
        result.setAttribute('class', 'result');

        let resultTitle = document.createElement('h3');
        resultTitle.setAttribute('class', 'resultNoData');

        searchResult.appendChild(result);
        result.appendChild(resultTitle);
        resultTitle.appendChild(document.createTextNode('Brak danych'));
    }
}

// function to send request and get movies details from response
function getMoviesDetails(displayResultCount, data, pageNumber, moviesCount, movieData){
    let counter;
    if (displayResultCount + pageNumber * displayResultCount < moviesCount){
        counter = displayResultCount + pageNumber * displayResultCount;
    }else{
        counter = moviesCount;
    }

    for(let i = 0 + pageNumber * displayResultCount; i < counter; i++){

        // create request for direct movie
        let subXhttp = new XMLHttpRequest();
        // let url = 'http://www.omdbapi.com/?apikey=6a2ecd76&i='+data.Search[i].imdbID;
        // subXhttp.open("GET", url, true);
        subXhttp.open("GET", "movie.json", true);

        subXhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if(this.response){
                    movieData = JSON.parse(this.response);
                    console.log(movieData);
                    // create html tags and display response data
                    createResult(movieData, i);                         
                }
            }
        }
        subXhttp.send();
    };
}

// submit request
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

                    if(data.Search){
                        moviesCount = Object.keys(data.Search).length;

                        let searchResult = document.getElementById('searchResult');

                        // display first results
                        getMoviesDetails(displayResultCount, data, pageNumber, moviesCount);
                    }else{
                        document.getElementById("request").innerHTML = data.Error;
                    }
                }
            }
        }
        document.getElementById("request").innerHTML = data.Error;
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
    if (didScroll) {
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