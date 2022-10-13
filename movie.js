const API_KEY = 'api_key=3bf2062158ceef4d3d00e940ebf38902';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+API_KEY;

const main = document.getElementById('main');
const form =  document.getElementById('formSearch');
const search = document.getElementById('search');

const prev = document.getElementById('prevPage')
const next = document.getElementById('nextPage')
const current = document.getElementById('currentPage')

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;


getMovie(API_URL);

function getMovie(url) {
  lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        if(data.results.length !== 0){
            showMovie(data.results);
            currentPage = data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = data.total_pages;

            current.innerText = currentPage;

            if(currentPage <= 1){
              prev.classList.add('disabled');
              next.classList.remove('disabled')
            }else if(currentPage>= totalPages){
              prev.classList.remove('disabled');
              next.classList.add('disabled')
            }else{
              prev.classList.remove('disabled');
              next.classList.remove('disabled')
            }


        }else{
            main.innerHTML= `<h1 class="no-results">No Results Found</h1>`
        }
       
    })

}

// Menampilkan movie
function showMovie(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const {title, poster_path, vote_average, release_date, overview, id} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
            
             <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">

            <div class="movieInfo">
                <div class="movieDetail">
                    <h3>${title}</h3>
                    <p class="movieDate">${release_date}</p>
                </div>
                
                <span class="${getColor(vote_average)}">${vote_average}</span>
                
            </div>

            <div class="overview">

                <h3>Overview</h3>
                ${overview}
                <br/> 
            </div>
        
        `
        main.appendChild(movieEl);

    })
}

function getColor(vote) {
    if(vote>= 8){
        return 'green'
    }else if(vote >= 5){
        return 'cream'
    }else{
        return 'red'
    }
}
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;
    if(searchTerm) {
        getMovie(searchURL+'&query='+searchTerm)
    }else{
        getMovie(API_URL);
    }

})
// Previous Page
prev.addEventListener('click', () => {
  if(prevPage > 0){
    pageCall(prevPage);
  }
})
// Next Page
next.addEventListener('click', () => {
  if(nextPage <= totalPages){
    pageCall(nextPage);
  }
})

function pageCall(page){
  let urlSplit = lastUrl.split('?');
  let queryParams = urlSplit[1].split('&');
  let key = queryParams[queryParams.length -1].split('=');
  if(key[0] != 'page'){
    let url = lastUrl + '&page='+page
    getMovie(url);
  }else{
    key[1] = page.toString();
    let a = key.join('=');
    queryParams[queryParams.length -1] = a;
    let b = queryParams.join('&');
    let url = urlSplit[0] +'?'+ b
    getMovie(url);
  }
}