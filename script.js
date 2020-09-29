$(document).ready(function() {
    const today = moment();
    currentDate = today.format("l");
    $("#cdate").text(currentDate);

    //// Use a search term (zip code or city+state) to query the OpenWeather api \\\\
    function displayCityWeather(search,type) {
        // Switch between a zip code search and a city+state search
        if (type=="zip"){
            var queryURL = `https://api.openweathermap.org/data/2.5/weather?zip=${(search)},us&units=imperial&appid=ba936e978e68dd024ee2931bbb340b72`;
        }else if (type=="citystate"){
            var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${(search)},us&units=imperial&appid=ba936e978e68dd024ee2931bbb340b72`;
        }

        $("#date").text(currentDate); // Display the current date on the page
        var currentIcon2 = "";
        var lat = "";
        var lon = "";
        $("#initial-load").text(""); // Clear out the text on the initial page load

        // Use nested AJAX calls to get the weater information from the OpenWeather API
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
            lat = response.coord.lat;
            lon = response.coord.lon;
            var cHigh = response.main.temp_max+"˚F";
            var cLow = response.main.temp_min+"˚F";
            var cHum = response.main.humidity+"%";
            var city = response.name;

            // Set the city name, temp high, temp low, and humidity
            $("#cCity").text(city);
            $("#cHigh").text("High: "+cHigh);
            $("#cLow").text("Low: "+cLow);
            $("#cHum").text("Humidity: "+cHum);

            var queryURL2 = "https:api.openweathermap.org/data/2.5/onecall?appid=ba936e978e68dd024ee2931bbb340b72&lat="+lat+"&lon="+lon+"&exclude=hourly,minutely&units=imperial";

            // Use the lat and lon from the first AJAX to get the daily forecast    
            $.ajax({
                url: queryURL2,
                method: "GET"
            }).then(function(response) {

                var r2 = response;
                var currentTemp2 = r2.current.temp+"˚F";
                currentIcon2 = r2.current.weather[0].icon;
                var currentIcon2Desc = r2.current.weather[0].description;
                var tempFeel2 = r2.current.feels_like+"˚F";
                var uvIndex2  = r2.current.uvi;
                var windSpeed2 = r2.current.wind_speed+"MPH";
                var cIconSource = `http://openweathermap.org/img/wn/${(currentIcon2)}@2x.png`

                // Set the current temp, weather icon, feels like temp, uv index, and wind speed
                $("#cTemp").text("Temperature: "+currentTemp2);
                $("#cIcon").attr({"src": cIconSource, "alt": currentIcon2Desc});
                $("#cFeels").text("Feels Like: "+tempFeel2);
                $("#cUV").text("UV Index: "+uvIndex2);
                $("#cWind").text("Wind Speed: "+windSpeed2);
                $("#forecast-title").text("Your 5 Day Forecast");

                // Get the 5 Day forecast and display it
                var a = moment();
                for (var i = 0; i<5; i++){
                    var fDay = r2.daily[i].temp.day+"˚F";
                    var fNight = r2.daily[i].temp.night+"˚F";
                    var fHum = r2.daily[i].humidity+"%";
                    var fIcon = r2.daily[i].weather[0].icon;
                    var fIconDesc = r2.daily[i].weather[0].description;
                    var fIconSource = `http://openweathermap.org/img/wn/${(fIcon)}@2x.png`;                    
                    var b = a.add(1,'day');

                    // Display daily forecast information
                    $("#fDate"+i).text(b.format("l"));
                    $("#fIcon"+i).attr({"src":fIconSource, "alt":fIconDesc});
                    $("#fD"+i).text("Day: "+fDay);
                    $("#fN"+i).text("Night: "+fNight);
                    $("#fHum"+i).text("Humidity: "+fHum);
                };
            });

        });
    };

    //// Display the searched cities in the city list \\\\
    function renderCities(){

        $("#city-list").empty(); // Clear the city list so that duplicates do not appear when adding new cities
        
        // Get city list from localStorage
        var citiesArrLoc = JSON.parse(localStorage.getItem("city-searches"));

        // Exit out if there's nothingin localStorage
        if (!citiesArrLoc){
            return
        }

        // Iterate throught the city list, set the class and add the city name
        for (var i=0; i< citiesArrLoc.length; i++){
            var list = $("<a class='city-item list-group-item list-group-item-action list-group-item-dark'>");
            
            // Set only city name if it was a zipcode search, set city,state if city+state is use for search
            list.attr("data-city",citiesArrLoc[i].searchValue);
            if (citiesArrLoc[i].searchType=="zip"){
                list.text(citiesArrLoc[i].name);
            }else if (citiesArrLoc[i].searchType=="citystate"){
                list.text(citiesArrLoc[i].searchValue)
            }
        
            $("#city-list").append(list); // Add city to the list
        };
    };



    //// Search button is clicked \\\\
    $("#city-search").on("click", function(event) {
    event.preventDefault();
    var zipCode = $("#zip").val().trim();
    var city = $("#city").val().trim();
    var firstLetter = city.charAt(0);
    var restCity = city.slice(1);
        city = firstLetter.toUpperCase()+restCity;
    var state = $("#state-select").val();
    var cityState = "";

        // Make sure something is in the input fields
        if (zipCode==="" && city===""){
            return
        }else if (city!="" && state=="Select a State"){
            return

        } else if (zipCode !=""){
            document.getElementById('zip').value = ''; // Clear out the ZIP Code input after search is clicked

            // Save the zip code search to localStorage, but first get the city name with an ajax call
            var queryURL = `https://api.openweathermap.org/data/2.5/weather?zip=${(zipCode)},us&units=imperial&appid=ba936e978e68dd024ee2931bbb340b72`;
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(response) {
                
                var name = response.name;
                                
            // Save the zip code search to localStorage. 
            // (type: "zip", value: "23112", name: {name returned for zipcode search only}) 
            saveSearch("zip", zipCode, name); 
            });
            

            // Search city weather using the zipcode
            displayCityWeather(zipCode,"zip");

        }else if (state!="" && state !="Select a State"){
            
            cityState = `${(city)}, ${(state)}`;

            // Save the city, state search to localStorage. 
            // (type: "citystate", value: "Richmond, VA", name: not needed for city,state search) 
            saveSearch("citystate",cityState);

            // Clear out city and State
            document.getElementById('city').value = '';
            document.getElementById('state-select').value = 'Select a State';

            // Search for city weather using city, state
            displayCityWeather(cityState,"citystate");
        }

        // Add a slight wait to allow the city list to be populated
        var delayInMilliseconds = 100; //1 second
        setTimeout(function() {
          renderCities();
        }, delayInMilliseconds);
    });
    

    //// Click event listener for the city list to target the class "city-item" \\\\
    $(document).on("click", ".city-item", function(){
        var search = $(this).attr("data-city");

        // Determine what query to use depending on zip code or city+state search
        if (isNaN( parseInt(search))==false){
            displayCityWeather(search, "zip");
        } else{
            displayCityWeather(search, "citystate");
        }
    });


    //// Save the city search to localStorage \\\\
    function saveSearch(type, value, name){

        // Data from local storage
        var citiesArrLoc = JSON.parse(localStorage.getItem("city-searches")) || [];

        // Current city search to add
        var cSearchObj = {
            searchType: type,
            searchValue: value,
            name: name
        };

        // Do a check of cities in localStorage so that duplicates are not added
        if (citiesArrLoc!=0){
            for (var i = 0; i < citiesArrLoc.length; i++) {
                
                if (citiesArrLoc[i].searchValue==value){
                    return // Don't save the search if it already exists
                };  
            };
        };

        // Add new city to the beginning of the array so that appears first in the list
        // when it rendered
        citiesArrLoc.unshift(cSearchObj);
        localStorage.setItem("city-searches",JSON.stringify(citiesArrLoc));
    };

    //// Event listener to clear out searches \\\\
    $("#clear-searches").on("click", function(){

        // Data from local storage
        var citiesArrLoc = JSON.parse(localStorage.getItem("city-searches")) || [];

        if (citiesArrLoc!=0){
            localStorage.removeItem("city-searches");
            location.reload();
        }

    });

    // Add a delay to allow the city list to be populated
    var delayInMilliseconds = 100;
    setTimeout(function() {
        renderCities();
    }, delayInMilliseconds);
    
    
});
