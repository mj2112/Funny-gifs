$(document).ready(function() {
    // initial array of button topics to be shown
    var topics = ["Cat", "Dog", "Hamster", "Rabbit", "Birds", "Lemur", "Squirrel", "Goat", "Pig", "Panda"];
    var offsetNum = 0;
    var lastButton = "";
    // function to dynamically generate buttons from array topics as well as any new searches
    function renderButtons() {
        //empty buttons-view Div so the buttons don't just stack up with each rendering
        $("#buttons-view").empty();

        // Looping through the array of movies
        for (var i = 0; i < topics.length; i++) {
            // generate button element
            var buttons = $("<button>");
            // Add class of movie-btn to each button
            buttons.addClass("movie-btn");
            // Add data-attribute
            buttons.attr("data-name", topics[i]);
            // Providing the initial button text
            buttons.text(topics[i]);
            // Add button to the buttons-view div
            $("#buttons-view").append(buttons);
        }

    };
    renderButtons();

    // generate new gif topic buttons to button-view Div from user Search input
    $("#find-gif").on("click", function() {
        event.preventDefault();
        var newTopic = $("#gif-input").val().trim();
        topics.push(newTopic);
        renderButtons();
        // need to add something to clear search field after submitting
        return;
    });

    // function for getting gifs using API when button clicked
    $("#buttons-view").on('click', 'button', function() {
        //get data-name of button topic and store in variable
        var gifTopic = $(this).attr("data-name");
        if (gifTopic === lastButton) {
            offsetNum += 10;
        } else {
            offsetNum = 0;
        }


        //generate url query to giffy API including topic name, API key, and limit to 10
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=funny+" + gifTopic +
            "&api_key=S9kaV5WlMvPnfnhK8JohSrURZA0l3wva&offset=" + offsetNum + "&limit=10";


        console.log(gifTopic);
        console.log(queryURL);
        // API call
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            //store response.data object in variable
            var results = response.data;
            //empty the gif display Div
            $("#gif-view").empty();
            // for loop generating displayed gifs 
            for (var i = 0; i < results.length; i++) {
                //create div for gif img
                var newDiv = $("<div>");
                // create <p> for gif
                var p = $("<p>");
                //get gif rating and display in <p>
                p.text("Rating: " + results[i].rating);
                //create <img> element to put gif into
                var gifImg = $("<img>");
                // add the needed src and attributes to <img>
                gifImg.attr("src", results[i].images.fixed_height_still.url);
                gifImg.attr("data-still", results[i].images.fixed_height_still.url);
                gifImg.attr("data-animate", results[i].images.fixed_height.url);
                gifImg.attr("data-state", "still");
                gifImg.attr("class", "gif");
                //put <img>, <p>, into newDiv and newDiv into gif-view div to be displayed
                newDiv.append(p);
                newDiv.append(gifImg);
                $("#gif-view").prepend(newDiv);
            }
            lastButton = gifTopic;

        });

    });


    //function to pause and animate images upon clicking the gif image
    function animateGif() {
        //get state of gif (still vs animate)
        var state = $(this).attr("data-state");
        // create variables to store the src url for animated and still for the image clicked
        var animated = $(this).attr("data-animate");
        var still = $(this).attr("data-still");
        // logic to change url of displayed gif src
        if (state === "still") {
            // if image is still, change src to animate as well as the data-state to reflect this
            $(this).attr("src", animated);
            $(this).attr("data-state", "animate");
        } else if (state === "animate") {
            //if animated, change src back to still image as well as data-state to reflect this
            $(this).attr("src", still);
            $(this).attr("data-state", "still");
        }
    }
    // create click event for any image elements in gif-view div and run animateGif function
    $("#gif-view").on('click', 'img', animateGif);
    // clear gif-view div button in jumbotron
    $("#clearDisplay").on('click', function() {
        event.preventDefault();
        $("#gif-view").empty();
    })
});