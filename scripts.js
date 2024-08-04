const userTab = document.querySelector("[data-userWeather]");
const searchTab =document.querySelector("[data-searchWeather]");
const userweatherContainer = document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchWeatherForm = document.querySelector("[data-searchform]");

const loadingScreen =document.querySelector(".loading-container");
const userInfoWeather =document.querySelector(".user-info-container");
const grantaccessBtn=document.querySelector("[data-grantAccessbtn]");
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
let currentTab= userTab;
currentTab.classList.add("current-tab");
getfromSessionStorage();// Checking if coordinates are stored in local storage or not


function switchtab(clickedTab){
    if(clickedTab!=currentTab){
    currentTab.classList.remove("current-tab");  
    currentTab=clickedTab;
    currentTab.classList.add("current-tab");
        console.log(switchtab);
    if(!searchWeatherForm.classList.contains("active")){
        //If we clicked on search weather tab and it does not contain the active class then make search form visible
        userInfoWeather.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchWeatherForm.classList.add("active");
    }

    else{
        //If we clicked on your weather tab then remove search weather form and old weather data
        searchWeatherForm.classList.remove("active");
        userInfoWeather.classList.remove("active");
        //from this we get coordinates for your weather from local storage
        getfromSessionStorage();
    }
    }
}
userTab.addEventListener('click',()=>{
    // Passing userTab as parameter because the user tab is selected first
    switchtab(userTab);
});

searchTab.addEventListener('click',()=>{
    // Passing userTab as parameter because the user tab is selected first
    switchtab(searchTab);
});

//check if coordinates are already present at local storage
function getfromSessionStorage(){
 const localcoordinates =sessionStorage.getItem("user_coordinates");
 if(!localcoordinates){
    //If local coordinates are not present 
    grantAccessContainer.classList.add("active");
 }

 else{
   const coordinates = JSON.parse(localcoordinates);
   fetchuserWeather(coordinates);
 }
}

async function fetchuserWeather(coordinates){
    const { latitude,longitude } = coordinates;
    console.log(coordinates);
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active")
try{
    let getData = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    let response = await getData.json();
    loadingScreen.classList.remove("active");
    userInfoWeather.classList.add("active");
    renderWeatherInfo(response);
}
catch(e){
    loadingScreen.classList.remove("active");
    console.log(e);
    alert('Not Found');
}
}

function renderWeatherInfo(response){
    const cityName =document.querySelector("[data-cityname]");
    const countryIcon=document.querySelector("[data-countryicon]");
    const weatherDesc=document.querySelector("[data-weatherDesc]");
    const weatherIcon= document.querySelector("[weather-icon]");
    const weatherTemp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");


    //fetching data from weatherinfo object and adding on UI
    cityName.innerText=`${response?.name}`;
    countryIcon.src = `https://flagcdn.com/144x108/${response?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = response?.weather?.[0]?.description 
    weatherIcon.src = `https://openweathermap.org/img/w/${response?.weather?.[0]?.icon}.png`;
    weatherTemp.innerText=`${response?.main?.temp} °C`;
    windspeed.innerText=`${response?.wind?.speed} m/s`;
    humidity.innerText=`${response?.main?.humidity} %`;
    cloudiness.innerText=`${response?.clouds?.all} %`;
}


grantaccessBtn.addEventListener("click",getLocation);

function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
          console.log('error');
    }
}

function showPosition(position){
    let user_coordinates={
         latitude:position.coords.latitude,
         longitude:position.coords.longitude,
    };
sessionStorage.setItem("user_coordinates",JSON.stringify(user_coordinates));
fetchuserWeather(user_coordinates);
    // console.log(latitude);
    // console.log(longitude);
}

const searchInput=document.querySelector("[data-searchinput]");
searchWeatherForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(searchInput.value==="") return;

    fetchsearchWeather(searchInput.value);
});

async function fetchsearchWeather(city){
    loadingScreen.classList.add("active");
    userInfoWeather.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try {
        let getData = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        let response = await getData.json();
        loadingScreen.classList.remove("active");
        userInfoWeather.classList.add("active");
        renderWeatherInfo(response);
    
      } catch (e) {
        console.log("Error",e);
        alert('Not Found');
      }
}