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

                // set url request of all searched movies
                // data.Search.forEach(movie => {
                //     moviesUrl.push('http://www.omdbapi.com/?i='+movie.imdbID);
                // });

                let searchResult = document.getElementById('searchResult');

                data.Search.forEach(movie => {
                    let subXhttp = new XMLHttpRequest();
                    // let url = 'http://www.omdbapi.com/?apikey=6a2ecd76&i='+movie.imdbID;
                    // subXhttp.open("GET", url, true);
                    subXhttp.open("GET", "movie.json", true);
                    subXhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            if(this.response){
                                // let movieDetails = JSON.parse(this.response);
                               
                                // create html tags and display searched data
                                let result = document.createElement('div');
                                result.setAttribute('class', 'result');

                                let imgResult = document.createElement('img');
                                imgResult.setAttribute('src', movie.Poster);

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
                            
                            }
                            // else{
                            //     let movieData = {'error': 'brak danych'};
                            //     document.getElementById("request").innerHTML = data.error;
                            // }
                        }
                    }
                    subXhttp.send();
                   
                });

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

