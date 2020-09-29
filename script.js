$(document).ready(function() {
    const today = moment();
    currentDate = today.format("l");
    // console.log("");
    // console.log("currentDate", currentDate);
    // console.log("");
    $("#cdate").text(currentDate);

    function displayCityWeather(search,type) {
        console.log("");
        console.log("  IN displayCityWeather search:",search);

        if (type=="zip"){
            console.log(" the search is zipcode");
            var queryURL = `https://api.openweathermap.org/data/2.5/weather?zip=${(search)},us&units=imperial&appid=ba936e978e68dd024ee2931bbb340b72`;
        }else if (type=="citystate"){
            console.log("the search is city,state")
            var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${(search)},us&units=imperial&appid=ba936e978e68dd024ee2931bbb340b72`;
        }
        console.log("");

        // var city = $(this).attr("data-city");

        $("#date").text(currentDate);
        var currentIcon2 = "";
        var lat = "";
        var lon = "";
        
        console.log("queryURL 1: ", queryURL);

        $("#cIcon").text(currentIcon2);

       // Creating an AJAX call for the specific city button being clicked
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
            console.log("")
            // console.log("queryURL1", queryURL);
            console.log("   response 1:    ", response);
            // console.log("   lat and lon:  "+ lat +" : "+lon);
            // console.log("   temp Farhenheit:  ", response.main.temp);
            // console.log("   TEMP max:  ", response.main.temp_max+"˚F");
            // console.log("   TEMP low:  ", response.main.temp_min+"˚F");
            // console.log("   HUMIDITY:  ", response.main.humidity+"%");
            // console.log("   windspeed:  ", response.wind.speed+"mph");
            // console.log("");
            $("#cCity").text(city);
            $("#cHigh").text("High: "+cHigh);
            $("#cLow").text("Low: "+cLow);
            $("#cHum").text("Humidity: "+cHum);


            console.log("");
            var queryURL2 = "https:api.openweathermap.org/data/2.5/onecall?appid=ba936e978e68dd024ee2931bbb340b72&lat="+lat+"&lon="+lon+"&exclude=hourly,minutely&units=imperial";
            console.log("queryURL2: ",queryURL2);

            $.ajax({
                url: queryURL2,
                method: "GET"
            }).then(function(response) {

                var r2 = response;
                console.log("    response 2:   ",r2);
                var currentTemp2 = r2.current.temp+"˚F";
                currentIcon2 = r2.current.weather[0].icon;
                var tempFeel2 = r2.current.feels_like+"˚F";
                var uvIndex2  = r2.current.uvi;
                var windSpeed2 = r2.current.wind_speed+"MPH";
                // console.log("");
                // console.log("========= Current Temp =========");
                // console.log("  response2 TEMP Fahrenheit: ", currentTemp2+"˚F");
                // console.log("  response2 icon: ", currentIcon2);
                // console.log("  response2.main.FEELS_LIKE:  ",tempFeel2+"˚F");
                // console.log("  response2.current.UVI:  ",uvIndex2);
                // console.log("  response2.current.WIND_SPEED:  ",windSpeed2+"MPH");
                // console.log("");
                // console.log("========= Forecasts  =========");
                $("#cTemp").text("Temperature: "+currentTemp2);
                $("#cIcon").text(currentIcon2);
                $("#cFeels").text("Feels Like: "+tempFeel2);
                $("#cUV").text("UV Index: "+uvIndex2);
                $("#cWind").text("Wind Speed: "+windSpeed2);
                $("#forecast-title").text("Your 5 Day Forecast");

                // console.log(r2.daily);

                // Get the 5 Day forecast and display it
                var a = moment();
                for (var i = 0; i<5; i++){
                    var fDay = r2.daily[i].temp.day+"˚F";
                    var fNight = r2.daily[i].temp.night+"˚F";
                    var fHum = r2.daily[i].humidity+"%";
                    var fIcon = r2.daily[i].weather[0].icon;
                    // var a = today.add(1,'day');
                    // var b = a.format("l");
                    
                    var b = a.add(1,'day');

                    console.log("");
                    // console.log("today:  "+today,"   a:  "+ a, "   b:  "+b);
                    // console.log("todya.format('l')" +today.format("l"), "a:  "+ a.format("l"), "  b:  "+b.format("l"));


                    // console.log("today: "+ today.format("l"), "  a: "+ a, "  b: "+b);

                    // console.log("today: "+ today.add(1,day).format("l"));
                    console.log("Day: ",i);
                    console.log("TEMP DAY: ",fDay);
                    console.log("TEMP NIGHT: ",fNight);
                    console.log("Humidity: ",fHum);
                    console.log("icon: ",fIcon);
                    // console.log("a.format('l')   ",a.format("l"));


                    $("#fDate"+i).text(b.format("l"));
                    $("#fIcon"+i).text(fIcon);
                    $("#fD"+i).text("Day: "+fDay);
                    $("#fN"+i).text("Night: "+fNight);
                    $("#fHum"+i).text("Humidity: "+fHum);
                };
            });

        });
        console.log("  ===== END OF DISPLAY WEATHER =====  ");
        console.log("");

    };

    //// Add the searched cities to the list ////
    function renderCities(){

        console.log("");
        console.log("  ===== IN RENDER CITIES ===== ");

        $("#city-list").empty(); // Clear the city list so that duplicates do not appear when adding new cities
        var citiesArrLoc = JSON.parse(localStorage.getItem("city-searches"));
        console.log("citiesArrLoc:   ", citiesArrLoc);

        if (!citiesArrLoc){
            return
        }

        for (var i=0; i< citiesArrLoc.length; i++){
            console.log("citiesArr i: ",citiesArrLoc[i]);
            var list = $("<a class='city-item list-group-item list-group-item-action list-group-item-dark'>");
            
            list.attr("data-city",citiesArrLoc[i].searchValue);
            if (citiesArrLoc[i].searchType=="zip"){
                list.text(citiesArrLoc[i].name);
            }else if (citiesArrLoc[i].searchType=="citystate"){
                list.text(citiesArrLoc[i].searchValue)
            }
        

            $("#city-list").append(list);
        };

        console.log("");
    };



    //// Search button is clicked ////
    $("#city-search").on("click", function(event) {
    event.preventDefault();
    var zipCode = $("#zip").val().trim();
    var city = $("#city").val().trim();
    var state = $("#state-select").val();
    var cityState = "";
    console.log("");
    console.log("  ==== IN SEARCH CLICK ====");
    console.log(city);
    console.log(state);
    console.log("");

        if (zipCode==="" && city===""){
            console.log("  **** NOTHING IN THE ZIPCODE CITY SEARCH FIELDS ****")
            return
        }else if (city!="" && state=="Select a State"){
            console.log(" city is populated state are empty ")
            return

        } else if (zipCode !=""){
            console.log("zipCode:   ",zipCode);
            document.getElementById('zip').value = ''; // Clear out the ZIP Code input after search is clicked

            // Save the zip code search to localStorage, but first get the city name with an ajax call
            var queryURL = `https://api.openweathermap.org/data/2.5/weather?zip=${(zipCode)},us&units=imperial&appid=ba936e978e68dd024ee2931bbb340b72`;
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(response) {
                
                var name = response.name;
                console.log("name in zipcode save city in search click:         ", name);
                
                console.log("name", name);
                
            // Save the zip code search to localStorage. 
            // (type: "zip", value: "23112", name: {name returned for zipcode search only}) 
            saveSearch("zip", zipCode, name); 
            });
            

            // Search city weather using the zipcode
            displayCityWeather(zipCode,"zip");

        }else if (state!="" && state !="Select a State"){

            console.log("    city: " + city, " || state: ", state);
            
            cityState = `${(city)}, ${(state)}`;

            console.log("cityState:    ",cityState);

            // Save the city, state search to localStorage. 
            // (type: "citystate", value: "Richmond, VA", name: not needed for city,state search) 
            saveSearch("citystate",cityState);

            // Clear out city and State
            document.getElementById('city').value = '';
            document.getElementById('state-select').value = 'Select a State';

            // Search for city weather using city, state
            displayCityWeather(cityState,"citystate");
        }


        var delayInMilliseconds = 100; //1 second
        setTimeout(function() {
            console.log("     in setTimeout     ");
          renderCities();
        }, delayInMilliseconds);
    
    
    });
    

    //// Add click event listener for the city list to target the class "city-item" ////
    $(document).on("click", ".city-item", function(){
        var search = $(this).attr("data-city");
        console.log(" ");
        console.log("  ===IN CLICK LIST===  ");
        console.log(search);
        console.log("search:  ", search);
        console.log("search typeof:  ", typeof parseInt(search));

        if (isNaN( parseInt(search))==false){
            displayCityWeather(search, "zip");
        } else{
            displayCityWeather(search, "citystate");
        }

    });


    //// Save the city search to localStorage ////
    function saveSearch(type, value, name){

        console.log("");
        console.log("");
        console.log("==== IN SAVE SEARCH TO LOCAL ====");

        console.log('     type:  '+type, '  value:  '+value,'  name:  '+name);

        // Data from local storage
        var citiesArrLoc = JSON.parse(localStorage.getItem("city-searches")) || [];

        console.log("    citiesArrLoc", citiesArrLoc);

        // Current City Search to add
        var cSearchObj = {
            searchType: type,
            searchValue: value,
            name: name
        };

        
        if (citiesArrLoc!=0){
            console.log("   *** citiesArrLoc is NOT empty ***   ");
            
            console.log("    citiesArrLoc.searchValue[0]: ",citiesArrLoc[0]);
            for (var i = 0; i < citiesArrLoc.length; i++) {
                
                console.log( citiesArrLoc[i]) ;
                if (citiesArrLoc[i].searchValue==value){
                    console.log("   This search value already exists   ")
                    return // Don't save the search if it already exists
                };
                
            };
        };

        // Add new city to the beginning of the array so that appears first in the list
        // when it rendered
        citiesArrLoc.unshift(cSearchObj);
        console.log("citiesArrLoc2", citiesArrLoc);
        localStorage.setItem("city-searches",JSON.stringify(citiesArrLoc));
        console.log("==== END SAVE SEARCH TO LOCAL ====");
        console.log("");
    };

    
    // function initialPageLoad(){
    //     var citiesArrLoc = JSON.parse(localStorage.getItem("city-searches")) || [];
    //     if (citiesArrLoc==0){
    //         console.log(" ");
    //         console.log(" IN THE INITIAL PAGE LOAD ");
    //         displayCityWeather("New York, New York", "citystate")
    //         console.log(" ");
    //     }else if(){

    //     };
        
        
        
    // };
    
    // initialPageLoad();


    var delayInMilliseconds = 100;
    setTimeout(function() {
        console.log("     in setTimeout     ");
        renderCities();
    }, delayInMilliseconds);
    
    
});
