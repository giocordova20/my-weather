

      function displayCityWeather() {

        var city = $(this).attr("data-city");
        city = "New York City,NY,US";
        tempUnit = "imperial"; // Farhenheit
        var lat = "";
        var lon = "";
        var queryURL1 = "https:api.openweathermap.org/data/2.5/weather?appid=ba936e978e68dd024ee2931bbb340b72&q="+city+"&units=imperial";
        // https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
        // api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={API key}
        //api.openweathermap.org/data/2.5/weather?zip=94040,us&appid={API key}


       // Creating an AJAX call for the specific city button being clicked
        $.ajax({
          url: queryURL1,
          method: "GET"
        }).then(function(response) {
            lat = response.coord.lat;
            lon = response.coord.lon;
            console.log("")
            console.log("queryURL1", queryURL1);
            console.log("   response first query", response);
            console.log("   lat and lon:  "+ lat +" : "+lon);
            console.log("   temp Farhenheit:  ", response.main.temp);
            console.log("   temp max:  ", response.main.temp_max);
            console.log("   tem low:  ", response.main.temp_min);
            console.log("   humidity:  ", response.main.humidity);
            console.log("   windspeed:  ", response.wind.speed+"mph");
            console.log("");
            var queryURL2 = "https:api.openweathermap.org/data/2.5/onecall?appid=ba936e978e68dd024ee2931bbb340b72&lat="+lat+"&lon="+lon+"&exclude=hourly,minutely&units=imperial";
            console.log("queryURL2:   ",queryURL2);

            $.ajax({
                url: queryURL2,
                method: "GET"
            }).then(function(response) {
                var r2 = response;
                console.log("    response 2:   ",r2);
                var currentTemp2 = r2.current.temp;
                var currentHum2 = r2.current.humidity;
                var tempFeel2 = r2.current.feels_like;
                var uvIndex2  = r2.current.uvi;
                var windSpeed2 = r2.current.wind_speed;
                console.log("");
                console.log("========= Current Temp =========");
                console.log("  response2 TEMP Fahrenheit: ", currentTemp2);
                console.log("  response2 HUMIDITY: ", currentHum2);
                console.log("  response2.main.feels_like:  ",tempFeel2);
                console.log("  response2.current.UVI:  ",uvIndex2);
                console.log("  response2.current.WIND_SPEED:  ",windSpeed2);
                console.log("");
                console.log("========= Forecasts  =========");
                console.log(r2.daily);
                for (var i = 0; i<r2.daily.length; i++){
                    console.log("TEMP MAX: ",r2.daily[i].temp.max);
                    console.log("TEMP MIN: ",r2.daily[i].temp.min);
                    console.log("Humidity: ",r2.daily[i].humidity);
                    console.log("icon: ",r2.daily[i].weather[0].icon);ß
                };
            });
        });




    };

    displayCityWeather();
