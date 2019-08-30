//spotify info
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);


//fs 
var fs = require("fs");

//request info
var request = require("request");
var axios = require('axios');

//Monent - date formating
var moment = require("moment");

moment().format("MM/DD/YYYY")
// Make it so liri.js can take in one of the following commands:
// concert-this
// spotify-this-song
// movie-this
// do-what-it-says

var command = process.argv[2];
var value = process.argv.slice(3).join(" ")//value = concert,song, movie
console.log(value)
console.log(command)

switch (command) {
  case "concertThis":
    concertThis(value);
    break;
  case "spotifyThisSong":
    spotifyThisSong(value);
    break;
  case "movieThis":
    movieThis(value);
    break;

  case "doWhatItSays":
    doWhatItSays();
    break;
}
// if(command == "moviethis"){
//   movieThis()
// }
// else if (command == "spotifyThisSong"){
//   spotifyThisSong()
// }
// else if (command == "concerthis"){

//   concertThis()
// }

//to know about concert details Bands in Town Artist Events
function concertThis(value) {

  var query = "https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp"
  request(query, function (error, response, body) {
    var jsonData = JSON.parse(body)

    for (var i = 0; i < jsonData.length; i++) {
      var show = jsonData[i];
      // Print data about each concert
      // If a concert doesn't have a region, display the country instead
      // Use moment to format the date
      console.log(
        "\nVenue:" + show.venue.name +
        "," +
        "\nlocation:" + (show.venue.city || show.venue.sountry) +
        " " +

        "\nDate:" + moment(show.datetime).format("MM/DD/YYYY")
      );
    }
  })
}
// concertThis(value);


//spotify-this-song

function spotifyThisSong(value) {
  if (value === undefined) {
    value = "The sign";
  }

  spotify
    .search({ type: 'track', query: value },
      function (err, response) {
        if (err) {
          console.log("err " + err);
        }
        for (var i = 0; i < 5; i++) {
          var spotifyResults =

            "\nArtist(s):" + response.tracks.items[i].artists[0].name +
            "\nSong Name:" + response.tracks.items[i].name +
            "\nAlbum Name:" + response.tracks.items[i].album.name +
            "\nPreview link:" + response.tracks.items[i].preview_url;

          console.log(spotifyResults);

        }


      });
}
// .catch(function(err) {
//   console.log(err);
//  spotifyThisSong(value);


function movieThis(value) {
  if (!value) {
    value = "mr nobody";

  }
  axios.get("http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy").then(
    function (response) {

      var movieResults =
        "---------------------------------------------" +
        "\nMovie Title:" + response.data.Title +
        "\nYear the movie came out:" + response.data.Year +
        "\nIMDB Rating: " + response.data.imdbRating +
        "\nRotten Tomatoes Rating: " + response.data.Ratings[1].value +
        "\nCountry Produced: " + response.data.Country +
        "\nLanguage: " + response.data.Language +
        "\nPlot: " + response.data.Plot +
        "\nActors/Actresses: " + response.data.Actors;
      console.log(movieResults);

    })
    .catch(function (error) {
      console.log(error);

    });
}
// movieThis(value)

function doWhatItSays() {

  fs.readFile("random.txt", "utf8", function (error, data) {
    if (!error) {
      var doWhatItSaysResults = data.split(",");


      value=doWhatItSaysResults[1];
      console.log(doWhatItSaysResults);
      switch (doWhatItSaysResults[0]) {
               
        case "concertThis":
          concertThis(value);
          break;
        case "spotifyThisSong":
          spotifyThisSong(value);
          break;
        case "movieThis":
          movieThis(value);
          break;
      }
      // spotifyThisSong(doWhatItSaysResults[1]);
    } else {
      console.log("Error occurred" + error);
    }
})
};

