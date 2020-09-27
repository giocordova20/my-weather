$(document).ready(function() {
    const today = moment();
    currentDate = today.format("l");
    console.log("");
    console.log("currentDate", currentDate);
    console.log("");
    $("#cdate").text(currentDate);//
    
    var citiesArr = []; // Array to hold cities that have been searched


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

        var city = $(this).attr("data-city");

        $("#date").text(currentDate);
        var currentIcon2="";
        var lat = "";
        var lon = "";
        
        console.log(queryURL);

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
            console.log("queryURL1", queryURL);
            console.log("   response first query", response);
            console.log("   lat and lon:  "+ lat +" : "+lon);
            console.log("   temp Farhenheit:  ", response.main.temp);
            console.log("   TEMP max:  ", response.main.temp_max+"˚F");
            console.log("   TEMP low:  ", response.main.temp_min+"˚F");
            console.log("   HUMIDITY:  ", response.main.humidity+"%");
            console.log("   windspeed:  ", response.wind.speed+"mph");
            console.log("");
            $("#cCity").text(city);
            $("#cHigh").text("High: "+cHigh);
            $("#cLow").text("Low: "+cLow);
            $("#cHum").text("Humidity: "+cHum);
            citiesArr.push(city);

            console.log("cities array",citiesArr);

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
                console.log("");
                console.log("========= Current Temp =========");
                console.log("  response2 TEMP Fahrenheit: ", currentTemp2+"˚F");
                console.log("  response2 icon: ", currentIcon2);
                console.log("  response2.main.FEELS_LIKE:  ",tempFeel2+"˚F");
                console.log("  response2.current.UVI:  ",uvIndex2);
                console.log("  response2.current.WIND_SPEED:  ",windSpeed2+"MPH");
                console.log("");
                console.log("========= Forecasts  =========");
                $("#cTemp").text("Temperature: "+currentTemp2);
                $("#cIcon").text(currentIcon2);
                $("#cFeels").text("Feels Like: "+tempFeel2);
                $("#cUV").text("UV Index: "+uvIndex2);
                $("#cWind").text("Wind Speed: "+windSpeed2);

                console.log(r2.daily);

                // Get the 5 Day forecast and display it
                for (var i = 0; i<5; i++){
                    var fDay = r2.daily[i].temp.day+"˚F";
                    var fNight = r2.daily[i].temp.night+"˚F";
                    var fHum = r2.daily[i].humidity+"%";
                    var fIcon = r2.daily[i].weather[0].icon;
                    var a = today.add(1,'day');
                    var b = a.format("l");
                    
                    // console.log("Day: ",i);
                    // console.log("TEMP DAY: ",fDay);
                    // console.log("TEMP NIGHT: ",fNight);
                    // console.log("Humidity: ",fHum);
                    // console.log("icon: ",fIcon);
                    // console.log("a.format('l')   ",a.format("l"));


                    $("#fDate"+i).text(b);
                    $("#fIcon"+i).text(fIcon);
                    $("#fD"+i).text("Day: "+fDay);
                    $("#fN"+i).text("Night: "+fNight);
                    $("#fHum"+i).text("Humidity: "+fHum);
                };
            });
            renderCities();  
        });

    };

    //// Add the searched cities to the list ////
    function renderCities(){

        // Clear out cities before adding those in the array
        $("#city-list").empty();

        for (var i=0; i< citiesArr.length; i++){
            console.log("citiesArr i: ",citiesArr[i]);
            var list = $("<a class='city-item list-group-item list-group-item-action list-group-item-dark'>");
            list.attr("data-city",citiesArr[i]);
            list.text(citiesArr[i]);
            $("#city-list").append(list);

        };


    };

    // This function handles events when the search button is clicked
    $("#city-search").on("click", function(event) {
    event.preventDefault();
    var zipCode = $("#zip").val().trim();
    var city = $("#city").val().trim();
    var state = $("#state-select").val();
    var cityState = "";
    console.log("");
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
            console.log("zipCode:   ",zipCode)
            searchItem = zipCode
            displayCityWeather(zipCode,"zip");
        }else if (state!="" && state !="Select a State"){
            console.log("    city: " + city, " || state: ", state);
            cityState = `${(city)},${(state)}`
            displayCityWeather(cityState,"citystate");
        }
        console.log("  searchItem:", searchItem)

        // displayCityWeather(searchItem);
    
    // // Calling renderCities which adds the saved cities to the Cit List
    // renderCities();

    });
    
    // Add a click event listener for the city list. It targest the class "city-item"
    $(document).on("click", ".city-item", displayCityWeather);

});
