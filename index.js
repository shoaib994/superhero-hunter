const url = 'https://superheroapi.com/api.php/2928355607286861';
const searchBox = document.getElementById('search');
const searchResultsContainer = document.getElementById('search-results-container');

// load event listeners
loadEventListeners();
function loadEventListeners(){
  searchBox.addEventListener('keyup', searchByName);
}

//name handle functionality
async function nameHandle(name){
  let data = await getApiResult(`${url}/search/${name}`);
  // redirect to super hero page if success
  if(data.response === 'success'){
    console.log(data);
    let path = `${window.location.pathname} + /../superhero.html#id=${data.results[0].id}`;
    window.open(path);  
  }
}

//  search functionality
async function searchByName(e){
  // trim the query name
  let name = e.target.value.trim();
  // check if user has hit enter in the search bar
  if(e.keyCode === 13 && name.length > 0){
    nameHandle(name);
  }
  if(name.length == 0){
    await cleanResults();
  }
  else{
    // fetch results
    let data = await getApiResult(`${url}/search/${name}`);
    if(data && data.response === 'success'){
      searchResultsContainer.innerHTML = "";
      let favs = getFavsHero();
      // create a list of elements for search results and add event listeners
      for(let i = 0; i < data.results.length; i++){
        let item = document.createElement('div');
        item.className = "search-item";
        item.setAttribute('id', `${data.results[i].id}`);

        let label = document.createElement('div');
        label.innerHTML = data.results[i].name;
        label.addEventListener('click', showHeroPage);
        item.appendChild(label);

        let option = document.createElement('div');
        if(favs.includes(data.results[i].id)){
          option.innerHTML = "Remove from favourites";
          option.addEventListener('click', removeHeroFromFavourites);  
        }
        else{
          option.innerHTML = "Add to favourites";
          option.addEventListener('click', addHeroToFavourites);  
        }
        item.appendChild(option);

        searchResultsContainer.appendChild(item);
      }
    }
    else{
      await cleanResults();
    }
  }
}

// get result from api
async function getApiResult (url) {
  try{
    let response = await fetch(url);
    let data = await response.json();
    return data;  
  }catch(err){
    await cleanResults();
  }
}

// clean search results
async function cleanResults(){
  let i = searchResultsContainer.childNodes.length;
  while(i--){
    searchResultsContainer.removeChild(searchResultsContainer.lastChild);
  }
}

// redirect to a super hero page with respective id
async function showHeroPage(e){
  let path = `${window.location.pathname} + /../superhero.html#id=${e.target.parentElement.id}`;
  window.open(path);
}

// add a hero to favourites
async function addHeroToFavourites(e){
  let id = e.target.parentElement.id;
  let favs = getFavsHero();
  if(!favs.includes(id)){
    favs.push(id);
  }
  localStorage.setItem('favHeros', JSON.stringify(favs));
  e.target.innerHTML = 'Remove from favourites';
  e.target.removeEventListener('click', addHeroToFavourites);
  e.target.addEventListener('click', removeHeroFromFavourites);
}

// remove a hero from favourites
async function removeHeroFromFavourites(e){
  let id = e.target.parentElement.id;
  let favs = getFavsHero();

  let updatedFavs = favs.filter(function(val){
    return val != id;
  })
  localStorage.setItem('favHeros', JSON.stringify(updatedFavs));
  e.target.innerHTML = 'Add to favourites';
  e.target.removeEventListener('click', removeHeroFromFavourites);
  e.target.addEventListener('click', addHeroToFavourites);
}

// retrieve a list of favourite hero id's from local storage
function getFavsHero(){
  let favs;
  if(localStorage.getItem('favHeros') === null){
    favs = [];
  }
  else{
    favs = JSON.parse(localStorage.getItem('favHeros'));
  }
  return favs; 
}