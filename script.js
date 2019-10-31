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

function removeResultElement(...args){
    args.forEach(element => {
        let elements = document.getElementsByClassName(element);
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    }); 
}

// function to create html tags and display searching results
let titleLabel = 'Title: ';
let relasedLabel = 'Released: ';
let runtimeLabel = 'Runtime: ';
let ratingsLabel = 'Ratings: ';
let plotLabel = 'Description: ';
function createResult(movieData, i){
    if(data.Search[i]){
        // check data exist
        let poster;
        let title;
        let awards;
        let released;
        let runtime;
        let ratings;
        let plot;
        movieData.Poster == 'N/A' || movieData.Poster == ''? poster = 'default_pic.png' : poster = movieData.Poster;
        movieData.Title == 'N/A' || movieData.Title == ''? title = 'No data' : title = movieData.Title;
        movieData.Awards == 'N/A' || movieData.Awards == ''? awards = '' : awards = 'Awarded';
        movieData.Released == 'N/A' || movieData.Released == ''? released = 'No data' : released = movieData.Released;
        movieData.Runtime == 'N/A' || movieData.Runtime == ''? runtime = 'No data' : runtime = movieData.Runtime;
        movieData.Ratings[0]? ratings = movieData.Ratings[0].Value : ratings = 'No data';
        movieData.Plot == 'N/A' || movieData.Plot == ''? plot = 'No data' : plot = movieData.Plot;

        // cut description to 100 characters
        let dots = '...';
        plot.length > 100? plot = plot.slice(0,100).concat(dots) : plot;

        // create html elements and put data
        let result = document.createElement('div');
        result.setAttribute('class', 'result');
        searchResult.appendChild(result);

        let imgResult = document.createElement('img');
        imgResult.setAttribute('src', poster);
        imgResult.setAttribute('class', 'movieImage');
        result.appendChild(imgResult);

        addResultElement('h3', 'title', titleLabel+title, result);
        addResultElement('span', 'awards', awards, result);
        addResultElement('p', 'released', relasedLabel+released, result);
        addResultElement('p', 'runtime', runtimeLabel+runtime, result);
        addResultElement('p', 'ratings', ratingsLabel+ratings, result);
        addResultElement('p', 'plot', plotLabel+plot, result);
    }else{
        let result = document.createElement('div');
        result.setAttribute('class', 'result');

        let resultTitle = document.createElement('h3');
        resultTitle.setAttribute('class', 'resultNoData');

        searchResult.appendChild(result);
        result.appendChild(resultTitle);
        resultTitle.appendChild(document.createTextNode('No data'));
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
        subXhttp.open("GET", "movie"+i+".json", true);

        subXhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if(this.response){
                    movieData = JSON.parse(this.response);

                    // create html tags and display response data
                    createResult(movieData, i);                         
                }
            }
        }
        subXhttp.send();
    };
}

// search submit request
function submitRequest(){
    let movieTitle = document.getElementById('movieTitle').value;
    if(movieTitle !== ''){
        // reset values form previuos searching
        removeResultElement('result');
        pageNumber = 0;
        data = {'Error': 'No more data'};
        document.getElementById('sortMovies').options.selectedIndex = 0;
        document.getElementById('filterMovies').options.selectedIndex = 0;
        document.getElementById('filterMoviesFrom').options.selectedIndex = 0;
        document.getElementById('filterMoviesTo').options.selectedIndex = 0;

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
                document.getElementById('sortMovies').options.selectedIndex = 0;
                document.getElementById('filterMovies').options.selectedIndex = 0;
                document.getElementById('filterMoviesFrom').options.selectedIndex = 0;
                document.getElementById('filterMoviesTo').options.selectedIndex = 0;
                getMoviesDetails(displayResultCount, data, pageNumber, moviesCount);
            }
        };
    }
}, 1000);

