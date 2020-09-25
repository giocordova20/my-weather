

      function displayCityWeather() {

        var city = $(this).attr("data-city");
        var city = "Richmond";
        var state = "VA"
        tempUnit = "imperial"; // Farhenheit
        var currentIcon2="";
        var lat = "";
        var lon = "";
        var queryURL1 = "https:api.openweathermap.org/data/2.5/weather?appid=ba936e978e68dd024ee2931bbb340b72&q="+city+","+state+"us&units=imperial";
        // https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
        // api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={API key}
        //api.openweathermap.org/data/2.5/weather?zip=94040,us&appid={API key}

        $("#city").text(city+" 9/25/2020"+"--"+currentIcon2);
       // Creating an AJAX call for the specific city button being clicked
        $.ajax({
          url: queryURL1,
          method: "GET"
        }).then(function(response) {
            lat = response.coord.lat;
            lon = response.coord.lon;
            var cHigh = response.main.temp_max+"˚F";
            var cLow = response.main.temp_min+"˚F";
            var cHum = response.main.humidity+"%";
            console.log("")
            console.log("queryURL1", queryURL1);
            console.log("   response first query", response);
            console.log("   lat and lon:  "+ lat +" : "+lon);
            console.log("   temp Farhenheit:  ", response.main.temp);
            console.log("   TEMP max:  ", response.main.temp_max+"˚F");
            console.log("   TEMP low:  ", response.main.temp_min+"˚F");
            console.log("   HUMIDITY:  ", response.main.humidity+"%");
            console.log("   windspeed:  ", response.wind.speed+"mph");
            console.log("");
            $("#cHigh").text("High: "+cHigh);
            $("#cLow").text("Low: "+cLow);
            $("#cHum").text("Humidity: "+cHum);


            var queryURL2 = "https:api.openweathermap.org/data/2.5/onecall?appid=ba936e978e68dd024ee2931bbb340b72&lat="+lat+"&lon="+lon+"&exclude=hourly,minutely&units=imperial";
            console.log("queryURL2:   ",queryURL2);

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
                // console.log("  response2 humidity: ", currentHum2);
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

                // Get the 5 Day forecast
                for (var i = 0; i<5; i++){
                    var fDay = r2.daily[i].temp.day+"˚F";
                    var fNight = r2.daily[i].temp.night+"˚F";
                    var fHum = r2.daily[i].humidity+"%";
                    var fIcon = r2.daily[i].weather[0].icon;
                    
                    console.log("Day: ",i);
                    console.log("TEMP DAY: ",fDay);
                    console.log("TEMP NIGHT: ",fNight);
                    console.log("Humidity: ",fHum);
                    console.log("icon: ",fIcon);
                    
                    console.log("#fD"+i);
                    $("#fIcon"+i).text(fIcon);
                    $("#fD"+i).text("Day: "+fDay);
                    $("#fN"+i).text("Night: "+fDay);
                    $("#fN"+i).text("Night: "+fDay);




                };
            });


        });




    };

    displayCityWeather();