// sort function
function sortMovies(){
    // get sort type from input list
    let sortType = document.getElementById('sortMovies').value;

    // get all movies from actual responses
    let movies = document.getElementsByClassName('result');
    
    // set movie class to define all movies as objects
    class Movie {
        constructor(i) {
          this.poster = movies[i].children[0].src;
          this.title = movies[i].children[1].innerHTML.substring(titleLabel.length);
          this.awards = movies[i].children[2].innerHTML;
          this.released = movies[i].children[3].innerHTML.substring(relasedLabel.length);
          this.date = new Date(this.released).toISOString();
          this.runtime = movies[i].children[4].innerHTML.substring(runtimeLabel.length);
          this.ratings = movies[i].children[5].innerHTML.substring(ratingsLabel.length);
          this.plot = movies[i].children[6].innerHTML.substring(plotLabel.length);
        }
      }

    // create array of actual movies
    let newMoviesList = [];
    for(let i=0; i < movies.length; i++){
        let newMovieObj = new Movie(i);
        newMoviesList.push(newMovieObj);
    }

    // function to render sorted movies
    function renderMovies(){
        let poster_s = document.getElementsByClassName('movieImage');
        let title_s = document.getElementsByClassName('title');
        let awards_s = document.getElementsByClassName('awards');
        let released_s = document.getElementsByClassName('released');
        let runtime_s = document.getElementsByClassName('runtime');
        let ratings_s = document.getElementsByClassName('ratings');
        let plot_s = document.getElementsByClassName('plot');
        for(let i=0; i < newMoviesList.length; i++){
            poster_s[i].src = newMoviesList[i].poster;
            title_s[i].innerHTML = titleLabel+newMoviesList[i].title;
            awards_s[i].innerHTML = newMoviesList[i].awards;
            released_s[i].innerHTML = relasedLabel+newMoviesList[i].released;
            runtime_s[i].innerHTML = runtimeLabel+newMoviesList[i].runtime;
            ratings_s[i].innerHTML = ratingsLabel+newMoviesList[i].ratings;
            plot_s[i].innerHTML = plotLabel+newMoviesList[i].plot;
        }
    }

    // sort movies depend of sort type
    switch (sortType) {
        case 'titleSort':
            newMoviesList.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
            renderMovies();
            break;
        case 'ratingSort':
            newMoviesList.sort((a,b) => (a.ratings > b.ratings) ? -1 : ((b.ratings > a.ratings) ? 1 : 0));
            renderMovies();
            break;
        case 'relaseDateSort':
            newMoviesList.sort((a,b) => (a.date > b.date) ? -1 : ((b.date > a.date) ? 1 : 0));
            renderMovies();
            break;
    }      
}

// setting sort type of sorting function
function addFilterElement(valueName, textNode, parentElement){
    let element = document.createElement('option');
    element.setAttribute('value', valueName);
    element.setAttribute('class', 'dynamicValue');
    parentElement.appendChild(element);
    element.appendChild(document.createTextNode(textNode));
}
function setSortType(){
    // reset inputs to default values
    removeResultElement('dynamicValue');
    document.getElementById('filterMoviesFrom').options.selectedIndex = 0;
    document.getElementById('filterMoviesTo').options.selectedIndex = 0;

    // get sort type from input list
    let sortType = document.getElementById('filterMovies').value;
    let sortTypeFrom = document.getElementById('filterMoviesFrom');
    let sortTypeTo = document.getElementById('filterMoviesTo');
    let sortByRankingFromRange = 10;
    let sortByRankingToRange = 0;
    let sortByRelaseFromRange = 2019;
    let sortByRelaseToRange = 1970;

    // set list of "from" and "to" inputs
    switch (sortType) {
        case 'rankingFilter':
            for(let i = sortByRankingFromRange; i > sortByRankingToRange; i--){
                addFilterElement('from'+i, i, sortTypeFrom);
                addFilterElement('from'+i, i, sortTypeTo);
            }          
            break;
        case 'relaseYearFilter':
            for(let i = sortByRelaseFromRange; i > sortByRelaseToRange; i--){
                addFilterElement('from'+i, i, sortTypeFrom);
                addFilterElement('from'+i, i, sortTypeTo);
            }   
            break;
    } 
}

// filter function
function filterMovies(){

    // get all movies from actual responses
    let movies = document.getElementsByClassName('result');
    console.log(movies);
}